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
};