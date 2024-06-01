import { ref } from "vue";

const session = ref(null);

export function getSession() {
    if (!session.value) {
        const storedSession = localStorage.getItem("session");
        if (storedSession) {
            try {
                session.value = JSON.parse(storedSession);
            } catch (error) {
                console.error("Error parsing session:", error);
                localStorage.removeItem("session");
            }
        }
    }
    return session.value;
}

export function setSession(userSession) {
    session.value = userSession;
    localStorage.setItem("session", JSON.stringify({ usuario: userSession }));
    //localStorage.setItem("session", JSON.stringify({ usuario: userSession }));
}

export function clearSession() {
    session.value = null;
    localStorage.removeItem("session");
}

export function useSession() {
    return session;
}