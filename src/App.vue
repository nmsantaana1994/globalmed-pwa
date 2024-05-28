<script>
export default {
    name: 'App',
}
</script>

<template>
    <div class="wrapper">
        <!-- Navbar -->
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">GlobalMed</a>
                <div class="d-flex">
                    <ul class="navbar-nav flex-row">
                        <li class="nav-item me-2">
                            <router-link to='/' class="nav-link active">Home</router-link>
                        </li>
                        <li class="nav-item me-2">
                            <router-link to='/lectura-pedidos' class="nav-link active">LecturaFC</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to='/login' class="nav-link active">Login</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    
        <main class="container content">
            <router-view />
        </main>
    
        <footer class="bg-light">
            <p class="text-center my-2">&copy; Nico Santa Ana 2024</p>
        </footer>
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
</style>