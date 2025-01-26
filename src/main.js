import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { loadConfig } from './loadConfig.js';

// Crear la aplicación de Vue
let app = createApp(App);

(async () => {
    try {
        // Cargar configuración del archivo config.json
        let config = await loadConfig();
        console.log("config config.json: ", config);

        // Proveer la configuración para toda la app
        app.provide('apiConfig', { ApiBaseUrl: config });

        // Usar el router
        app.use(router);

        // Montar la aplicación
        app.mount('#app');
    } catch (error) {
        console.error('Error al cargar la configuración desde config.json:', error);
    }
})();