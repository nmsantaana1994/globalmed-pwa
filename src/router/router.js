import { createRouter, createWebHashHistory } from "vue-router";
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import LecturaPedidos from '../views/LecturaPedidos.vue';

const routes = [
    { path: '/',                    component: Home,},
    { path: '/login',               component: Login,},
    { path: '/lectura-pedidos',     component: LecturaPedidos,},
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

export default router;