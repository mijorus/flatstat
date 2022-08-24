import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import Datepicker from '@vuepic/vue-datepicker';
import { Promised } from "vue-promised";

const app = createApp(App)

// mount the router
app.use(router)
app.component('Promised', Promised)
app.component('Datepicker', Datepicker)

// app.mount('#app')

document.addEventListener('DOMContentLoaded', function () {
    app.mount('#app')
})