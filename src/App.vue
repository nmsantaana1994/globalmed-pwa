<script>
export default {
    name: 'App',
}
</script>

<template>
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

    <main class="container">
        <router-view />
    </main>

    <footer>
        <p class="text-center">&copy; Nico Santa Ana 2024</p>
    </footer>
</template>

<style scoped>

</style>