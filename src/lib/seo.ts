import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = 'https://dharamdhamtrust.org';
  const defaultImage = '/temple-hero.jpg';
  
  return {
    title: {
      default: config.title,
      template: '%s | DHARAM DHAM TRUST'
    },
    description: config.description,
    keywords: config.keywords || [
      'Yamrajdham Temple',
      'DHARAM DHAM TRUST',
      'Temple Donation',
      'Spiritual Giving',
      'Hindu Temple',
      'Taranagar Churu',
      'Rajasthan Temple'
    ],
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.url ? `${baseUrl}${config.url}` : baseUrl,
      siteName: 'DHARAM DHAM TRUST',
      images: [
        {
          url: config.image || defaultImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'en_IN',
      type: config.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [config.image || defaultImage],
      creator: '@dharamdhamtrust',
    },
    alternates: {
      canonical: config.url ? `${baseUrl}${config.url}` : baseUrl,
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
  };
}

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'Yamrajdham Temple - Divine Giving | DHARAM DHAM TRUST',
    description: 'Support the construction of Yamrajdham Temple through your generous donations. Join DHARAM DHAM TRUST in building a sacred space for spiritual growth, community worship, and divine justice in Taranagar Churu, Rajasthan.',
    keywords: [
      'Yamrajdham Temple',
      'DHARAM DHAM TRUST',
      'Temple Donation',
      'Spiritual Giving',
      'Hindu Temple',
      'Taranagar Churu',
      'Rajasthan Temple',
      'Yamraj Temple',
      'Dharma Temple',
      'Spiritual Center',
      'Temple Construction',
      'Divine Justice',
      'Sanatan Dharma',
      'Temple Seva',
      'Religious Donation'
    ],
    url: '/',
    image: '/temple-hero.jpg'
  },
  
  about: {
    title: 'About Us - DHARAM DHAM TRUST',
    description: 'Learn about DHARAM DHAM TRUST, our mission to build Yamrajdham Temple, and our spiritual leader Mataji\'s divine guidance in Taranagar Churu, Rajasthan.',
    keywords: [
      'About DHARAM DHAM TRUST',
      'Yamrajdham Temple Trust',
      'Mataji Spiritual Leader',
      'Temple Mission',
      'Spiritual Guidance',
      'Taranagar Churu Temple',
      'Hindu Temple Trust',
      'Divine Mission',
      'Spiritual Education',
      'Community Service'
    ],
    url: '/about',
    image: '/mataji.png'
  },
  
  donate: {
    title: 'Donate to Yamrajdham Temple - Support Temple Construction',
    description: 'Make a donation to support the construction of Yamrajdham Temple. Your generous contribution helps build a sacred space for spiritual growth and community worship in Taranagar Churu, Rajasthan.',
    keywords: [
      'Donate to Yamrajdham Temple',
      'Temple Donation',
      'Religious Donation',
      'Temple Construction Fund',
      'Spiritual Giving',
      'Hindu Temple Donation',
      'DHARAM DHAM TRUST',
      'Temple Seva',
      'Divine Giving',
      'Sacred Donation'
    ],
    url: '/donate',
    image: '/temple-hero.jpg'
  },
  
  contact: {
    title: 'Contact Us - Yamrajdham Temple',
    description: 'Get in touch with DHARAM DHAM TRUST for temple visits, seva opportunities, donations, and spiritual guidance. Located in Taranagar Churu, Rajasthan.',
    keywords: [
      'Contact Yamrajdham Temple',
      'Temple Contact Information',
      'DHARAM DHAM TRUST Contact',
      'Temple Visit Information',
      'Seva Opportunities',
      'Taranagar Churu Temple',
      'Temple Office Hours',
      'Spiritual Guidance Contact'
    ],
    url: '/contact',
    image: '/temple-hero.jpg'
  },
  
  gallery: {
    title: 'Temple Gallery - Yamrajdham Temple Construction Progress',
    description: 'View the construction progress of Yamrajdham Temple. See photos of our sacred space, spiritual ceremonies, and community events at DHARAM DHAM TRUST.',
    keywords: [
      'Yamrajdham Temple Gallery',
      'Temple Construction Photos',
      'Temple Progress Images',
      'Spiritual Ceremonies',
      'Temple Events',
      'DHARAM DHAM TRUST Gallery',
      'Temple Architecture',
      'Sacred Space Photos'
    ],
    url: '/gallery',
    image: '/temple-hero.jpg'
  }
};

// Generate structured data for different page types
export function generateStructuredData(type: 'organization' | 'website' | 'place' | 'event', data?: any) {
  const baseUrl = 'https://dharamdhamtrust.org';
  
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "DHARAM DHAM TRUST",
        "alternateName": "Yamrajdham Temple Trust",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/LOGO.png`,
          "width": 400,
          "height": 400
        },
        "description": "DHARAM DHAM TRUST is dedicated to building Yamrajdham Temple, a divine center of spirituality, faith, and service in Taranagar, Churu, Rajasthan.",
        "email": "dharamdhamtrust@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Taranagar",
          "addressRegion": "Churu",
          "addressCountry": "IN"
        },
        "sameAs": [baseUrl]
      }
    ]
  };

  switch (type) {
    case 'website':
      baseStructuredData["@graph"].push({
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Yamrajdham Temple - Divine Giving",
        "alternateName": "Yamrajdham Temple",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/LOGO.png`,
          "width": 200,
          "height": 200
        },
        "description": "Support the construction of Yamrajdham Temple through your generous donations. Join us in building a sacred space for spiritual growth and community worship.",
        "email": "info@yamrajdham.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Delhi",
          "addressRegion": "Delhi",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://www.facebook.com/yamrajdham",
          "https://www.instagram.com/yamrajdham"
        ]
      });
      break;
      
    case 'place':
      baseStructuredData["@graph"].push({
        "@type": "PlaceOfWorship",
        "@id": `${baseUrl}/#place`,
        "name": "Yamrajdham Temple",
        "description": "A sacred temple dedicated to Yamraj (Dharmaraj), the divine guardian of moral order and justice in Hindu mythology.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Taranagar",
          "addressRegion": "Churu",
          "addressCountry": "IN"
        },
        "telephone": "+91-96625-44676",
        "url": baseUrl,
        "sameAs": [baseUrl]
      });
      break;
      
    case 'event':
      if (data) {
        baseStructuredData["@graph"].push({
          "@type": "Event",
          "name": data.name,
          "description": data.description,
          "startDate": data.startDate,
          "endDate": data.endDate,
          "location": {
            "@type": "Place",
            "name": "Yamrajdham Temple",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Taranagar Churu",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            }
          },
          "organizer": {
            "@id": `${baseUrl}/#organization`
          }
        });
      }
      break;
  }

  return baseStructuredData;
}

// Utility function to generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{name: string, url: string}>) {
  const baseUrl = 'https://dharamdhamtrust.org';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };
}

// Utility function to generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
