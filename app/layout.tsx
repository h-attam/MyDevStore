import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Dev Store - E-ticaret & Portfolio',
  description: 'E-kitap ve ürün satışı + kişisel portfolio sitesi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-[#0f0f0f] text-[#ededed]`}>
        <Header />
        <main className="min-h-screen bg-[#0f0f0f]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

