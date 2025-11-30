import './globals.css'
import { Inter } from 'next/font/google'
import { RootProvider } from '../components/providers/root-provider'


const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'IlmoQuranbar | Quran For Every Child',
  description: 'Sponsor a Quran circle or a student today.',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-plain text-plain transition-colors duration-300`} suppressHydrationWarning>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}