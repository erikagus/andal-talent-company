export interface Post {
  id: number
  title: string
  content: string
  image?: string
  author: string
  role: string
  date: string
}

export interface CurrentUser {
  name: string
  role: 'admin' | 'employee'
}

export const posts: Post[] = [
  {
    id: 1,
    title: 'Peluncuran Fitur Baru - Tim Engineering',
    content:
      '🎉 Selamat! Tim Engineering berhasil meluncurkan fitur baru hari ini. Terima kasih atas kerja keras semua pihak yang terlibat. Mari kita rayakan pencapaian ini bersama!',
    image: undefined,
    author: 'Admin User',
    role: 'Admin',
    date: 'May 15, 2025',
  },
  {
    id: 2,
    title: 'Update Apps Baru',
    content: '🎉 Kudos Product team. Aplikasi telah diperbarui dengan performa yang lebih baik dan tampilan yang lebih segar.',
    image: undefined,
    author: 'Admin User',
    role: 'Admin',
    date: 'May 14, 2025',
  },
  {
    id: 3,
    title: 'Training Session - Effective Communication',
    content:
      'Bergabunglah dengan sesi pelatihan komunikasi efektif yang akan membantu Anda meningkatkan kemampuan berkomunikasi di lingkungan profesional.',
    image: undefined,
    author: 'Admin User',
    role: 'Admin',
    date: 'Feb 23, 2024',
  },
]

export const currentUser: CurrentUser = {
  name: 'Admin User',
  role: 'admin',
}
