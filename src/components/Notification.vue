<template>
    <div v-if="visible" class="alert alert-success alert-dismissible fade show w-75 fixed-top mx-auto mt-3" role="alert">
        {{ message }}
        <button type="button" class="btn-close" @click="closeNotification" aria-label="Close"></button>
    </div>
</template>

<script>
    export default {
        name: 'Notification',
        props: {
            message: {
                type: String,
                required: true,
            },
            duration: {
                type: Number,
                default: 3000, // Duración predeterminada de 3 segundos
            },
        },
        data() {
            return {
                visible: true,
            };
        },
        mounted() {
            if (this.duration > 0) {
                setTimeout(() => {
                    this.visible = false;
                }, this.duration);
            }
        },
        methods: {
            closeNotification() {
                this.visible = false;
            },
        },
    }
</script>

<style>
    /* .alert {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    } */
</style>