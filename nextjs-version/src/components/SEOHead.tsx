import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: any;
  canonical?: string;
}

export default function SEOHead({
  title = 'Yamrajdham Temple - Divine Giving | Dharam Dham Paavan Nagari Trust',
  description = 'Support the construction of Yamrajdham Temple through your generous donations. Join Dharam Dham Paavan Nagari Trust in building a sacred space for spiritual growth, community worship, and divine justice in Rajgarh Churu, Rajasthan.',
  keywords = [
    'Yamrajdham Temple',
    'Dharam Dham Paavan Nagari Trust',
    'Temple Donation',
    'Spiritual Giving',
    'Hindu Temple',
    'Rajgarh Churu',
    'Rajasthan Temple'
  ],
  image = '/temple-hero.jpg',
  url = 'https://yamrajdhamtemple.org',
  type = 'website',
  structuredData,
  canonical
}: SEOHeadProps) {
  const baseUrl = 'https://yamrajdhamtemple.org';
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : fullUrl;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Dharam Dham Paavan Nagari Trust" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Yamrajdham Temple" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@yamrajdhamtemple" />
      <meta name="twitter:site" content="@yamrajdhamtemple" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#8B4513" />
      <meta name="msapplication-TileColor" content="#8B4513" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Yamrajdham Temple" />
      
      {/* Verification Tags */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />
      <meta name="yahoo-site-verification" content="your-yahoo-verification-code" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://sdk.cashfree.com" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Head>
  );
}

// Utility component for page-specific SEO
export function PageSEO({ 
  pageTitle, 
  pageDescription, 
  pageKeywords = [], 
  pageImage,
  structuredData 
}: {
  pageTitle: string;
  pageDescription: string;
  pageKeywords?: string[];
  pageImage?: string;
  structuredData?: any;
}) {
  const defaultKeywords = [
    'Yamrajdham Temple',
    'Dharam Dham Paavan Nagari Trust',
    'Temple Donation',
    'Spiritual Giving',
    'Hindu Temple',
    'Rajgarh Churu',
    'Rajasthan Temple'
  ];

  return (
    <SEOHead
      title={pageTitle}
      description={pageDescription}
      keywords={[...defaultKeywords, ...pageKeywords]}
      image={pageImage}
      structuredData={structuredData}
    />
  );
}
