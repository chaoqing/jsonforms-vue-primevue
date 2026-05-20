import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import {Tooltip} from 'primevue';
import Aura from '@primevue/themes/aura';
import App from './App.vue';

// PrimeIcons CSS
import 'primeicons/primeicons.css';

// JSON Forms Vue PrimeVue CSS (layout tokens + component styles)
import '@chaoqing/jsonforms-vue-primevue/lib/jsonforms-vue-primevue.css';

const app = createApp(App);

app.directive('tooltip', Tooltip);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount('#app');
