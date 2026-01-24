import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RBAC Management Tool',
  description: 'Internal tool for managing Role-Based Access Control',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} app-gradient-bg min-h-screen antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
