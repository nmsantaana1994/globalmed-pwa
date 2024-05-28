<script>
export default {
    name: 'Login'
}
</script>

<template>
    <h1 class="text-center my-3">Iniciar Sesión</h1>

    <form class="mb-3">
        <!-- Email input -->
        <div data-mdb-input-init class="form-outline mb-4">
            <input type="text" id="usuario" class="form-control" />
            <label class="form-label" for="usuario">Usuario</label>
        </div>

        <!-- Password input -->
        <div data-mdb-input-init class="form-outline mb-4">
            <input type="password" id="password" class="form-control" />
            <label class="form-label" for="password">Password</label>
        </div>

        <!-- Submit button -->
        <button data-mdb-ripple-init type="submit" class="btn btn-primary btn-block w-100">Sign in</button>
    </form> 
</template>