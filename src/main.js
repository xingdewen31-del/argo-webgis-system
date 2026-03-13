/* vue-untitled / 2025-05-13 / gis@jou.edu.cn */
import {createApp} from 'vue';
import {createPinia} from "pinia";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import mainrouter from "./router/mainrouter.js";
import './style.css';
import App from './App.vue';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; //
import axios from 'axios'
import useStore from "@stores/mainstore.js";
import ToastService from 'primevue/toastservice';

const app = createApp(App);
/*-----------------------*/
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);//
app.use(pinia);
/*-----------------------*/
const options = {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
};
app.use(PrimeVue, options);
app.use(ToastService);
/*-----------------------*/
app.use(mainrouter);
const store = useStore()
const token = localStorage.getItem('token')
if (token) {
    store.login()
}
/*-----------------------*/
app.mount('#app');
