import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { Promised } from "vue-promised";

const app = createApp(App)

// mount the router
app.use(router)
app.component('Promised', Promised)

app.mount('#app')
