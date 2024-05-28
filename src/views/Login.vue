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
            <input type="email" id="form1Example1" class="form-control" />
            <label class="form-label" for="form1Example1">Email address</label>
        </div>

        <!-- Password input -->
        <div data-mdb-input-init class="form-outline mb-4">
            <input type="password" id="form1Example2" class="form-control" />
            <label class="form-label" for="form1Example2">Password</label>
        </div>

        <!-- Submit button -->
        <button data-mdb-ripple-init type="submit" class="btn btn-primary btn-block w-100">Sign in</button>
    </form> 
</template>