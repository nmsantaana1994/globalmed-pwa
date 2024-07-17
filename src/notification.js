import { ref } from "vue";

const notifications = ref([]);

export function useNotifications() {
    return {
        notifications,
        addNotification(message, options = {}) {
            const id = Date.now();
            const { duration = 3000, autoClose = true, fullScreen = false, type = 'success' } = options;
            notifications.value.push({ id, message, duration, autoClose, fullScreen, type });

            if (autoClose && duration > 0) {
                setTimeout(() => {
                    const index = notifications.value.findIndex((n) => n.id === id);
                    if (index !== -1) {
                        notifications.value.splice(index, 1);
                    }
                }, duration);
            }
        },
        removeNotification(id) {
            const index = notifications.value.findIndex((n) => n.id === id);
            if (index !== -1) {
                notifications.value.splice(index, 1);
            }
        },
    };
}

