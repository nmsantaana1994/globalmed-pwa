<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { setSession } from '../session.js';
import { useNotifications } from '../notification.js';

export default {
    name: 'Login',
    setup() {
        let usuario = ref('');
        let password = ref('');
        let error = ref('');
        let router = useRouter();
        let { addNotification } = useNotifications();

        let handleSubmit = async (event) => {
            event.preventDefault();
            error.value = '';

            try {
                let response = await axios.get(`/api/datasnap/rest/TSrvMethods/Login/${usuario.value}/${password.value}`);
                console.log("Response: ", response);

                // Prueba response con error
                // response.data.Resultado = "404";

                if (response.data.Resultado === 'OK') {
                    setSession(usuario.value);
                    // alert('Login successful');
                    addNotification(`Bienvenido de vuelta Login.vue, ${usuario.value}`, { duration: 3000, autoClose: true, fullScreen: false });
                    router.push('/lectura-pedidos'); // Redirige a la ruta lectura-pedidos
                    // Manejar redirección o almacenamiento de sesión
                } else {
                    error.value = 'Login failed. Please check your credentials.';
                }
            } catch (err) {
                error.value = 'Error connecting to the API';
            };
        };

        return {
            usuario,
            password,
            error,
            handleSubmit,
        };
    },
};
</script>

<template>
    <h1 class="text-center my-3">Iniciar Sesión</h1>

    <form class="mb-3" @submit="handleSubmit">
        <!-- Email input -->
        <div data-mdb-input-init class="form-outline mb-4">
            <input type="text" id="usuario" v-model="usuario" class="form-control form-control-sm" placeholder="Usuario" />
        </div>

        <!-- Password input -->
        <div data-mdb-input-init class="form-outline mb-4">
            <input type="password" id="password" v-model="password" class="form-control form-control-sm" placeholder="Contraseña" />
        </div>

        <!-- Error message -->
        <div v-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <!-- Submit button -->
        <button data-mdb-ripple-init type="submit" class="btn btn-sm btn-primary btn-block w-100">Sign in</button>
    </form> 
</template>

<style scoped>
/* Añadir estilos personalizados si es necesario */
</style>