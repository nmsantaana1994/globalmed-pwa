<script>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { setSession } from '../session.js';
import { useNotifications } from '../notification.js';

export default {
    name: 'Login',
    setup() {
        let apiConfig = inject('apiConfig'); // Inyectar configuración global
        let usuario = ref('');
        let password = ref('');
        let error = ref('');
        let router = useRouter();
        let { addNotification } = useNotifications();

        let handleSubmit = async (event) => {
            event.preventDefault();
            error.value = '';
            
            try {
                let response = await fetch(`${apiConfig.ApiBaseUrl}/datasnap/rest/TSrvMethods/Login/${usuario.value}/${password.value}`);
                // let response = await fetch(`http://192.168.100.44:63644/datasnap/rest/TSrvMethods/Login/${usuario.value}/${password.value}`);
                // let response = await fetch(`http://192.168.100.45:63644/datasnap/rest/TSrvMethods/Login/${usuario.value}/${password.value}`);

                console.log("Response: ", response);

                // Extraer el cuerpo de la respuesta en formato JSON (o usar otro método si el formato es diferente)
                let data = await response.json();

                // Imprimir los datos en la consola o almacenarlos en el estado del componente
                console.log("response data: ", data);
                console.log("data.Resultado: ", data.Resultado);
                // Prueba response con error
                // response.data.Resultado = "404";

                if (data.Resultado === 'OK') {
                    setSession(usuario.value);
                    // alert('Login successful');
                    // addNotification(`Bienvenido de vuelta, ${usuario.value}`, { duration: 3000, autoClose: true, fullScreen: false });
                    router.push('/lectura-pedidos'); // Redirige a la ruta lectura-pedidos
                    // Manejar redirección o almacenamiento de sesión
                } else {
                    error.value = 'Login failed. Por favor revise sus credenciales.';
                }
            } catch (err) {
                throw err;
                error.value = 'Error connecting to the API';
            };
        };

        // Función para manejar Enter en el campo usuario
        let handleUsuarioEnter = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                document.getElementById('password').focus(); // Pasa el foco al campo contraseña
            }
        };

        // Función para manejar Enter en el campo contraseña
        let handlePasswordEnter = (event) => {
            if (event.key === 'Enter' && usuario.value && password.value) {
                event.preventDefault();
                handleSubmit(event); // Llama al método handleSubmit
            }
        };

        return {
            usuario,
            password,
            error,
            handleSubmit,
            handleUsuarioEnter,
            handlePasswordEnter,
        };
    },
};
</script>

<template>
    <h1 class="text-center my-3">Iniciar Sesión</h1>

    <form class="mb-3" @submit="handleSubmit">
        <!-- Campo de usuario -->
        <div data-mdb-input-init class="form-outline mb-4">
            <input type="text" 
                   id="usuario" 
                   v-model="usuario" 
                   class="form-control form-control-sm" 
                   placeholder="Usuario" 
                   @keypress="handleUsuarioEnter" />
        </div>

        <!-- Campo de contraseña -->
        <div data-mdb-input-init class="form-outline mb-4">
            <input type="password" 
                   id="password" 
                   v-model="password" 
                   class="form-control form-control-sm" 
                   placeholder="Contraseña" 
                   @keypress="handlePasswordEnter" />
        </div>

        <!-- Error message -->
        <div v-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <!-- Submit button -->
        <button data-mdb-ripple-init
                type="submit"
                class="btn btn-sm btn-primary btn-block w-100">Sign in
        </button>
    </form> 
</template>

<style scoped>
/* Añadir estilos personalizados si es necesario */
</style>