import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FocusMentex - Transform Audio to Lo-fi, Phonk, Melody & 8D',
  description: 'Transform any audio file (up to 4 minutes) into Lo-fi, Phonk, Melody, and 8D audio styles. Free online audio converter with instant processing.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
