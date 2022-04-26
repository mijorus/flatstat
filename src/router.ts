import Home from "./pages/Home.vue"
import AppDetails from "./pages/AppDetails.vue"
import Libraries from "./pages/Libraries.vue"
import AllTime from "./pages/AllTime.vue"
import * as VueRouter from "vue-router";

const routes = [
    { path: '/', component: Home },
    { path: '/home', component: Home },
    { path: '/app/:id', component: AppDetails },
    { path: '/libraries', component: Libraries },
    { path: '/all-time', component: AllTime },
]

export default VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    //@ts-ignore
    history: process.env.NODE_ENV === "development" ? VueRouter.createWebHashHistory() : VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
})
