import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import dayjs from 'dayjs';
import { watch } from 'vue';
import { useAppStore } from '../store';

export function buildPrimeVue() {
  return function (app: ReturnType<typeof createApp>) {
    const appStore = useAppStore();

    app.use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
        }
      }
    });
    app.use(ToastService);
    app.directive('tooltip', Tooltip);

    // Set dayjs locale on mount
    dayjs.locale(appStore.jsonforms.locale);

    // Watch for locale changes
    watch(
      () => appStore.jsonforms.locale,
      (locale: string) => {
        dayjs.locale(locale);
      },
    );

    return app;
  };
}

export default buildPrimeVue;
