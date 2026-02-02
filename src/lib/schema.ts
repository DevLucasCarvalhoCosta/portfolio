import { Person, WebSite, WithContext } from 'schema-dts';

export function getPersonSchema(): WithContext<Person> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lucas Carvalho Costa',
    alternateName: 'Lucas Carvalho',
    jobTitle: 'Full-Stack Developer',
    description: 'Desenvolvedor Full-Stack com experiência em todo o ciclo de desenvolvimento de software. Especializado em React, TypeScript, Node.js e bancos de dados relacionais.',
    url: 'https://www.lucascarvalho.net',
    image: 'https://www.lucascarvalho.net/opengraph-image.png',
    sameAs: [
      'https://github.com/DevLucasCarvalhoCosta',
      'https://www.linkedin.com/in/devlucascarvalhocosta/',
    ],
    knowsAbout: [
      'TypeScript',
      'JavaScript',
      'React',
      'Next.js',
      'Node.js',
      'Java',
      'Spring Boot',
      'Python',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Full Stack Development',
      'Web Development',
      'RESTful APIs',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'UEG - Universidade Estadual de Goiás',
    },
  };
}

export function getWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lucas Carvalho - Portfolio',
    description: 'Portfolio de Lucas Carvalho Costa, Desenvolvedor Full-Stack',
    url: 'https://www.lucascarvalho.net',
    author: {
      '@type': 'Person',
      name: 'Lucas Carvalho Costa',
    },
    inLanguage: ['pt-BR', 'en-US'],
  };
}
