import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  title: 'Bloomora | Handcrafted Creations • Little Creations. Endless Emotions.',
  description:
    'Thoughtful, authentic handmade keychains, everlasting floral bouquets, and bespoke gifts crafted with love in Vadodara, Gujarat by Bloomora.',
  keywords: [
    'bloomora',
    'bloomora vadodara',
    'handmade craft vadodara',
    'crochet bouquets',
    'handmade flowers',
    'personalized keychains',
    'vadodara gifts',
  ],
  authors: [{ name: 'Bloomora' }],
  icons: {
    icon: '/images/bloomora-logo.png',
    apple: '/images/bloomora-logo.png',
  },
  openGraph: {
    title: 'Bloomora | Handcrafted Creations',
    description:
      'Artisanal handmade gifts, keychains, and floral creations in Vadodara, Gujarat.',
    siteName: 'Bloomora',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/bloomora-logo.png',
        width: 1024,
        height: 1024,
        alt: 'Bloomora Handcrafted Creations Logo',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#C06C54',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
