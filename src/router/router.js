import { createRouter, createWebHashHistory } from "vue-router";
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import LecturaPedidos from '../views/LecturaPedidos.vue';
import { getSession } from "../session.js";

const routes = [
    { path: "/", redirect: '/login',    component: Home, },
    { path: "/login",                   component: Login, },
    { path: "/lectura-pedidos",         component: LecturaPedidos,  meta: { requiresAuth: true } },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

// Añadir una navegación de guardia para comprobar la sesión
router.beforeEach((to, from, next) => {
    const session = getSession();
    
    if (to.path === '/login' && session) {
        next('/lectura-pedidos'); // Redirige a lectura-pedidos si ya está logueado
    } else if (to.path === '/lectura-pedidos' && !session) {
        next('/login'); // Redirige a login si no está logueado
    } else {
        next(); // Continúa a la ruta solicitada
    }
});

// router.beforeEach((to, from, next) => {
//     const session = getSession();

//     if (to.matched.some((record) => record.meta.requiresAuth)) {
//         if (!session) {
//             next({
//                 path: "/login",
//                 query: { redirect: to.fullPath },
//             });
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// });

export default router;