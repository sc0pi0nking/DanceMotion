/**
 * JSON-LD Structured Data
 * Schema.org markup for SEO
 */

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DanceMotion Eschweiler',
    url: 'https://dancemotion.org',
    logo: 'https://dancemotion.org/logo.png',
    description: 'Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Events',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Straße und Hausnummer',
      addressLocality: 'Eschweiler',
      addressRegion: 'NRW',
      postalCode: '52249',
      addressCountry: 'DE',
    },
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+49-XXX-XXXXXX',
      email: 'kontakt@dancemotion.org',
    },
    sameAs: [
      'https://www.facebook.com/dancemotion',
      'https://www.instagram.com/dancemotion',
    ],
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://dancemotion.org',
    name: 'DanceMotion Eschweiler',
    image: 'https://dancemotion.org/og-image.jpg',
    description: 'Tanzschule mit offenen Tanzgruppen und Events',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Straße und Hausnummer',
      addressLocality: 'Eschweiler',
      addressRegion: 'NRW',
      postalCode: '52249',
      addressCountry: 'DE',
    },
    priceRange: '€€',
    telephone: '+49-XXX-XXXXXX',
    url: 'https://dancemotion.org',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Wednesday'],
        opens: '16:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Thursday'],
        opens: '17:00',
        closes: '21:00',
      },
    ],
    areaServed: ['Eschweiler', 'NRW', 'Deutschland'],
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
