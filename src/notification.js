import { ref } from "vue";

const notifications = ref([]);

export function useNotifications() {
    return {
        notifications,
        addNotification(message, duration = 3000) {
            const id = Date.now();
            notifications.value.push({ id, message, duration });
            if (duration > 0) {
                setTimeout(() => {
                    const index = notifications.value.findIndex(
                        (n) => n.id === id
                    );
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
