<script>
import { useSession, clearSession } from './session.js';
import { useRouter } from 'vue-router';
import Notification from './components/Notification.vue';
import { useNotifications } from './notification.js';

export default {
    name: 'App',
    components: {
        Notification,
    },
    setup() {
        let session = useSession();
        let router = useRouter();
        let { notifications, addNotification, removeNotification } = useNotifications();
        
        let logout = () => {
            clearSession();
            router.push('/login');
        };

        // Añadir una notificación de bienvenida cuando el usuario se loguea
        if (session.value) {
            addNotification(`Bienvenido de vuelta, ${session.value}`);
        }

        return {
            session,
            logout,
            notifications,
            removeNotification,
        };
    }
}
</script>

<template>
    <div class="wrapper">
        <!-- Navbar -->
        <nav class="navbar navbar-light bg-dark py-0">
            <div class="container-fluid">
                <a class="navbar-brand" href="#"><img src="../public/img/logoGlobal.png" alt="Logo GlobalMed" class="w-25"></a>
                <div class="d-flex">
                    <ul class="navbar-nav flex-row">
                        <!-- <li class="nav-item me-2">
                            <router-link to='/' class="nav-link active text-white">Home</router-link>
                        </li> -->
                        <li v-if="session" class="nav-item me-2">
                            <router-link to="/lectura-pedidos" class="nav-link active text-white">LecturaFC</router-link>
                        </li>
                        <li v-if="!session" class="nav-item">
                            <router-link to="/login" class="nav-link active text-white">Login</router-link>
                        </li>
                        <li v-if="session" class="nav-item">
                            <a href="#" class="nav-link active text-white" @click.prevent="logout">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    
        <main class="container-fluid content">
            <router-view />
        </main>
    
        <footer class="bg-light">
            <p class="text-center my-2">&copy; Nico Santa Ana 2024</p>
        </footer>

        <!-- Notificaciones -->
        <div class="notifications">
            <Notification
                v-for="notification in notifications"
                :key="notification.id"
                :message="notification.message"
                :duration="notification.duration"
                :fullScreen="notification.fullScreen" 
                :autoClose="notification.autoClose"
                :type="notification.type"
                @close="removeNotification(notification.id)"
            />
        </div>
    </div>
</template>

<style>
    html, body {
        height: 100%;
        margin: 0;
    }
    
    .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .content {
        flex: 1;
    }

    .notifications {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 1000;
    }
</style>