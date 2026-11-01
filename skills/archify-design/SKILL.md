# Skill: archify-design (gaya visual + pola UI)

Dipakai setiap bikin UI bergaya Archify / evidence console.

## Visual system
- Font: `Plus Jakarta Sans` (UI) + `JetBrains Mono` (label/teknis). Tanpa italic. Heading 700/800, body 400/500/600.
- Background: `#060B28` / `#070b1a` + glow radial biru `#2B4EFF55` kanan atas + ungu `#7928CA44` kiri bawah. (Hapus glow bila lag.)
- Kartu: `.glass` — gradient `rgba(255,255,255,.07)→.02`, border `1px rgba(255,255,255,.1)`, radius 20px, `backdrop-filter: blur(20px)`. Hapus blur bila lag.
- Node SVG: body gradient `#182444→#0d1530`, highlight kaca di atas (`stroke rgba(255,255,255,.22)`), `drop-shadow(0 6px 18px rgba(0,0,0,.55))`.
- Semantik warna: cyan `#22d3ee` frontend, hijau `#34d399` backend, ungu `#a78bfa` database, rose `#fb7185` security, amber `#fbbf24` cloud, oranye `#fb923c` transit.
- Kabel: `stroke-width 2.2`, `linecap round`, glow bawah (`opacity .18`, width 6), dash flow `10 8` animasi `.7s linear infinite`, partikel `animateMotion` titik putih + `drop-shadow` warna kabel.
- Label kabel: mono 10px `#8b94ad`, tengah path.
- Area/zone: `fill` warna 5% opacity, garis dashed `10 6`, header mono bold uppercase + ikon ▦, handle resize kotak 18px.
- Status bar: mono 11px, angka hijau.

## Pola interaksi
- Tambah node: drag dari palette ATAU klik shape.
- Sambung: klik kanan node → dropdown (Link/Duplikat/Hapus) → klik target. Pan: klik kiri area kosong. Zoom: scroll (smooth lerp `.25`), tombol +/−/Fit, Ctrl+scroll opsional.
- Drag: threshold 4px bedakan klik vs geser. Update via rAF, koordinat dibagi zoom.
- Auto layout: BFS depth dari node tanpa incoming → kolom per depth (jarak 220×110) → reset kamera → fit animasi 300ms.
- Fit: bounding box semua objek → center tepat tengah layar → zoom pas (max 2x).
- Undo/redo: tombol + Ctrl+Z / Ctrl+Y, snapshot JSON max 100.
- Inspector kanan: edit label/sub/tipe/warna; area: nama + slider font-size (live, tanpa render) + warna nama (Cyan/Hijau/Ungu/Merah/Kuning/Oranye).
- Warna ke user SELALU nama bahasa, jangan hex.
- Hormati `prefers-reduced-motion`: matikan flow + partikel.

## Copy
- Sentence case, tanpa lorem ipsum, tanpa kata filler (revolutionize, supercharge).
- Status konkret: "kabel nyambung ✓", "50 node dalam 4 area ✓", bukan "berhasil".
