import vue from '@vitejs/plugin-vue';
import { VitePWA } from "vite-plugin-pwa";

export default {
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: false,
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
    // base: '/PWA/', // Ajustar la base si es necesario
    // build: {
    //     outDir: 'dist',
    // },
    // server: {
    //     proxy: {
    //         "/api": {
    //             // target: "http://localhost:63644",
    //             // target: "http://172.27.144.1:63644",
    //             target: "http://192.168.100.45:63644",
    //             changeOrigin: false,
    //             rewrite: (path) => path.replace(/^\/api/, ""),
    //         },
    //     },
    // },
};