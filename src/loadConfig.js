export async function loadConfig() {
    try {
        // Cargar el archivo JSON
        const response = await fetch('/config.json');
        const config = await response.json();

        // Retornar la URL de la API
        return config.GENERAL.URL;
    } catch (error) {
        console.error('Error al cargar el archivo de configuración:', error);
        throw new Error('No se pudo cargar la configuración.');
    }
}