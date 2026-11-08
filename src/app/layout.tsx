import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Handmade Craft | Little Creations. Endless Emotions.',
  description:
    'Thoughtful, authentic handmade keychains, floral bouquets, and bespoke handmade gifts crafted with love in Vadodara, Gujarat.',
  keywords: [
    'handmade craft',
    'handmade gifts vadodara',
    'crochet bouquets',
    'handmade flowers',
    'personalized keychains',
    'vadodara gifts',
  ],
  authors: [{ name: 'The Handmade Craft' }],
  openGraph: {
    title: 'The Handmade Craft | Little Creations. Endless Emotions.',
    description:
      'Artisanal handmade gifts, keychains, and floral creations in Vadodara, Gujarat.',
    siteName: 'The Handmade Craft',
    locale: 'en_IN',
    type: 'website',
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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
