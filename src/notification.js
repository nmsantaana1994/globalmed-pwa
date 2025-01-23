import { ref } from "vue";

let notifications = ref([]);

export function useNotifications() {
    return {
        notifications,
        addNotification(message, options = {}) {
            let id = Date.now();
            let notification = {
                id,
                message,
                ...options, // Desestructuramos el objeto options
                onClose: options.onClose || null // Añadir la función de cierre si está definida
            };

            // console.log("Adding notification:", notification);
            notifications.value.push(notification);
            // console.log("notification.js notifications: ", notifications);

            // if (notification.playSound) {
            //     let alertSound = new Audio('/src/assets/sounds/alert.mp3');
            //     alertSound.play().catch(error => {
            //         console.error('Error al reproducir el sonido:', error);
            //     });
            // }

            if (notification.autoClose && notification.duration > 0) {
                setTimeout(() => {
                    let index = notifications.value.findIndex(
                        (n) => n.id === id
                    );
                    if (index !== -1) {
                        notifications.value.splice(index, 1);
                    }
                }, notification.duration);
            }
        },
        // addNotification(message, options = {}) {
        //     let id = Date.now();
        //     let { duration = 3000, autoClose = true, fullScreen = false, type = 'success', playSound = true } = options;
        //     console.log('Adding notification with playSound:', playSound);  // <-- Añade esto
        //     notifications.value.push({ id, message, duration, autoClose, fullScreen, type, playSound });
        //     console.log("notification.js notifications: ", notifications);

        //     if (autoClose && duration > 0) {
        //         setTimeout(() => {
        //             let index = notifications.value.findIndex((n) => n.id === id);
        //             if (index !== -1) {
        //                 notifications.value.splice(index, 1);
        //             }
        //         }, duration);
        //     }
        // },
        removeNotification(id) {
            let index = notifications.value.findIndex((n) => n.id === id);
            if (index !== -1) {
                notifications.value.splice(index, 1);
            }
        },
    };
}

