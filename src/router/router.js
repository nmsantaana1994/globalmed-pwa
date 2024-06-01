import { createRouter, createWebHashHistory } from "vue-router";
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import LecturaPedidos from '../views/LecturaPedidos.vue';
import { getSession } from "../session.js";

const routes = [
    { path: "/",                    component: Home, },
    { path: "/login",               component: Login, },
    { path: "/lectura-pedidos",     component: LecturaPedidos,  meta: { requiresAuth: true } },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
    const session = getSession();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!session) {
            next({
                path: "/login",
                query: { redirect: to.fullPath },
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;