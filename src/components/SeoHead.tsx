import React, { useEffect } from 'react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const SeoHead: React.FC = () => {
  useEffect(() => {
    // Inject Schema.org JSON-LD Structured Data
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      'name': RESTAURANT_INFO.name,
      'alternateName': RESTAURANT_INFO.nameAmharic,
      'image': 'https://www.boleethiopianrestaurantatlanta.com/hero-platter.jpg',
      '@id': 'http://www.boleethiopianrestaurantatlanta.com/#restaurant',
      'url': 'http://www.boleethiopianrestaurantatlanta.com/',
      'telephone': RESTAURANT_INFO.phone,
      'priceRange': '$$',
      'servesCuisine': ['Ethiopian', 'African', 'Halal', 'Vegan'],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': RESTAURANT_INFO.address,
        'addressLocality': RESTAURANT_INFO.city,
        'addressRegion': RESTAURANT_INFO.state,
        'postalCode': RESTAURANT_INFO.zip,
        'addressCountry': 'US'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 33.6601438,
        'longitude': -84.4109405
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          'opens': '11:00',
          'closes': '22:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Friday', 'Saturday'],
          'opens': '11:00',
          'closes': '23:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': 'Sunday',
          'opens': '12:00',
          'closes': '22:00'
        }
      ],
      'hasMenu': 'http://www.boleethiopianrestaurantatlanta.com/#menu',
      'acceptsReservations': 'True'
    };

    const scriptId = 'json-ld-restaurant-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData);

    // Document Title & Meta
    document.title = 'Bole Ethiopian Restaurant Atlanta | Authentic Habesha Dining & Injera';
  }, []);

  return null;
};
