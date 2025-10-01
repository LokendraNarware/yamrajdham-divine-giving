import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Yamrajdham Temple - Divine Giving | DHARAM DHAM TRUST",
    template: "%s | DHARAM DHAM TRUST"
  },
  description: "Support the construction of Yamrajdham Temple through your generous donations. Join DHARAM DHAM TRUST in building a sacred space for spiritual growth, community worship, and divine justice in Taranagar, Churu, Rajasthan.",
  keywords: [
    "Yamrajdham Temple",
    "DHARAM DHAM TRUST", 
    "Temple Donation",
    "Spiritual Giving",
    "Hindu Temple",
    "Taranagar Churu",
    "Rajasthan Temple",
    "Yamraj Temple",
    "Dharma Temple",
    "Spiritual Center",
    "Temple Construction",
    "Divine Justice",
    "Sanatan Dharma",
    "Temple Seva",
    "Religious Donation"
  ],
  authors: [{ name: "DHARAM DHAM TRUST" }],
  creator: "DHARAM DHAM TRUST",
  publisher: "DHARAM DHAM TRUST",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://https://dharamdhamtrust.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Yamrajdham Temple - Divine Giving | DHARAM DHAM TRUST",
    description: "Support the construction of Yamrajdham Temple through your generous donations. Join us in building a sacred space for spiritual growth and community worship.",
    url: 'https://https://dharamdhamtrust.org',
    siteName: 'Yamrajdham Temple',
    images: [
      {
        url: '/temple-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Yamrajdham Temple Construction - DHARAM DHAM TRUST',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Yamrajdham Temple - Divine Giving",
    description: "Support the construction of Yamrajdham Temple through your generous donations. Join us in building a sacred space for spiritual growth.",
    images: ['/temple-hero.jpg'],
    creator: '@yamrajdhamtemple',
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://https://dharamdhamtrust.org/#organization",
        "name": "DHARAM DHAM TRUST",
        "alternateName": "Yamrajdham Temple Trust",
        "url": "https://https://dharamdhamtrust.org",
        "logo": {
          "@type": "ImageObject",
          "url": "https://https://dharamdhamtrust.org/LOGO.png",
          "width": 400,
          "height": 400
        },
        "description": "DHARAM DHAM TRUST is dedicated to building Yamrajdham Temple, a divine center of spirituality, faith, and service in Taranagar Churu, Rajasthan.",
        "email": "dharamdhamtrust@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Taranagar Churu",
          "addressRegion": "Rajasthan",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://https://dharamdhamtrust.org"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://https://dharamdhamtrust.org/#website",
        "url": "https://https://dharamdhamtrust.org",
        "name": "Yamrajdham Temple - Divine Giving",
        "description": "Support the construction of Yamrajdham Temple through your generous donations. Join us in building a sacred space for spiritual growth and community worship.",
        "publisher": {
          "@id": "https://https://dharamdhamtrust.org/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://https://dharamdhamtrust.org/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "PlaceOfWorship",
        "@id": "https://https://dharamdhamtrust.org/#place",
        "name": "Yamrajdham Temple",
        "description": "A sacred temple dedicated to Yamraj (Dharmaraj), the divine guardian of moral order and justice in Hindu mythology.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Taranagar Churu",
          "addressRegion": "Rajasthan",
          "addressCountry": "IN"
        },
        "telephone": "+91-84273-83381",
        "url": "https://https://dharamdhamtrust.org",
        "sameAs": "https://https://dharamdhamtrust.org"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
          <Toaster />
          <WhatsAppIcon />
        </AuthProvider>
      </body>
    </html>
  );
}
