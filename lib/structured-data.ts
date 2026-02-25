/**
 * JSON-LD Structured Data
 * Schema.org markup for SEO
 * 
 * TODO: Echte Kontaktdaten aus Admin-Settings laden
 */

// Site configuration - should be moved to admin settings
const SITE_CONFIG = {
  name: 'DanceMotion Eschweiler',
  url: 'https://dancemotion.org',
  email: 'kontakt@dancemotion.org',
  city: 'Eschweiler',
  postalCode: '52249',
  region: 'NRW',
  country: 'DE',
};

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: 'Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Events',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.region,
      postalCode: SITE_CONFIG.postalCode,
      addressCountry: SITE_CONFIG.country,
    },
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: SITE_CONFIG.email,
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    image: `${SITE_CONFIG.url}/og-image.jpg`,
    description: 'Tanzschule mit offenen Tanzgruppen und Events',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.region,
      postalCode: SITE_CONFIG.postalCode,
      addressCountry: SITE_CONFIG.country,
    },
    priceRange: '€€',
    email: SITE_CONFIG.email,
    url: SITE_CONFIG.url,
    areaServed: [SITE_CONFIG.city, SITE_CONFIG.region, 'Deutschland'],
  };
}

export function getEventSchema(event: {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date + 'T' + event.time,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Eschweiler',
        addressCountry: 'DE',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'DanceMotion Eschweiler',
      url: 'https://dancemotion.org',
    },
    image: event.image_url || 'https://dancemotion.org/og-image.jpg',
  };
}

export function getGroupSchema(group: {
  name: string;
  description: string;
  slug: string;
  image_url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: group.name,
    description: group.description,
    url: `https://dancemotion.org/gruppen/${group.slug}`,
    image: group.image_url || 'https://dancemotion.org/og-image.jpg',
    parentOrganization: {
      '@type': 'Organization',
      name: 'DanceMotion Eschweiler',
      url: 'https://dancemotion.org',
    },
  };
}

export function getSponsorSchema(sponsor: {
  name: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: sponsor.name,
    description: sponsor.description,
    url: sponsor.website_url,
    logo: sponsor.logo_url,
  };
}
