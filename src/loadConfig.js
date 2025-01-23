import ini from 'ini';

export async function loadConfig() {
    try {
        // Cargar el archivo .ini
        const response = await fetch('/URL_API.ini');
        const iniText = await response.text();

        // Parsear el contenido del archivo .ini
        const config = ini.parse(iniText);

        // Retornar la URL de la API
        return config.GENERAL.URL;
    } catch (error) {
        console.error('Error al cargar el archivo de configuración:', error);
        throw new Error('No se pudo cargar la configuración.');
    }
}