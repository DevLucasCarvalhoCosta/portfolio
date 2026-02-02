import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lucas Carvalho - Portfolio',
    short_name: 'Lucas Carvalho',
    description: 'Desenvolvedor Full-Stack com experiência em todo o ciclo de desenvolvimento. Especializado em React, TypeScript, Node.js e bancos de dados.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#a855f7',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
