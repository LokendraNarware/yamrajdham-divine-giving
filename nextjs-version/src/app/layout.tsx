import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import WhatsAppIcon from "@/components/WhatsAppIcon";

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
    default: "Yamrajdham Temple - Divine Giving | Dharam Dham Paavan Nagari Trust",
    template: "%s | Yamrajdham Temple"
  },
  description: "Support the construction of Yamrajdham Temple through your generous donations. Join Dharam Dham Paavan Nagari Trust in building a sacred space for spiritual growth, community worship, and divine justice in Rajgarh Churu, Rajasthan.",
  keywords: [
    "Yamrajdham Temple",
    "Dharam Dham Paavan Nagari Trust", 
    "Temple Donation",
    "Spiritual Giving",
    "Hindu Temple",
    "Rajgarh Churu",
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
  authors: [{ name: "Dharam Dham Paavan Nagari Trust" }],
  creator: "Dharam Dham Paavan Nagari Trust",
  publisher: "Dharam Dham Paavan Nagari Trust",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yamrajdhamtemple.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Yamrajdham Temple - Divine Giving | Dharam Dham Paavan Nagari Trust",
    description: "Support the construction of Yamrajdham Temple through your generous donations. Join us in building a sacred space for spiritual growth and community worship.",
    url: 'https://yamrajdhamtemple.com',
    siteName: 'Yamrajdham Temple',
    images: [
      {
        url: '/temple-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Yamrajdham Temple Construction - Dharam Dham Paavan Nagari Trust',
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
        "@id": "https://yamrajdhamtemple.com/#organization",
        "name": "Dharam Dham Paavan Nagari Trust",
        "alternateName": "Yamrajdham Temple Trust",
        "url": "https://yamrajdhamtemple.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://yamrajdhamtemple.com/LOGO.png",
          "width": 400,
          "height": 400
        },
        "description": "Dharam Dham Paavan Nagari Trust is dedicated to building Yamrajdham Temple, a divine center of spirituality, faith, and service in Rajgarh Churu, Rajasthan.",
        "email": "dharamdhamtrust@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Rajgarh Churu",
          "addressRegion": "Rajasthan",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://yamrajdhamtemple.com"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://yamrajdhamtemple.com/#website",
        "url": "https://yamrajdhamtemple.com",
        "name": "Yamrajdham Temple - Divine Giving",
        "description": "Support the construction of Yamrajdham Temple through your generous donations. Join us in building a sacred space for spiritual growth and community worship.",
        "publisher": {
          "@id": "https://yamrajdhamtemple.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://yamrajdhamtemple.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "PlaceOfWorship",
        "@id": "https://yamrajdhamtemple.com/#place",
        "name": "Yamrajdham Temple",
        "description": "A sacred temple dedicated to Yamraj (Dharmaraj), the divine guardian of moral order and justice in Hindu mythology.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Rajgarh Churu",
          "addressRegion": "Rajasthan",
          "addressCountry": "IN"
        },
        "telephone": "+91-84273-83381",
        "url": "https://yamrajdhamtemple.com",
        "sameAs": "https://yamrajdhamtemple.com"
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
          <WhatsAppIcon />
        </AuthProvider>
      </body>
    </html>
  );
}
