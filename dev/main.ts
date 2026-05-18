import { createApp } from 'vue';
import App from './App.vue';
import buildPrimeVue from './plugins/primevue';

// PrimeVue uses styled mode with theme presets (no separate CSS files in v4)
// Icons CSS
import 'primeicons/primeicons.css';

createApp(App).use(buildPrimeVue()).mount('#app');
