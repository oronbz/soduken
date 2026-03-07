import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Soduken',
    short_name: 'Soduken',
    description: 'A cozy Sudoku puzzle game',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FBF7EE',
    theme_color: '#FBF7EE',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
