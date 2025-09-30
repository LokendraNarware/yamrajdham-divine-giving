import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate to Yamrajdham Temple - Support Temple Construction",
  description: "Make a donation to support the construction of Yamrajdham Temple. Your generous contribution helps build a sacred space for spiritual growth and community worship in Rajgarh Churu, Rajasthan.",
  keywords: [
    "Donate to Yamrajdham Temple",
    "Temple Donation",
    "Religious Donation",
    "Temple Construction Fund",
    "Spiritual Giving",
    "Hindu Temple Donation",
    "Dharam Dham Paavan Nagari Trust",
    "Temple Seva",
    "Divine Giving",
    "Sacred Donation"
  ],
  openGraph: {
    title: "Donate to Yamrajdham Temple - Support Temple Construction",
    description: "Make a donation to support the construction of Yamrajdham Temple. Your generous contribution helps build a sacred space for spiritual growth.",
    images: [
      {
        url: '/temple-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Yamrajdham Temple Construction - Support Our Mission',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Donate to Yamrajdham Temple",
    description: "Support the construction of Yamrajdham Temple with your generous donation.",
    images: ['/temple-hero.jpg'],
  },
  alternates: {
    canonical: '/donate',
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
