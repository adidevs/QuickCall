import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {ContextProvider} from './SocketContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuickCall',
  description: 'Connecting People Quickly',
  keywords: ['QuickCall', 'Video Call', 'Call', 'Video', 'Chat'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ContextProvider>
      <body className={inter.className}>
        {children}
      </body>
      </ContextProvider>
    </html>
  )
}
