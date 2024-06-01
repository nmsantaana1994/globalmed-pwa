<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { setSession } from '../session.js';
import { useNotifications } from '../notification.js';

export default {
    name: 'Login',
    setup() {
        const usuario = ref('');
        const password = ref('');
        const error = ref('');
        const router = useRouter();
        const { addNotification } = useNotifications();

        const handleSubmit = async (event) => {
            event.preventDefault();
            error.value = '';

            try {
                console.log("Usuario: ", usuario.value);
                console.log("Password: ", password.value);
                const response = await axios.get(`/api/datasnap/rest/TSrvMethods/Login/${usuario.value}/${password.value}`);
                console.log("Response: ", response);

                // Prueba response con error
                // response.data.Resultado = "404";

                if (response.data.Resultado === 'OK') {
                    setSession(usuario.value);
                    // alert('Login successful');
                    addNotification(`Bienvenido de vuelta, ${usuario.value}`);
                    router.push('/'); // Redirige a la ruta home o donde desees
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
            <input type="text" id="usuario" v-model="usuario" class="form-control" />
            <label class="form-label" for="usuario">Usuario</label>
        </div>

        <!-- Password input -->
        <div data-mdb-input-init class="form-outline mb-4">
            <input type="password" id="password" v-model="password" class="form-control" />
            <label class="form-label" for="password">Password</label>
        </div>

        <!-- Error message -->
        <div v-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <!-- Submit button -->
        <button data-mdb-ripple-init type="submit" class="btn btn-primary btn-block w-100">Sign in</button>
    </form> 
</template>

<style>
/* Añadir estilos personalizados si es necesario */
</style>