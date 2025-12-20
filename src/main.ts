import { createApp } from 'vue';
import './style.css';
import './assets/baseColor.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'animate.css';
import App from './App.vue';
import router from '@router/index';
import Vue3Lottie from 'vue3-lottie';

// ✅ เพิ่ม Pinia
import { createPinia } from 'pinia';

const app = createApp(App);

// ✅ ใช้ Pinia ก่อน mount
const pinia = createPinia();
app.use(pinia);

app.component('Vue3Lottie', Vue3Lottie);
app.use(router);
app.mount('#app');
