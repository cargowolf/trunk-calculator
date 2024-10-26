import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trunk Calculator',
  description: 'Calculate if items fit in your car trunk',
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
