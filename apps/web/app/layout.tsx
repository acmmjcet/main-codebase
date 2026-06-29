import './global.css';
import LenisProvider from '@/components/LenisProvider';

export const metadata = {
  title: 'ACM MJCET Student Chapter',
  description: 'Official website of the ACM Student Chapter at MJCET — fostering computing excellence, technical innovation, and community among students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
