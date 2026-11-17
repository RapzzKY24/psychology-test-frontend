/**
 * Every auth string in one place.
 *
 * Tone rules (docs/standards/frontend-standards.md §8):
 * - "kamu" belongs to the gateway invitation only; forms, errors, identity,
 *   security, and certificate notes use "Anda".
 * - No sales language: this is a psychology-test platform, not a store.
 * - No clinical promise. The tests map tendencies; they do not diagnose.
 * - Short sentences, active verbs.
 */
export const AUTH_COPY = {
  common: {
    processing: "Memproses...",
  },
  gateway: {
    eyebrow: "Sebelum masuk",
    title: "Halo, selamat datang",
    description: "Dua pertanyaan singkat supaya kami arahkan kamu ke tempat yang tepat.",
    peran: {
      question: "Kamu datang sebagai siapa?",
      pribadi: {
        label: "Untuk diri sendiri",
        description: "Mengerjakan tes dan melihat hasil pribadi.",
      },
      instansi: {
        label: "Untuk tim atau perusahaan",
        description: "Mengadakan tes untuk banyak peserta sekaligus.",
      },
    },
    status: {
      question: "Sudah pernah mengerjakan tes di mypsikolog.id?",
      sudah: {
        label: "Sudah pernah",
        description: "Masuk untuk melanjutkan tes dan melihat hasil yang sudah terbit.",
      },
      belum: {
        label: "Belum, ini pertama kali",
        description: "Buat akun dulu — cukup satu menit.",
      },
    },
    next: "Lanjut",
    back: "Kembali",
    skip: "Langsung masuk saja",
    changeSelection: "Ganti pilihan",
    stepOne: "Langkah 1 dari 2",
    stepTwo: "Langkah 2 dari 2",
  },
  masuk: {
    title: "Selamat datang kembali",
    description: "Masuk untuk melanjutkan tes dan melihat hasil yang sudah dirilis.",
    submit: "Masuk",
    instansiNote: "Pakai email PIC yang terdaftar untuk akun instansi.",
    forgot: "Lupa kata sandi? Hubungi admin.",
    footerQuestion: "Baru di mypsikolog.id?",
    footerAction: "Buat akun",
  },
  daftar: {
    title: "Buat akun",
    description: "Satu akun untuk mengerjakan tes, menyimpan hasil, dan mengunduh sertifikat.",
    submit: "Buat akun",
    privacy: "Data Anda hanya dipakai untuk keperluan tes dan penyusunan laporan.",
    footerQuestion: "Sudah punya akun?",
    footerAction: "Masuk",
    tabs: {
      pribadi: "Pribadi",
      instansi: "Instansi",
    },
  },
  instansi: {
    submit: "Buat akun instansi",
    note: "Akun instansi dipakai untuk mengelola sesi dan peserta, bukan untuk mengerjakan tes sendiri.",
    duplicate: "Email ini sudah terdaftar.",
    sections: {
      company: "Identitas resmi instansi Anda.",
      contact: "Email dipakai untuk masuk; nomor HP untuk konfirmasi.",
      security: "Minimal 8 karakter. Jangan bagikan ke siapa pun.",
    },
  },
  pribadi: {
    sections: {
      identity: "Nama lengkap dan email aktif Anda.",
      security: "Minimal 8 karakter.",
    },
  },
  fields: {
    name: {
      label: "Nama lengkap",
      placeholder: "Contoh: Budi Santoso",
      // This is the copy the client asked for: make the certificate link
      // explicit, so the name is typed deliberately rather than skipped.
      hint: "Tulis sesuai identitas Anda. Nama ini dipakai saat sertifikat disiapkan, jadi pastikan tidak ada salah ketik.",
    },
    email: {
      label: "Email",
      placeholder: "nama@email.com",
      hint: "Email aktif — dipakai untuk masuk ke akun Anda.",
    },
    password: {
      label: "Kata sandi",
      hint: "Minimal 8 karakter. Buat yang mudah Anda ingat dan sulit ditebak orang lain.",
    },
    confirmPassword: {
      label: "Konfirmasi kata sandi",
      hint: "Ulangi kata sandi yang sama.",
    },
  },
} as const;
