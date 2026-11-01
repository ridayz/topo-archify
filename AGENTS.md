# AGENTS.md — Smart Network Monitoring

## Skill: vision-ui-dark (mockup lokal vision-ui-mockup/)
Sumber gaya: https://demos.creative-tim.com/vision-ui-dashboard-react/ (referensi visual, bukan kode).
Pola lokal: vision-ui-mockup/index.html + style.css + app.js. Tiru polanya, jangan copas aset Creative Tim.

### Kapan dipakai
Setiap kerja UI web bergaya Vision UI: dashboard dark glass, kartu statistik, grafik, tabel device, mockup lokal.

### Visual system (wajib)
- Font: Plus Jakarta Sans. Tanpa italic. Heading 700/800, body 400/500/600.
- Copy: sentence case, tanpa kata yatim. Tanpa lorem ipsum di mockup final.
- Background: #060B28 + glow radial biru (#2B4EFF55) kanan atas + ungu (#7928CA44) kiri bawah.
- Kartu: class .glass — linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02)), border 1px rgba(255,255,255,.1), radius 20px, backdrop-filter blur(20px).
- Sidebar: 250px, kaca melayang rounded 20px, sticky, menu aktif gradient 135deg #0075FF→#00E0FF + shadow #0075FF66.
- Ikon stat: 46px rounded 12px, gradient per kartu: biru #0075FF→#00E0FF, pink #FF0080→#FFB547, hijau #01B574→#00E0FF, ungu #7928CA→#0075FF.
- Angka stat: 26px 800 putih. Label: 12-13px #A0AEC0. Delta naik #01B574, turun #FF4D6D.
- Grafik: Chart.js line tension .45 fill transparan, grid rgba(255,255,255,.06), tick #A0AEC0. Donut cutout 72%.
- Tabel: header 11px uppercase #A0AEC0, row border rgba(255,255,255,.06).
- Badge: up #01B57433/#01B574, down #FF4D6D33/#FF4D6D. Dot port: g #01B574, y #FFB547, r #FF0080.
- Spacing: gap 16px antar kartu, padding kartu 20px. Layout full-bleed: #wrap max-width none, margin 0, min-height 100vh; .row width 100%.
- States wajib: hover, active scale .98, focus ring #00E0FF, empty view, loading mockup 3 detik opsional.
- Jangan: background terang, border tegas, radius kecil, Material Icons, copas aset/CSS Creative Tim.

### Struktur kerja
Dashboard: topbar (crumb + search + tombol) > 4 stat > grafik 2:1 > 3 kartu (donut + latency + port) > tabel device. Kerjakan per section, bukan rebuild total.
Mockup lokal: folder vision-ui-mockup/ (index.html + style.css + app.js), data dummy di JS, tanpa backend.

## Skill: landing-page-design (elayadesign/ai-design-skills)
Sumber: https://github.com/elayadesign/ai-design-skills
Lisensi: MIT

### Kapan dipakai
Setiap kerja UI web: dashboard, komponen, prototype, review tampilan.
Aturan skill menang atas default framework. Instruksi user menang atas skill.

### Visual system (ringkas, wajib)
- Font: Geist / Manrope / Poppins. Jangan: Inter, Roboto, Arial. Tanpa italic. Maksimal bold/semibold.
- Copy: tanpa hyphen di kalimat, tanpa kata yatim (text-wrap balance/pretty).
- Ukuran font: hanya tangga Tailwind (text-xs s/d text-9xl). Tombol utama text-base semibold.
- Spacing: hanya 0/2/4/8/12/16/24/32/40/48/64/80/96 px.
- Radius: nilai Tailwind; inner = outer - gap (bila gap < 32px dan hasil > 2).
- Border card: full atau tidak sama sekali. Background: flat, tanpa gradient.
- Background dark: #000000 #181818 #1F1F1F #272727 #313131 #131209.
- Ikon: Phosphor / Solar / Iconamoon. Jangan Material Icons.
- Motion: ease cubic-bezier(0.22,1,0.36,1), duration-500 layout / 300 hover. Animasikan transform+opacity saja. Hormati prefers-reduced-motion.
- Scroll reveal: IntersectionObserver, naik 32px + fade 600-800ms, sekali saja.
- Konten realistis: tulis copy asli, nama + angka believable, tanpa kata filler (revolutionize, supercharge, dsb). Sentence case.
- States wajib: hover, active (scale .98), focus ring, loading skeleton, empty view, error inline spesifik. Tanpa alert(). Tanpa link mati. Nav aktif ditandai.
- Ship: semantic HTML (nav/main/section), alt image, title+meta+og, favicon, validasi form, skip-to-content, 404, link privacy/terms.

### Struktur kerja
Dashboard: hero ringkas > kartu metrik > grafik > topologi > tabel > alert > log. Kerjakan per section, bukan rebuild total.

## Skill: jakubkrehel/skills (interface)
Sumber: https://github.com/jakubkrehel/skills
Lisensi: MIT

### better-interface (review lintas disiplin)
- Urutan review: aksesibilitas > layout > writing > tipografi > warna > polish.
- Setiap temuan: lokasi file:line + bukti. Tanpa bukti = bukan temuan.
- HIGH: blokir tugas, menyesatkan, konten tersembunyi, risiko data, tanpa nama aksesibel, tanpa focus ring, hanya bisa pointer, abaikan reduced-motion, gagal kontras, makna hanya via warna, destruktif tanpa konfirmasi, error tanpa solusi.
- Perbaiki termurah dulu: hapus > pakai elemen native > pakai token proyek > betulkan nilai > tambah baru.
- Maks 15 temuan, satu root cause satu baris.

### better-ui (polish)
- Radius luar = radius dalam + padding (+ border). Padding > 24px = permukaan terpisah.
- Shadow untuk elevasi, border untuk struktur. Forced-colors: border transparent cadangan.
- Press: scale 0.96, 150ms ease-out, nonaktif tidak scale.
- Interaksi cepat (hover baris, tab, ketik): respons instan atau <=150ms opacity/background saja.
- Entrance jarang: stagger 100ms, opacity + blur 4px + translateY 12px, 300ms ease-out.
- Exit: 150ms, lebih pendek dari enter. Jangan animasi first render state swap.
- Transisi: sebut properti (jangan all). Keyframes hanya untuk sekali jalan.
- Hover hanya di @media (hover:hover). Overlay scroll: overscroll-behavior contain.
- Ikon: satu library per permukaan, currentColor, outline default fill aktif, stroke ikut berat teks.
- Reduced motion: gerakan/scale/blur hanya di prefers-reduced-motion no-preference, fallback cross-fade opacity.

## Skill: mengto/skills (design workflow)
Sumber: https://github.com/mengto/skills
Lisensi: MIT

### Filosofi (wajib)
- Prompt adalah aset: simpan, versikan, jadikan library.
- Spesifikasi > vibe: constraints jelas, hierarki jelas, iterasi 1-2 hal saja.
- Referensi > paragraf: screenshot/contoh lebih kuat dari deskripsi.
- Skill = prosedur operasi: kapan dipakai, apa dulu, default apa, salah apa.

### design-first-ui-prompting (bikin UI konsisten)
- Struktur prompt: GOAL > FORMAT > LAYOUT > TYPE > COLOR > IMAGERY > COPY > CONSTRAINTS > NEGATIVE.
- Kunci satu sistem dulu (layout+hierarki+copy), varian ubah SATU variabel saja.
- Tipografi rapuh: 2-pass (layout tanpa teks, typeset terpisah).
- Satu aksen warna saja, jangan rainbow. Texture grain, bukan plastik.
- Iterasi: spacing, kontras, hierarki satu hero + satu support, constraints card.

### build-awwwards-quality-sites (bar kualitas)
- Art direction dulu sebelum code: thesis visual, hero asset, hierarki type, sistem warna, urutan section, narasi motion.
- Aset orisinal: foto untuk avatar (jangan inisial/siluet), ikon Solar via Iconify, tanpa logo palsu/testimoni fake.
- Hero: viewport pertama momen terkuat, intro GSAP, tetap utuh tanpa JS/WebGL/motion.
- Motion: GSAP utama, SATU smooth-scroll engine saja (Lenis ATAU Locomotive). Hormati reduced-motion (render final state).
- Three.js hanya bila perlu (depth/transisi/pointer). Cap DPR, pause offscreen, ada poster statis, dispose semua.
- Tolak: gradient blob generik, bento ornamen, glass di mana-mana, layout stok, motion tanpa narasi.
- Validasi: production build, desktop+mobile, keyboard+focus+touch, tanpa placeholder/logo curian, laporkan stack + limitasi.

## Skill: GACS-Dashboard (safrinnetwork) � network monitoring + topologi
Sumber: https://github.com/safrinnetwork/GACS-Dashboard
Lisensi: MIT. Stack: PHP 8.3, MySQL, Apache/Nginx, Composer. Integrasi: GenieACS (TR-069), MikroTik API, Telegram Bot + webhook.

### Arsitektur (tirukan polanya)
- index/login/logout + init.php sekali pakai lalu HAPUS. Ganti password default segera.
- dashboard.php + devices.php + device-detail.php + map.php + view-logs.php, layout di views/layouts.
- lib/: GenieACS.php + GenieACS_Fast.php, MikroTikAPI.php, TelegramBot.php, PONCalculator.php, PermissionManager.php, RateLimiter.php, ReportGenerator.php, Logger.php, helpers.php.
- api/: dashboard-stats, get-devices (+chunked), get-device-detail, summon-device, uplink-stats, hotspot-traffic, health-check, save/test genieacs/mikrotik/telegram, update wifi/wan/dhcp/password, bulk tag/delete, client-log, map CRUD (items, connections, waypoints, netwatch, ODP/PON ports, used ports, server links), recalculate-odp-power.
- cron/ untuk polling berkala, webhook/telegram.php untuk notifikasi, config/ untuk kredensial (jangan commit .env).

### Integrasi (urutan wajib)
1. GenieACS: host + port 7557 + user + pass > test connection > save.
2. MikroTik: host + port API + user + pass > test > save.
3. Telegram: token dari BotFather + chat id > setWebhook ke webhook/telegram.php.
4. Init: buka init.php, login user1234/mostech, selesaikan task, hapus init.php.

### Fitur yang dibawa ke mockup kita
- Stats ringkas: total/online/offline device, uplink, hotspot traffic.
- Device list chunked + search + bulk aksi + summon + remote config (wifi/wan/dhcp).
- Device detail: info + log + aksi (reboot, summon, update config).
- Peta topologi Leaflet: item draggable, koneksi polyline editable + waypoint, ODP/PON port mapping, kalkulasi power budget PON, netwatch overlay.
- Log terpusat + viewer dengan filter level.
- Telegram: alert offline/lambat/pulih + preview singkat + command via webhook.
- Health-check endpoint + rate limit + permission per peran + report generator.

### Aturan main
- Polling hemat: chunked + fast client untuk list besar, cache stats, rate limit API.
- Setiap aksi destruktif konfirmasi + log. Kredensial hanya di config/.env.
- Power PON dihitung ulang tiap perubahan port (recalculate-odp-power).
- Peta: posisi item tersimpan (update-position), koneksi tersimpan (waypoints), server link terpisah.


## Skill: Centreon � enterprise monitoring + AIOps
Sumber: https://github.com/centreon/centreon
Lisensi: Apache-2.0. Skala: 35rb+ commit. Instal: source / package / ISO / VM. Rilis 1 mayor/tahun, lifecycle 18 bln.

### Cara kerja (inti yang ditiru)
- Objek dasar: Host (perangkat: nama unik, alias, IP/DNS, SNMP community, poller, timezone) + Service (yang dicek di host: ping, CPU, disk, HTTP).
- Template berlapis: host/service dikonfig via template bertingkat. Template atas menang bila konflik. Urutan bisa digeser. Centang "create services from template" untuk auto generate service.
- Alur wajib: tambah host/service > deploy konfigurasi ke monitoring engine. Tanpa deploy = tidak jalan.
- Check: active (engine tanya terjadwal: normal interval saat OK, retry interval + max attempts sebelum vonis Not-OK) + passive (host kirim sendiri, freshness threshold jaga basi).
- Flap detection (status genit naik turun), retain status, event handler (perintah auto saat status berubah, bisa self-heal tanpa notif).
- Parent host: matikan notif anak bila induk mati (hindari banjir alert). Host group + kategori + severity + koordinat geo untuk MAP.
- Notifikasi: per kontak/grup kontak, opsi status apa saja, interval antar notif (0 = sekali), periode aktif, delay notif pertama + delay recovery, acknowledgement dengan timeout.
- Poller/remote: host ditugaskan ke central atau poller tertentu. Auto discovery untuk scan massal.
- Modul: MAP (peta geo), MBI (reporting), DSM, HA, Open Tickets, AIOps anomaly detection, auto remediation, service mapping, mobile, API.

### Fitur yang dibawa ke mockup kita
- Konsep template: satu perangkat ikut banyak template, auto generate check.
- Status bertingkat: OK > Warning > Critical > Unknown, dengan soft/hard state (max attempts).
- Parent/child untuk redam alert berlapis. Flap detection biar status genit tidak spam.
- Notifikasi cerdas: delay, interval, periode, acknowledgement, recovery.
- Deploy config sebagai gerbang: perubahan draft > deploy > live.
- Geo + severity untuk peta dan prioritas. Reporting MBI untuk laporan berkala.

### Aturan main
- Nama host unik tanpa spasi/simbol aneh. IP bisa DNS + tombol resolve.
- Semua check punya periode + interval normal/retry + max attempts.
- Notifikasi selalu: siapa > kapan > status apa > jeda berapa > delay berapa.
- Perubahan config tidak live sebelum deploy. Discovery massal via template, bukan satu-satu.

## Skill: LnfMonitor (AllonsoHenzo) � realtime system dashboard Node+React
Sumber: https://github.com/AllonsoHenzo/Lnfmonitor_dashboard
Lisensi: MIT. Stack: React + Vite + Tailwind, Node backend, nginx, .deb / Docker / Podman / Compose. Env: VITE_API_URL.

### Arsitektur (tirukan polanya)
- frontend/src (React + Vite + Tailwind, grafik custom) + backend (Node: server.js + routes/) + nginx reverse proxy. Satu env untuk URL API.
- Metrik inti: CPU realtime, memori RAM, jaringan up/down, disk, tabel proses aktif.
- Jalankan lokal via .deb (lnfmonitor) atau container di :3000, backend :8080.
- Frontend polling ke backend, backend baca OS langsung. Tanpa agen tambahan.

### Fitur yang dibawa ke mockup kita
- Kartu metrik live dengan polling ringan (CPU, RAM, net, disk).
- Grafik custom ringan tanpa lib berat bila memungkinkan.
- Tabel proses/perangkat sortable + search.
- Packaging rapi: .deb untuk install sekali klik, compose untuk demo.
- Satu env config (VITE_API_URL) untuk pindah local ke remote.

### Aturan main
- Pisahkan frontend/backend/nginx walau kecil. Env tunggal untuk base URL.
- Polling interval wajar, jangan spam. Tampilkan unit jelas (%, MB, Mbps).
- Sediakan compose + .deb agar mudah coba. README dua bahasa bila perlu.

