# METAK Reels — gündəlik brif

Hər gün saat 12:00-da (Bakı vaxtı) METAK-ın məhsulları ilə bağlı bir maraqlı Reels hazırlanır.

## Format
- 9:16, 1080x1920, 30 fps, **50 saniyədən qısa** (səs ~40–45 s, son kadr üçün +2 s).
- Üslub: **Kurzgesagt-ilhamlı 3D** — three.js, düz rəngli dəyirmi formalar, işıq zolağı + kənar parıltısı (`kmat` şeyderi), tünd-canlı fon, parıldayan obyektlər, Nunito Black yazılar. Kurzgesagt-ın öz personajları/quşları kopyalanmır.
- Şablon: ən son günün `reel.html` faylı (məs. `2026-11-26-yerden-isitme/reel.html`). Köməkçilər: `kmat`, `o2`, `glowSprite`, `T`, `chip`, `chem`, `tick`, `cross`, `pop`, `S(t0, t1, bg, build)`.
- Render: `node render.mjs <gün>/reel.html <gün>/<ad>.mp4 --root . --audio <gün>/voice-pad.wav` (`metak-reels` qovluğundan). Önizləmə: `--preview --at 0,5,10`.
- Səsi videonun uzunluğuna qədər sükutla uzat: `ffmpeg -i voice.mp3 -af apad=whole_dur=<müddət> voice-pad.wav`.

## Ssenari qaydaları
- Əsas formula **STOP**: Surprise (gözlənilməz giriş) → Tension (problem/gərginlik) → Outcome (həll — METAK məhsulu) → Pass it on (paylaşmağa çağırış).
- Alternativlər (növbə ilə): AIDA, PAS, Open Loop, Storytelling, 4U, Pattern Interrupt.
- Azərbaycan dilində, ~85–95 söz. İlk 2 saniyədə maraqlı "qarmaq".
- Faktlar yalnız yoxlanılmış mənbələrdən. METAK məhsulu haqqında yalnız bildiyimiz iddialar (aşağıda); uydurma rəqəm, zəmanət, sertifikat yox.
- Son hissədə METAK məhsulunun reklamı.

## Səsləndirmə (ElevenLabs)
- Model: `eleven_v3`, səs: **Abbas - Engaging Delivery** (`voice_id: IVMbfLv3KqUc4qDj6Yif`). İstifadəçi "Arif" səsini bəyənmədi — **canlı, effektli, vurğulu** ifa istəyir.
- Canlılıq üçün teqlər: girişdə `[whispers]` → `[dramatically]`, faydada `[excited]`, problemdə `[serious]`/`[dramatically]`, sonda `[warmly]`/`[confident]`. Açar sözləri BÖYÜK hərflə yaz (OKSİGEN!, PASLANDIRIR, KƏSİR!), nida işarələri işlət.
- **Vurğu qaydaları** (IPA ilə yazılır, slash-lar arasında):
  - plastik → `/plasˈtik/` (vurğu son hecada: plas-TİK)
  - METAK → `/meˈtak/` (vurğu son hecada: me-TAK; hərf-hərf oxunmasın)
- Abbas yavaş və pauzalı danışır (~95 söz ≈ 55 s). Ssenarini ~80–85 sözdə saxla; lazım olsa 0.35 s-dən uzun pauzaları 0.24 s-ə qədər qısalt və `atempo=1.08` tətbiq et (50 s limitinə görə).
- Söz vaxtları üçün səsi `eleven_scribe_v1` ilə transkripsiya et (pulsuz), səhnələri sözlərə bağla.

## Fon musiqisi və səs effektləri (ElevenLabs)
- Musiqi: `eleven_music_v2_5`, instrumental, `duration_seconds` = video uzunluğu; sirli/oynaq giriş → gərgin orta → parlaq, inamlı final. Səsin altında sidechain ilə endirilir (həcm ~0.32).
- SFX: `eleven_text_to_sound_v3`, hər səs ayrıca node, 1 variant: whoosh (keçidlər), pop (yazılar/çiplər), sneaky (oğru), tiles, bubbles, riser (gərginlik), rust, powerdown, slide, shield, plane, chime (loqo). Hazır fayllar: `2026-11-26-yerden-isitme/audio/` (yenidən istifadə etmək olar).
- Miks: səs + musiqi (ducking) + SFX (`adelay` ilə animasiya hadisələrinə), `loudnorm=I=-14:TP=-1.5` (Instagram). Nümunə: 2026-11-26 qovluğundakı `mix.m4a` necə qurulub — `script.md`-yə bax.

## METAK məhsulları (bildiyimiz)
- 5 qatlı, oksigen baryerli yerdən isitmə borusu (istifadəçi təsdiqi).
- Yerdən isitmə borusu 16x2 (elanlarda görünür).
- Plastik borular (su, kanalizasiya, qofre/koruqe və s.) — dəqiq çeşidi mənbədən yoxla.

## Qovluq quruluşu
`metak-reels/YYYY-MM-DD-mövzu/` → `reel.html`, `voice.mp3`, `script.md`, `METAK-reels-YYYY-MM-DD-mövzu.mp4`.
Hər yeni mövzunu `TOPICS.md` jurnalına əlavə et ki, təkrar olmasın.
