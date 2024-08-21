<template>
    <div v-if="visible" :class="['alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show', { 'w-75': !fullScreen, 'w-100': fullScreen, 'full-screen': fullScreen }, 'fixed-top', 'mx-auto', 'mt-3']" role="alert">
        <div>
            <p class="fw-semibold mb-0">{{ message }}</p>
            
            <button type="button" class="btn-close" @click="closeNotification" aria-label="Close"></button>
            <!-- <button @click="playAlertSound">Play Sound</button> -->
        </div>
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
            default: 3000,
        },
        autoClose: {
            type: Boolean,
            default: true,
        },
        fullScreen: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'success',
            validator: value => ['success', 'warning', 'danger', 'info'].includes(value)
        },
        playSound: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            visible: true,
            alertSound: null,
            // localPlaySound: this.playSound, // Crea una copia local del prop
        };
    },
    mounted() {
        // console.log("Props recibidos en Notification.vue: ", this.$props);
        // console.log("PlaySound en mounted: ", this.playSound);
        // console.log("PlaySound es reactivo:", this.$props.playSound);
        // console.log("PlaySound en mounted (local): ", this.localPlaySound);
        if (this.playSound) {
            this.playAlertSound();
        }
        // if (this.localPlaySound) {
        //     this.playAlertSound();
        // }
        if (this.autoClose && this.duration > 0) {
            setTimeout(() => {
                this.visible = false;
            }, this.duration);
        }
    },
    methods: {
        closeNotification() {
            this.visible = false;
        },
        playAlertSound() {
            try {
                this.alertSound = new Audio('/src/assets/sounds/alert.mp3');
                this.alertSound.play().catch(error => {
                    console.error('Error al reproducir el sonido:', error);
                });
            } catch (error) {
                console.error('Error al cargar el archivo de sonido:', error);
            }
        },
    },
};
</script>

<style scoped>
    .alert {
        z-index: 1000;
    }

    .full-screen {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-top: 0 !important;
    }
</style>
