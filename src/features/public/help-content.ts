/**
 * Pusat Bantuan content. Kept as data so the page stays a layout problem and
 * the wording can be reviewed (and tested) without reading JSX.
 *
 * Accuracy rules:
 * - A result appears after a psychologist approves it; there is no automatic
 *   email/WhatsApp notification yet.
 * - A personal buyer gets a web result and, when the psychologist issues it, a
 *   one-page certificate. The four-page report belongs to institution sessions.
 * - WPT/CPMI keeps its own report and does not get a general certificate.
 */

export interface HelpStep {
  title: string;
  body: string;
}

export interface HelpFlow {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  steps: HelpStep[];
  note?: string;
}

export const HELP_FLOWS: HelpFlow[] = [
  {
    id: "alur-personal",
    eyebrow: "Peserta personal",
    title: "Membeli dan mengerjakan tes sendiri",
    description:
      "Cocok jika Anda ingin mengenali diri, minat, atau kemampuan tanpa melalui perusahaan.",
    steps: [
      {
        title: "Pilih tes",
        body: "Baca kategori, durasi, dan batas usia di halaman detail. Kalau masih ragu, mulai dari tes yang paling dekat dengan tujuan Anda.",
      },
      {
        title: "Bayar",
        body: "Anda diarahkan ke halaman pembayaran yang aman. Metode mengikuti penyedia: virtual account, QRIS, atau e-wallet.",
      },
      {
        title: "Kerjakan",
        body: "Tes dibuka dari dashboard. Jawaban tersimpan saat dijawab, jadi Anda bisa melanjutkan kalau koneksi terputus.",
      },
      {
        title: "Tunggu review psikolog",
        body: "Setelah selesai, hasil masuk antrean review. Statusnya terlihat di dashboard, tanpa perlu menghubungi admin.",
      },
      {
        title: "Unduh hasil",
        body: "Hasil muncul setelah disetujui. Sertifikat satu halaman diterbitkan psikolog setelahnya, untuk tes yang mendukung sertifikat.",
      },
    ],
    note: "Laporan empat halaman bukan bagian dari pembelian personal; laporan itu untuk peserta sesi instansi.",
  },
  {
    id: "alur-instansi",
    eyebrow: "Instansi",
    title: "Mengadakan tes untuk tim atau perusahaan",
    description:
      "Satu akun instansi mengelola slot, peserta, pembayaran, sampai laporan tiap peserta.",
    steps: [
      {
        title: "Buat akun instansi",
        body: "Isi data perusahaan dan PIC. Akun ini dipakai untuk mengelola sesi, bukan untuk mengerjakan tes sendiri.",
      },
      {
        title: "Pilih tes dan jumlah slot",
        body: "Tentukan tes dan berapa peserta yang akan mengerjakan. Biaya dihitung dari harga tes dikali jumlah slot.",
      },
      {
        title: "Bayar invoice",
        body: "Satu invoice untuk seluruh batch. Sesi aktif setelah pembayaran terkonfirmasi.",
      },
      {
        title: "Isi peserta dan bagikan akses",
        body: "Tambahkan nama peserta, lalu bagikan link sesi dan PIN kalau ada. Peserta bisa mengklaim kursinya lewat link itu.",
      },
      {
        title: "Pantau dan unduh",
        body: "Dashboard instansi menampilkan progres tiap peserta. Setelah psikolog menyetujui, laporan empat halaman dan sertifikat dapat diunduh.",
      },
    ],
    note: "Tidak ada email undangan otomatis pada versi ini. Link dan PIN dibagikan manual oleh pengelola.",
  },
  {
    id: "alur-sesi",
    eyebrow: "Peserta sesi",
    title: "Mengikuti tes dari link penyelenggara",
    description:
      "Peserta yang diundang instansi tidak perlu membuat akun. Cukup link sesi, nama, dan PIN bila diminta.",
    steps: [
      {
        title: "Buka link sesi",
        body: "Link diberikan oleh penyelenggara. Kalau link sudah kedaluwarsa atau sesi ditutup, hubungi penyelenggara.",
      },
      {
        title: "Isi nama dan PIN",
        body: "Masukkan nama sesuai identitas. PIN hanya diminta kalau penyelenggara mengaktifkannya.",
      },
      {
        title: "Simpan token peserta",
        body: "Setelah bergabung, sistem menampilkan token sekali. Simpan token itu; tanpa token, Anda tidak bisa melanjutkan di perangkat lain.",
      },
      {
        title: "Kerjakan tes",
        body: "Ikuti petunjuk di layar. Jawaban tersimpan saat dijawab, dan sisa waktu dihitung dari server.",
      },
      {
        title: "Lanjutkan dari perangkat yang sama",
        body: "Kalau terputus, buka kembali link sesi di perangkat yang sama. Hasil dan jadwal rilis dikelola penyelenggara.",
      },
    ],
    note: "Token peserta disimpan di browser perangkat. Jangan hapus data browser sebelum tes selesai.",
  },
];

export interface HelpDeliverableColumn {
  key: "personal" | "instansi" | "sesi";
  label: string;
}

export interface HelpDeliverableRow {
  label: string;
  values: Record<HelpDeliverableColumn["key"], string>;
}

export const HELP_DELIVERABLE_COLUMNS: HelpDeliverableColumn[] = [
  { key: "personal", label: "Personal" },
  { key: "instansi", label: "Instansi" },
  { key: "sesi", label: "Peserta sesi" },
];

export const HELP_DELIVERABLE_ROWS: HelpDeliverableRow[] = [
  {
    label: "Hasil tes",
    values: {
      personal: "Halaman hasil di dashboard setelah disetujui",
      instansi: "Hasil tiap peserta setelah disetujui",
      sesi: "Dikelola penyelenggara",
    },
  },
  {
    label: "Sertifikat 1 halaman",
    values: {
      personal: "Jika psikolog menerbitkannya",
      instansi: "Tersedia untuk tes non-WPT",
      sesi: "Mengikuti penyelenggara",
    },
  },
  {
    label: "Laporan 4 halaman",
    values: {
      personal: "Tidak termasuk",
      instansi: "Ya, per peserta",
      sesi: "Mengikuti penyelenggara",
    },
  },
  {
    label: "Verifikasi QR",
    values: {
      personal: "Di sertifikat yang diterbitkan",
      instansi: "Di laporan dan sertifikat",
      sesi: "Di dokumen yang diterbitkan",
    },
  },
  {
    label: "Pantauan progres",
    values: {
      personal: "Dashboard peserta",
      instansi: "Dashboard instansi",
      sesi: "Melalui penyelenggara",
    },
  },
];

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "pilih-tes",
    q: "Tes apa yang cocok untuk saya?",
    a: "Mulai dari tujuan Anda: mengenal kepribadian, minat dan bakat, gaya kerja, atau kemampuan kognitif. Setiap kartu tes mencantumkan kategori dan durasi. Kalau masih ragu, lihat panduan jalur personal di halaman ini.",
  },
  {
    id: "batas-usia",
    q: "Apakah ada batas usia?",
    a: "Sebagian tes punya norma usia. Kalau ada, rentangnya tampil di halaman detail dan tanggal lahir diminta sebelum tes dimulai. Tes tanpa norma usia tidak meminta data itu.",
  },
  {
    id: "perlu-akun",
    q: "Apakah saya harus punya akun?",
    a: "Untuk pembelian personal, ya. Untuk peserta sesi instansi, tidak perlu akun: cukup link sesi, nama, dan PIN bila diminta penyelenggara.",
  },
  {
    id: "metode-bayar",
    q: "Metode pembayaran apa saja?",
    a: "Mengikuti penyedia pembayaran yang aktif: virtual account, QRIS, atau e-wallet. Anda akan diarahkan ke halaman pembayaran aman; metode yang tersedia tampil di sana.",
  },
  {
    id: "batas-bayar",
    q: "Berapa lama batas pembayaran?",
    a: "Batas waktu tampil di halaman pembayaran. Setelah lewat, pesanan atau tagihan kedaluwarsa. Anda bisa membuat pesanan baru dari katalog; untuk tagihan instansi, hubungi admin bila perlu diterbitkan ulang.",
  },
  {
    id: "sudah-bayar",
    q: "Saya sudah bayar, tapi status belum berubah.",
    a: "Status diperbarui otomatis setelah pembayaran terkonfirmasi. Coba tombol Cek status sekarang di halaman pembayaran. Kalau masih belum berubah, hubungi admin dengan ID pesanan, nominal, dan waktu pembayaran.",
  },
  {
    id: "hp",
    q: "Bisa dikerjakan dari HP?",
    a: "Bisa. Gunakan browser modern dan koneksi yang stabil. Untuk tes dengan gambar atau grid, layar yang lebih besar tetap lebih nyaman.",
  },
  {
    id: "jawaban-tersimpan",
    q: "Apakah jawaban tersimpan?",
    a: "Ya. Setiap jawaban dikirim saat dijawab. Kalau koneksi terputus, buka kembali dashboard atau link sesi dan lanjutkan dari item terakhir.",
  },
  {
    id: "timer",
    q: "Apakah ada batas waktu pengerjaan?",
    a: "Sebagian tes punya batas waktu. Timer dihitung dari server, jadi menutup tab atau mengganti jam perangkat tidak menambah waktu. Jawaban tidak bisa diubah setelah waktu habis.",
  },
  {
    id: "data-pribadi",
    q: "Kenapa saya diminta tanggal lahir, jenis kelamin, atau pendidikan?",
    a: "Data itu dipakai untuk memilih norma yang tepat. Nilainya direkam sekali saat tes dibuka dan tidak bisa ditukar setelah soal terlihat, supaya hasil tetap konsisten.",
  },
  {
    id: "mengulang",
    q: "Apakah saya bisa mengerjakan ulang?",
    a: "Pembelian personal berlaku untuk satu pengerjaan. Untuk mengulang, buat pesanan baru. Peserta sesi instansi mengikuti aturan penyelenggara.",
  },
  {
    id: "hasil-otomatis",
    q: "Apakah hasil keluar otomatis?",
    a: "Tidak. Setelah tes selesai, hasil masuk antrean review psikolog. Anda bisa memantau status di dashboard tanpa perlu menghubungi admin.",
  },
  {
    id: "notifikasi",
    q: "Apakah saya dapat email atau WhatsApp saat hasil siap?",
    a: "Belum ada notifikasi email atau WhatsApp otomatis pada versi ini. Hasil muncul di dashboard setelah disetujui psikolog. Buka tab Riwayat untuk melihat statusnya.",
  },
  {
    id: "dikembalikan",
    q: "Apa arti status Dikembalikan?",
    a: "Psikolog meminta hasil diperiksa ulang. Lihat catatan di tab Riwayat. Kalau Anda peserta sesi, hubungi penyelenggara untuk tindak lanjut.",
  },
  {
    id: "koreksi",
    q: "Apakah hasil bisa dikoreksi?",
    a: "Psikolog dapat mengoreksi sebelum hasil disetujui. Setelah disetujui, hasil terkunci; perubahan dokumen dilakukan lewat revisi oleh penerbit.",
  },
  {
    id: "sertifikat-vs-laporan",
    q: "Apa bedanya sertifikat dan laporan?",
    a: "Sertifikat adalah dokumen satu halaman untuk peserta personal atau tes non-WPT. Laporan adalah dokumen empat halaman untuk peserta sesi instansi, berisi penilaian psikolog dan rekomendasi.",
  },
  {
    id: "sertifikat-kapan",
    q: "Kapan sertifikat terbit?",
    a: "Setelah psikolog menyetujui hasil dan menerbitkan sertifikatnya. Penerbitan tidak otomatis; kalau hasil sudah disetujui tetapi sertifikat belum muncul, tunggu proses penerbitan atau hubungi admin.",
  },
  {
    id: "sertifikat-semua",
    q: "Apakah semua tes dapat sertifikat?",
    a: "Tidak. WPT/CPMI punya dokumen laporan sendiri dan tidak menerbitkan sertifikat umum. Tes lain mengikuti dukungan dokumen masing-masing.",
  },
  {
    id: "nama-sertifikat",
    q: "Nama saya salah di sertifikat.",
    a: "Nama akun dipakai sebagai acuan awal saat psikolog menyiapkan dokumen. Hubungi admin atau penyelenggara secepatnya dengan nama yang benar; koreksi dilakukan sebelum dokumen diterbitkan.",
  },
  {
    id: "instansi-mulai",
    q: "Bagaimana cara memulai sebagai instansi?",
    a: "Buat akun instansi, pilih tes dan jumlah slot, bayar invoice, lalu isi peserta atau bagikan link sesi. Panduan lengkap ada di bagian Alur instansi.",
  },
  {
    id: "instansi-biaya",
    q: "Bagaimana biaya instansi dihitung?",
    a: "Total = harga tes dikali jumlah slot. Satu invoice untuk seluruh batch. Tidak ada biaya tersembunyi; jumlah slot menentukan total.",
  },
  {
    id: "instansi-join",
    q: "Bagaimana peserta instansi bergabung?",
    a: "Bagikan link sesi dan PIN bila ada. Peserta mengisi nama, menyimpan token peserta, lalu langsung mengerjakan tes tanpa membuat akun.",
  },
  {
    id: "instansi-progress",
    q: "Di mana saya melihat progres peserta?",
    a: "Dashboard instansi menampilkan status tiap peserta, attempt yang sedang berjalan, dan hasil yang sudah disetujui.",
  },
  {
    id: "ganti-email",
    q: "Bagaimana mengganti email atau nomor HP?",
    a: "Nomor HP dapat diubah dari tab Profil. Email dipakai untuk masuk, jadi perubahan email dilakukan oleh admin agar akun tidak terkunci.",
  },
  {
    id: "lupa-sandi",
    q: "Lupa kata sandi?",
    a: "Belum ada reset mandiri. Hubungi admin melalui kanal resmi dengan email akun Anda; admin akan membantu memulihkan akses.",
  },
  {
    id: "data-aman",
    q: "Apakah data saya aman?",
    a: "Data dipakai untuk keperluan tes dan penyusunan dokumen. Hasil hanya bisa diakses pemilik akun atau penyelenggara sesi. Halaman verifikasi publik tidak menampilkan skor.",
  },
  {
    id: "kode-verifikasi",
    q: "Di mana kode verifikasi?",
    a: "Kode tercetak di dekat QR pada dokumen: laporan halaman terakhir, sertifikat, atau invoice. Di layar, kode juga tampil di halaman dokumen terkait.",
  },
  {
    id: "kode-tidak-ditemukan",
    q: "Kenapa kode verifikasi tidak ditemukan?",
    a: "Periksa huruf dan angka; kode peka terhadap salah ketik. Kalau dokumen baru diterbitkan, tunggu proses penerbitan selesai. Kalau tetap tidak ditemukan, hubungi penerbit dokumen.",
  },
  {
    id: "dokumen-dicabut",
    q: "Apa arti Dibatalkan di halaman verifikasi?",
    a: "Penerbit sudah menarik dokumen tersebut, sehingga tidak berlaku. Hubungi penerbit untuk meminta dokumen pengganti atau penjelasan.",
  },
  {
    id: "skor-verifikasi",
    q: "Apakah skor terlihat di halaman verifikasi?",
    a: "Tidak. Halaman verifikasi sengaja hanya menampilkan status dan identitas yang diperlukan, bukan skor atau isi klinis.",
  },
];

export function faqById(id: string): FaqItem {
  const item = FAQ_ITEMS.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown FAQ id: ${id}`);
  return item;
}

export const LANDING_FAQ_IDS = [
  "hasil-otomatis",
  "notifikasi",
  "sertifikat-vs-laporan",
  "hp",
] as const;

export const TEST_FAQ_IDS = [
  "hasil-otomatis",
  "notifikasi",
  "dikembalikan",
  "hp",
  "jawaban-tersimpan",
  "timer",
  "data-pribadi",
  "sertifikat-vs-laporan",
] as const;

export interface HelpFaqGroup {
  id: string;
  title: string;
  ids: string[];
}

export const HELP_FAQ_GROUPS: HelpFaqGroup[] = [
  { id: "memilih", title: "Memilih tes", ids: ["pilih-tes", "batas-usia", "perlu-akun"] },
  {
    id: "pembayaran",
    title: "Pembelian & pembayaran",
    ids: ["metode-bayar", "batas-bayar", "sudah-bayar"],
  },
  {
    id: "mengerjakan",
    title: "Mengerjakan tes",
    ids: ["hp", "jawaban-tersimpan", "timer", "data-pribadi", "mengulang"],
  },
  {
    id: "hasil",
    title: "Hasil & review",
    ids: ["hasil-otomatis", "notifikasi", "dikembalikan", "koreksi"],
  },
  {
    id: "dokumen",
    title: "Sertifikat & laporan",
    ids: ["sertifikat-vs-laporan", "sertifikat-kapan", "sertifikat-semua", "nama-sertifikat"],
  },
  {
    id: "instansi",
    title: "Instansi",
    ids: ["instansi-mulai", "instansi-biaya", "instansi-join", "instansi-progress"],
  },
  { id: "akun", title: "Akun & data", ids: ["ganti-email", "lupa-sandi", "data-aman"] },
  {
    id: "verifikasi",
    title: "Verifikasi dokumen",
    ids: ["kode-verifikasi", "kode-tidak-ditemukan", "dokumen-dicabut", "skor-verifikasi"],
  },
];

export interface HelpGlossaryEntry {
  term: string;
  definition: string;
}

export const HELP_GLOSSARY: HelpGlossaryEntry[] = [
  {
    term: "Hasil",
    definition: "Halaman skor dan interpretasi yang muncul setelah psikolog menyetujui.",
  },
  {
    term: "Sertifikat",
    definition:
      "Dokumen satu halaman untuk peserta personal atau tes non-WPT, diterbitkan psikolog setelah hasil disetujui.",
  },
  {
    term: "Laporan",
    definition:
      "Dokumen empat halaman untuk peserta sesi instansi, berisi penilaian psikolog dan rekomendasi.",
  },
  {
    term: "Sesi",
    definition:
      "Wadah pengerjaan. Sesi personal berisi satu peserta; sesi instansi berisi banyak peserta.",
  },
  {
    term: "Slot",
    definition: "Kuota peserta yang dibeli instansi. Jumlah slot menentukan total biaya batch.",
  },
  {
    term: "Roster",
    definition: "Daftar peserta yang disiapkan instansi untuk mengisi slot sesi.",
  },
  {
    term: "Token peserta",
    definition:
      "Kode rahasia yang ditampilkan sekali setelah peserta bergabung. Dipakai untuk melanjutkan tes di perangkat yang sama.",
  },
  {
    term: "PIN",
    definition:
      "Kode tambahan dari penyelenggara untuk membatasi siapa yang boleh bergabung ke sesi.",
  },
  {
    term: "Review",
    definition: "Pemeriksaan hasil oleh psikolog sebelum hasil dirilis ke peserta.",
  },
  {
    term: "Disetujui",
    definition: "Psikolog sudah menyetujui hasil; halaman hasil dan dokumen menjadi tersedia.",
  },
  {
    term: "Dikembalikan",
    definition: "Psikolog meminta pemeriksaan ulang. Peserta melihat catatan di tab Riwayat.",
  },
  {
    term: "Dicabut",
    definition: "Dokumen yang sudah terbit ditarik penerbit dan tidak berlaku lagi.",
  },
];

export const HELP_CONTACT_CHECKLIST = [
  "Email akun atau nama peserta",
  "Nama tes yang dikerjakan",
  "ID pesanan atau nomor tagihan, kalau ada",
  "Tangkapan layar pesan error",
  "Waktu kejadian dan perangkat yang dipakai",
] as const;
