import Home from "./pages/Home.vue"
import * as VueRouter from "vue-router";

const routes = [
    { path: '/', component: Home },
    { path: '/home', component: Home },
]

export default VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})
