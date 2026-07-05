import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FA DIGITAL SERVICES LTD. — Ghana\'s #1 VTU & Digital Solutions Platform',
  description: 'We provide reliable digital solutions that make everyday transactions simple, fast and secure. Your trusted partner for digital services and innovation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
