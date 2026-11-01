# Skill: topo-archify-2d

Editor topologi 2D SVG rasa Archify. Dipakai setiap kerja di `topo-archify/`.

## Arsitektur
- Satu file `topo-archify/index.html`, tanpa build, tanpa dependency.
- State: `nodes[]`, `edges[]`, `areas[]` + `nodesById` cache. `seq`/`areaSeq` untuk id.
- Render penuh via `render()` — SVG di-`innerHTML=""` lalu gambar ulang: areas → glow kabel → kabel → label → partikel → nodes.
- Kamera: `cam={x,y,z}`, `applyCam()` set viewBox, `fitView()` center bounding box ke tengah layar.

## Aturan wajib
- Drag node JANGAN `render()` di `pointerdown` — node basi bikin kabel delay. Tandai select manual, render hanya saat `pointerup` + moved.
- Drag pakai `requestAnimationFrame` + posisi dibagi `cam.z` biar presisi saat zoom.
- Kabel tempel ke sisi terdekat via `edgeD()` (kanan/kiri/atas/bawah), bukan satu titik.
- Klik tanpa geser (< 4px) = pilih / target link. Geser = pindah.
- Pan kanvas: klik kiri di area kosong. Klik kanan di node = dropdown Link/Duplikat/Hapus.
- Undo/redo: `pushUndo()` SEBELUM mutasi (add/del/drag-up/type/resize). Snapshot JSON `{nodes,edges,areas,seq,areaSeq}`, max 100.
- Area: `areas[]` dengan `{x,y,w,h,label,color,fs}`. Resize via handle pojok, min 200×120.
- Slider/font-size: update atribut SVG langsung, JANGAN `render()` saat `oninput` (bikin slider mental). CSS jangan ngunci `font-size`.
- Flow animasi FULL: class `.flow` (dash jalan .7s) + glow kabel `.edge-glow` (lebar 6, opacity .18) + partikel `animateMotion` putih bercahaya (`drop-shadow` warna kabel, durasi 1.2–2.2s bervariasi). Gradient node `#nodeGrad` + highlight kaca + `drop-shadow` node + hover `brightness(1.25)`. Hormati `prefers-reduced-motion`.
- Export JSON sertakan `areas` + `areaSeq`. Save localStorage key `topo-archify`.
- Fit: ukur via `stageEl.clientWidth/Height` (bukan `cv`), animasi 300ms ease-out cubic, center = tengah bounding box.
