export async function loadConfig() {
    // let response = await fetch('/web.config', { method: 'GET' });
    // let text = await response.text();

    // // Extraer la URL base de la API usando una expresión regular
    // let match = text.match(/<add key="ApiBaseUrl" value="(.+?)" \/>/);
    // if (match) {
    //     console.log("config: ",{ ApiBaseUrl: match[1] } )
    //     return { ApiBaseUrl: match[1] };
    // } else {
    //     throw new Error('No se pudo encontrar la configuración ApiBaseUrl en web.config.');
    // }
    return { ApiBaseUrl: "http://192.168.100.44:63644"};    
}