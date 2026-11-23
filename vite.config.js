import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: { host: true, port: 5173 },
  build: {
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], map: ['leaflet', 'react-leaflet'], supabase: ['@supabase/supabase-js'] } },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg', 'icons/apple-touch-icon.png'],
      devOptions: { enabled: true },
      manifest: {
        name: 'SunsetSpots',
        short_name: 'SunsetSpots',
        description: 'Die besten Orte für Sonnenauf- und -untergänge in deiner Nähe – mit Wolken-Prognose.',
        lang: 'de',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b0814',
        theme_color: '#120d1f',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Kartenkacheln: offline aus dem Cache
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 800, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Wetter: möglichst frisch, offline letzte Prognose
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'open-meteo',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // Spot-Fotos aus Supabase Storage
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'spot-photos',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Spot-Liste aus der Datenbank
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/,
            handler: 'NetworkFirst',
            method: 'GET',
            options: { cacheName: 'supabase-api', networkTimeoutSeconds: 6 },
          },
        ],
      },
    }),
  ],
})
