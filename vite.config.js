import vue from '@vitejs/plugin-vue';
import { VitePWA } from "vite-plugin-pwa";

export default {
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "GlobalMed PWA",
                short_name: "GlobalMed",
                description:
                    "PWA desarrollada para uso en desposito de GlobalMed",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "img/icons/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "img/icons/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
                splash_pages: null,
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/your\.api\.domain\/.*$/,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "api-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 300,
                            },
                        },
                    },
                ],
            },
        }),
    ],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:63644",
                // target: "http://192.168.100.45:63644",
                // target: "http://192.168.100.45:63644",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
};