#!/usr/bin/env node
// render.mjs: turns an Animation Styles HTML file into a frame-exact MP4.
//
//   node render.mjs animation.html [out.mp4] [--audio voice.mp3] [--from 0] [--to 6] [--preview]
//
// Needs: Node 18+, ffmpeg on PATH, and ONE of puppeteer, puppeteer-core or playwright.
// Browser: set CHROME_PATH to any Chrome/Chromium. --preview saves 5 PNG frames instead of a video.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname, extname, join, basename, sep, relative } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2), VALUED = ["audio", "from", "to", "root", "at"];
const opt = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : args[i + 1]; };
const flag = k => args.includes("--" + k);
const pos = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && VALUED.includes(args[i - 1].replace(/^--/, ""))));
if (!pos[0]) { console.log("usage: node render.mjs animation.html [out.mp4] [--audio file] [--from s] [--to s] [--preview]"); process.exit(1); }
const html = resolve(pos[0]);
const out = resolve(pos[1] || html.replace(/\.html?$/i, "") + ".mp4");
const audio = opt("audio") ? resolve(opt("audio")) : null;
const fail = m => { console.error("render.mjs: " + m); process.exit(1); };
if (!existsSync(html)) fail("file not found: " + html);
if (!flag("preview") && spawnSync("ffmpeg", ["-version"]).status !== 0) fail("ffmpeg is not on PATH");

function load(name) {
  const bases = [process.cwd(), dirname(fileURLToPath(import.meta.url)), ...(process.env.NODE_PATH || "").split(/[;:]/).filter(Boolean).map(p => dirname(p))];
  for (const b of bases) { try { return createRequire(join(b, "x.js"))(name); } catch {} }
  try { return createRequire(import.meta.url)(name); } catch {}
  return null;
}
let launch, kind;
const pw = load("playwright") || load("playwright-core");
const pp = load("puppeteer") || load("puppeteer-core");
const chromePath = process.env.CHROME_PATH;
if (pw) { kind = "playwright"; launch = () => pw.chromium.launch({ headless: true, executablePath: chromePath, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--force-color-profile=srgb"] }); }
else if (pp) { kind = "puppeteer"; launch = () => pp.launch({ headless: true, executablePath: chromePath, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--force-color-profile=srgb"] }); }
else fail("no browser driver found (puppeteer, puppeteer-core or playwright)");

const root = opt("root") ? resolve(opt("root")) : dirname(html);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".wav": "audio/wav" };
const server = createServer(async (req, res) => {
  const p = resolve(root, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, ""));
  if (p !== root && !p.startsWith(root + sep)) { res.writeHead(403); return res.end(); }
  try { const b = await readFile(p); res.writeHead(200, { "Content-Type": MIME[extname(p).toLowerCase()] || "application/octet-stream" }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}/${relative(root, html).split(sep).map(encodeURIComponent).join("/")}?render=1`;

const browser = await launch();
let code = 0;
try {
  const page = await browser.newPage();
  const errors = []; page.on("pageerror", e => errors.push(String(e)));
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForFunction("window.ready === true", null, { timeout: 120000 }).catch(async () => { await page.waitForFunction("window.ready === true", { timeout: 120000 }); });
  const C = await page.evaluate("window.CONFIG");
  if (!C || !C.width) fail("the page has no window.CONFIG");
  if (kind === "puppeteer") await page.setViewport({ width: C.width, height: C.height, deviceScaleFactor: 1 });
  else await page.setViewportSize({ width: C.width, height: C.height });
  const fps = C.fps, from = Number(opt("from", 0)), to = Math.min(Number(opt("to", C.duration)), C.duration);
  const f0 = Math.round(from * fps), f1 = Math.round(to * fps);
  const shot = async f => { await page.evaluate(n => window.renderFrame(n), f); if (errors.length) throw new Error(errors[0]); return page.screenshot({ type: "png", clip: { x: 0, y: 0, width: C.width, height: C.height } }); };

  if (flag("preview")) {
    const dir = out.replace(/\.mp4$/i, "") + "-preview"; mkdirSync(dir, { recursive: true });
    const ks = (opt("at") ? opt("at").split(",").map(Number).map(s => (s * fps - f0) / (f1 - f0)) : [0, .1, .4, .7, 1]);
    for (const k of ks) { const f = Math.min(f1 - 1, Math.round(f0 + (f1 - f0) * k)); writeFileSync(join(dir, `frame-${String(f).padStart(5, "0")}.png`), await shot(f)); }
    console.log("preview frames in " + dir);
  } else {
    mkdirSync(dirname(out), { recursive: true });
    const ff = ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-"];
    if (audio) ff.push("-ss", String(from), "-i", audio, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-shortest");
    ff.push("-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(fps), "-movflags", "+faststart", out);
    const enc = spawn("ffmpeg", ff, { stdio: ["pipe", "inherit", "inherit"] });
    const ended = new Promise((ok, no) => enc.on("close", c => c === 0 ? ok() : no(new Error("ffmpeg exited " + c))));
    for (let f = f0; f < f1; f++) {
      const png = await shot(f);
      if (!enc.stdin.write(png)) await new Promise(r => enc.stdin.once("drain", r));
      if ((f - f0) % fps === 0) process.stdout.write(`\rframe ${f - f0 + 1}/${f1 - f0}`);
    }
    enc.stdin.end(); await ended;
    const pr = spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height,avg_frame_rate:format=duration", "-of", "json", out], { encoding: "utf8" });
    const info = pr.status === 0 ? JSON.parse(pr.stdout) : null;
    const v = info && info.streams.find(s => s.codec_type === "video");
    if (!existsSync(out) || statSync(out).size < 4096 || !v || v.width !== C.width || v.height !== C.height) throw new Error("the MP4 failed its check");
    console.log(`\nsaved ${out} (${v.width}x${v.height}, ${(+info.format.duration).toFixed(2)} s${info.streams.some(s => s.codec_type === "audio") ? ", with audio" : ""})`);
  }
} catch (e) { console.error("render.mjs: " + (e.message || e)); code = 1; }
finally { await browser.close(); server.close(); }
process.exit(code);
