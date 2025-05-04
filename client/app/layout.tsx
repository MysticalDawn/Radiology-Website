import type { Metadata } from 'next'
import './globals.css'
import { PatientProvider } from '@/components/brain-dashboard'
import { Header } from "@/components/ui/header";

export const metadata: Metadata = {
  title: 'MWI Dashboard',
  description: 'Created with love',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="h-100 w-100 bg-black">
        <PatientProvider>
          <div className="flex flex-col min-h-screen min-w-screen bg-black text-slate-200 justify-center">
            <Header />
            {children}
          </div>
        </PatientProvider>
      </body>
    </html>
  )
}
