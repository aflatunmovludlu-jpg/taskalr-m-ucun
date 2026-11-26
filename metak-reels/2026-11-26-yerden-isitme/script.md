# METAK Reels — 2026-11-26 — Yerdən isitmə borusu

**Formula:** STOP

**v2 (əsas):** `METAK-reels-2026-11-26-yerden-isitme-v2.mp4` — 47 s. Səs: Abbas - Engaging Delivery (daha canlı, teqlər + böyük hərf vurğuları), pauzalar qısaldılıb, +8% temp. ElevenLabs fon musiqisi (sidechain ducking) + 12 səs effekti, −14 LUFS.

**v1:** `METAK-reels-2026-11-26-yerden-isitme.mp4` — 44 s, Arif səsi, musiqisiz (istifadəçi bəyənmədi).

## Ssenari (ekranda / səsdə)

**S — Surprise (0–5.6 s)**
Döşəmənizin altında gizli bir oğru yaşaya bilər... Adı — oksigen.

**Kontekst (5.6–12.5 s)**
Yerdən isitmə evi aşağıdan, bərabər isidir. Ayaqlar isti, baş sərin — bədən üçün ən rahat istilik budur.

**T — Tension (12.5–23.4 s)**
Amma adi plastik boru oksigeni divarından içəri buraxır. Oksigen suya qarışır... və kombini, nasosu, kollektoru içdən paslandırır. Sistem səssizcə sıradan çıxır.

**O — Outcome (23.4–35.8 s)**
Həll sadədir — oksigen baryeri. METAK beş qatlı, oksigen baryerli yerdən isitmə borusu hazırlayıb. Ortadakı baryer təbəqəsi oksigenin yolunu kəsir. İstilik içəridə qalır, pas isə kənarda.

**P — Pass it on (35.8–44 s)**
Ev tikən dostunuza göndərin — qoy kombisi uzun ömür sürsün. METAK — istiliyin etibarlı yolu.

## ElevenLabs-a göndərilən mətn (vurğu üçün IPA)
plastik → `/plasˈtik/`, METAK → `/meˈtak/` (hər ikisində vurğu son hecada).

## Instagram üçün mətn (təklif)
Döşəmənin altında gizli oğru? 🕵️ Adi borular oksigeni içəri buraxır və kombini içdən paslandırır. METAK-ın 5 qatlı, oksigen baryerli yerdən isitmə borusu bu yolu bağlayır. Ev tikən dostuna göndər 👇
#METAK #yerdənisitmə #kombi #təmir #evtikintisi #Bakı

## Faktlar (mənbələr)
- Oksigen baryeri olmayan plastik borulardan oksigen keçir, suya qarışır və polad/çuqun hissələri (kombi, nasos, klapanlar) korroziyaya uğradır — REHAU, Emmeti, Onninen texniki materialları; DIN 4726 oksigen keçiriciliyinə limit qoyur.
- 5 qatlı boruda baryer (adətən EVOH) iki yapışqan qat arasında yerləşir.

## v2 audio miks
- Səs: `voice-abbas.mp3` (take B; 0.35 s-dən uzun pauzalar 0.24 s-ə endirilib, `atempo=1.08`).
- Musiqi: `audio/music.mp3` (eleven_music_v2_5, 46 s, instrumental), həcm 0.32, `sidechaincompress` ilə səsin altında endirilir.
- SFX (`audio/*.mp3`, eleven_text_to_sound_v3): tiles 0.7, sneaky+pop 3.0, whoosh keçidlərdə, pop çiplərdə, bubbles boruda, riser gərginlikdə, rust paslanmada, powerdown kombi sönəndə, slide qatlar açılanda, shield O2 sıçrayanda, plane kağız təyyarədə, chime loqoda (animasiya vaxtı; `reel.html`-dəki WARP ilə yeni səsə çevrilir).
- Final: `loudnorm=I=-14:TP=-1.5` → `mix.m4a`.
