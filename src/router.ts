import Home from "./pages/Home.vue"
import AppDetails from "./pages/AppDetails.vue"
import * as VueRouter from "vue-router";

const routes = [
    { path: '/', component: Home },
    { path: '/home', component: Home },
    { path: '/app/:id', component: AppDetails },
]

export default VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
})
