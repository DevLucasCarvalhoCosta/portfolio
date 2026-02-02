import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fvcp2-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'luizrosa.com.br',
      },
      {
        protocol: 'https',
        hostname: 'simpleicons.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
      {
        protocol: 'https',
        hostname: 'cursor.com',
      },
      {
        protocol: 'https',
        hostname: 'elysiajs.com',
      },
      {
        protocol: 'https',
        hostname: 'tanstack.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'workos.imgix.net',
      }
    ],
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);