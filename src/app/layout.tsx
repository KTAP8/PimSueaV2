import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'PimSuea | สั่งพิมพ์เสื้อออนไลน์',
  description: 'แพลตฟอร์มสั่งพิมพ์เสื้อสำหรับนักศึกษา',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="bg-white text-deep-black">
        <Header />
        {children}
      </body>
    </html>
  )
}
