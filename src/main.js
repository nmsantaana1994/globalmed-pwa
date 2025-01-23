import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
// import { loadConfig } from './configLoader.js'; // Importa la función para cargar la configuración
import { loadConfig } from './loadConfig.js';

// Crear la aplicación de Vue
let app = createApp(App);

(async () => {
    try {
        // Cargar configuración del archivo web.config
        let config = await loadConfig();
        console.log("config URL_API.ini: ", config);


        // Proveer la configuración para toda la app
        app.provide('apiConfig', { ApiBaseUrl: config });

        // Usar el router
        app.use(router);

        // Montar la aplicación
        app.mount('#app');
    } catch (error) {
        console.error('Error al cargar la configuración desde web.config:', error);
    }
})();


// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router/router.js';

// const app = createApp(App);

// app.use(router);

// app.mount('#app');