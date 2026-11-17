/**
 * Public-page copy. One source so the wording cannot drift between the hero,
 * the catalog, and Pusat Bantuan.
 *
 * Rules (reviewed by tests):
 * - No diagnosis claims, no "dijamin"/"100%", no fake urgency.
 * - No promise of email/WhatsApp notifications (the system has none yet).
 * - Personal = web result + one-page certificate. Institution = four-page report.
 */
export const PUBLIC_COPY = {
  landing: {
    hero: {
      badge: "Tes psikologi berlisensi",
      title: "Kenali diri, lalu pahami langkah berikutnya.",
      description:
        "Kerjakan tes online, dapatkan hasil yang dibaca psikolog berlisensi, dan unduh dokumen resmi yang bisa diverifikasi.",
      primaryCta: "Lihat Tes",
      secondaryCta: "Cara Kerja",
      helpLink: "Pusat Bantuan",
      trustBadges: ["Psikolog berlisensi", "Dokumen terverifikasi QR", "Data Anda dijaga"],
    },
    audience: {
      eyebrow: "Untuk siapa",
      title: "Satu platform, tiga jalur.",
      description:
        "Pilih jalur yang sesuai. Setiap jalur punya alur, akses, dan dokumen yang berbeda.",
      cards: [
        {
          key: "personal",
          label: "Peserta personal",
          body: "Beli satu tes, kerjakan sendiri, lihat hasil dan sertifikat di dashboard.",
          href: "/tes",
          cta: "Lihat katalog",
        },
        {
          key: "instansi",
          label: "Instansi / perusahaan",
          body: "Beli slot, isi peserta, pantau progres, unduh laporan tiap peserta.",
          href: "/untuk-perusahaan",
          cta: "Lihat paket instansi",
        },
        {
          key: "sesi",
          label: "Peserta sesi",
          body: "Punya link atau PIN dari penyelenggara? Gabung tanpa membuat akun.",
          href: "/bantuan#alur-sesi",
          cta: "Baca panduan",
        },
      ],
    },
    steps: {
      eyebrow: "Cara kerja",
      title: "Dua jalur, satu tujuan: hasil yang bisa dipercaya.",
      description:
        "Personal membeli satu tes; instansi membeli slot untuk banyak peserta. Keduanya melewati review psikolog.",
      personal: {
        title: "Peserta personal",
        steps: [
          { title: "Pilih tes", body: "Baca kategori, durasi, dan batas usia." },
          { title: "Bayar", body: "Di halaman pembayaran yang aman." },
          { title: "Kerjakan", body: "Jawaban tersimpan; bisa dilanjutkan." },
          { title: "Review psikolog", body: "Pantau status di dashboard." },
          { title: "Unduh", body: "Hasil muncul setelah disetujui; sertifikat menyusul." },
        ],
      },
      instansi: {
        title: "Instansi",
        steps: [
          { title: "Buat akun", body: "Isi data perusahaan dan PIC." },
          { title: "Pilih tes & slot", body: "Biaya = harga tes × jumlah slot." },
          { title: "Bayar invoice", body: "Satu tagihan untuk seluruh batch." },
          { title: "Isi peserta", body: "Bagikan link/PIN; peserta klaim kursi." },
          { title: "Pantau & unduh", body: "Laporan 4 halaman per peserta." },
        ],
      },
      helpLink: "Panduan lengkap di Pusat Bantuan",
    },
    deliverables: {
      eyebrow: "Apa yang Anda terima",
      title: "Bukan semua jalur mendapat dokumen yang sama.",
      description:
        "Personal mendapat halaman hasil dan sertifikat. Instansi mendapat laporan empat halaman per peserta.",
      helpLink: "Bandingkan detail di Pusat Bantuan",
    },
    verification: {
      eyebrow: "Verifikasi",
      title: "Cek keaslian dokumen.",
      description:
        "Masukkan kode dari QR atau lembar dokumen. Halaman ini hanya menampilkan status, bukan skor.",
      helpLink: "Di mana kode saya?",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Pertanyaan yang sering masuk.",
      description: "Jawaban singkat untuk hal yang paling sering ditanyakan ke admin.",
      allLink: "Lihat semua pertanyaan",
    },
  },
  catalog: {
    title: "Tes Psikologi",
    description:
      "Pilih tes yang ingin Anda kerjakan. Setiap tes dikerjakan online dan hasilnya diverifikasi psikolog.",
    introTitle: "Cara memilih tes",
    introBody:
      "Mulai dari tujuan Anda. Kategori dan durasi ada di setiap kartu; batas usia, kalau ada, tampil di halaman detail.",
    introPoints: [
      "Pilih kategori yang paling dekat dengan kebutuhan.",
      "Cek durasi dan batas usia sebelum membeli.",
      "Hasil baru terbit setelah disetujui psikolog.",
    ],
    helpLink: "Belum yakin? Baca panduan memilih",
  },
  testDetail: {
    facts: {
      duration: "Durasi",
      category: "Kategori",
      result: "Hasil",
      resultValue: "Diverifikasi psikolog",
      document: "Dokumen",
      documentValue: "QR terverifikasi",
    },
    stepsTitle: "Cara Kerja",
    steps: [
      { title: "Pilih & bayar", body: "Pembelian personal atau sesi instansi." },
      { title: "Kerjakan online", body: "Ikuti petunjuk; jawaban tersimpan saat dijawab." },
      { title: "Review psikolog", body: "Hasil diperiksa sebelum dirilis." },
      { title: "Unduh hasil", body: "Lihat di dashboard; dokumen mengikuti jalur Anda." },
    ],
    deliverablesTitle: "Apa yang Anda terima",
    beforeStartTitle: "Sebelum mulai",
    beforeStart: [
      "Gunakan browser modern (Chrome, Safari, atau Edge).",
      "Siapkan waktu sesuai durasi; timer berjalan di server.",
      "Kerjakan di tempat tenang; jawaban tersimpan otomatis.",
      "Tes tertentu meminta tanggal lahir, jenis kelamin, atau pendidikan untuk memilih norma.",
    ],
    faqTitle: "Pertanyaan Umum",
    helpLink: "Baca Pusat Bantuan",
  },
  company: {
    title: "Tes psikologi untuk tim, tanpa ribet koordinasi.",
    description:
      "Beli slot, isi peserta, bagikan satu link. Pantau progres dan unduh laporan tiap peserta dari dashboard instansi.",
    primaryCta: "Buat akun instansi",
    secondaryCta: "Konsultasi WhatsApp",
    helpLink: "Baca panduan instansi",
    perksTitle: "Yang instansi dapat",
    perks: [
      {
        key: "dashboard",
        title: "Satu dashboard",
        body: "Progres peserta, status bayar, dan hasil dalam satu tempat.",
      },
      {
        key: "report",
        title: "Laporan per peserta",
        body: "Laporan 4 halaman; sertifikat 1 halaman untuk tes non-WPT.",
      },
      {
        key: "invoice",
        title: "Satu invoice",
        body: "Biaya = harga tes × jumlah slot. Virtual account atau QRIS.",
      },
      {
        key: "access",
        title: "Kendali akses",
        body: "Peserta bergabung lewat link/PIN; data untuk instansi Anda.",
      },
    ],
    stepsTitle: "Alur Paket Instansi",
    steps: [
      { title: "Buat akun instansi", body: "Isi data perusahaan dan PIC." },
      { title: "Pilih tes & slot", body: "Tentukan tes dan jumlah peserta." },
      { title: "Bayar invoice", body: "Satu tagihan; sesi aktif setelah dibayar." },
      { title: "Isi peserta", body: "Bagikan link/PIN; peserta klaim kursi." },
      { title: "Pantau & unduh", body: "Laporan dan sertifikat setelah disetujui." },
    ],
    joinTitle: "Bagaimana peserta bergabung",
    joinSteps: [
      "Bagikan link sesi dan PIN (kalau ada).",
      "Peserta mengisi nama, lalu menyimpan token peserta.",
      "Peserta mengerjakan tes tanpa membuat akun.",
    ],
    costTitle: "Biaya transparan",
    costBody:
      "Total dihitung dari harga tes dikali jumlah slot. Tidak ada biaya tersembunyi; satu invoice untuk seluruh batch.",
  },
  payment: {
    waiting:
      "Selesaikan pembayaran sebelum batas waktu. Status diperbarui otomatis; jangan tutup halaman.",
    paidOrder:
      "Pembayaran diterima. Buka dashboard untuk mulai tes; hasil muncul setelah review psikolog.",
    paidInvoice: "Pembayaran diterima. Buka sesi untuk mengisi peserta, lalu bagikan link/PIN.",
    failed: "Pesanan kedaluwarsa atau dibatalkan. Mulai pesanan baru dari katalog.",
    verifying:
      "Pembayaran tercatat di penyedia. Sistem sedang memperbarui status; halaman ini menyegarkan sendiri.",
    helpTitle: "Butuh bantuan pembayaran?",
    helpBody:
      "Kalau sudah membayar tetapi status belum berubah, cek status sekali lagi. Sertakan ID pesanan saat menghubungi admin.",
    helpLink: "Panduan pembayaran",
  },
  verification: {
    indexTitle: "Verifikasi Dokumen",
    indexDescription:
      "Periksa apakah laporan atau sertifikat tercatat resmi. Kode ada di QR atau lembar dokumen. Halaman ini tidak menampilkan skor.",
    lookupLabel: "Kode verifikasi",
    lookupPlaceholder: "Contoh: AB12CD34EF",
    lookupSubmit: "Cek dokumen",
    notFoundTitle: "Kode tidak ditemukan",
    notFoundBody:
      "Periksa huruf dan angka pada kode. Kalau dokumen baru diterbitkan, tunggu proses penerbitan selesai.",
    helpLink: "Baca panduan verifikasi",
    reportDescription:
      "Halaman ini memeriksa apakah laporan tercatat resmi. Kode ada di QR halaman terakhir atau lembar laporan. Halaman ini tidak menampilkan skor.",
    certificateDescription:
      "Halaman ini memeriksa keaslian sertifikat. Kode ada di QR atau lembar sertifikat. Halaman ini tidak menampilkan skor.",
    invoiceDescription:
      "Halaman ini menampilkan data invoice yang tercatat. Gunakan untuk memastikan tagihan instansi.",
  },
  help: {
    eyebrow: "Pusat Bantuan",
    title: "Temukan jawaban sebelum menghubungi admin.",
    description:
      "Alur, status, dokumen, dan istilah dijelaskan di satu tempat. Mulai dari jalur yang paling dekat dengan Anda.",
    navLabel: "Isi halaman",
    contactTitle: "Belum terjawab?",
    contactBody:
      "Hubungi admin melalui kanal resmi. Sertakan informasi berikut supaya pengecekan lebih cepat.",
    contactCta: "Hubungi via WhatsApp",
    contactFallback:
      "Kalau tombol WhatsApp tidak tersedia, gunakan kanal yang Anda pakai saat mendaftar.",
  },
} as const;
