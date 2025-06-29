import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vachon - UX Design Studio',
  description: 'Crafting digital experiences that matter. UX design studio specializing in transforming complex problems into intuitive digital solutions.',
  keywords: ['UX Design', 'UI Design', 'Design Studio', 'Digital Design', 'User Experience'],
  authors: [{ name: 'Vachon Design Studio' }],
  creator: 'Vachon Design Studio',
  publisher: 'Vachon Design Studio',
  openGraph: {
    title: 'Vachon - UX Design Studio',
    description: 'Crafting digital experiences that matter. UX design studio specializing in transforming complex problems into intuitive digital solutions.',
    url: 'https://vachon.design',
    siteName: 'Vachon Design Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vachon - UX Design Studio',
    description: 'Crafting digital experiences that matter. UX design studio specializing in transforming complex problems into intuitive digital solutions.',
    creator: '@vachondesign',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code-here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}