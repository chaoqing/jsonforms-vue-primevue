<script setup>
import { ref } from 'vue';
import { JsonForms } from '@jsonforms/vue';
import {
  primevueRenderers,
  extendedPrimevueRenderers,
  defaultStyles,
  mergeStyles,
} from '@chaoqing/jsonforms-vue-primevue';

import { personSchema, personUischema, personData } from './schemas.js';

const renderers = [...primevueRenderers, ...extendedPrimevueRenderers];

const data = ref(personData);

// Optional: customize class names via the styles prop
const styles = ref(defaultStyles);

// Optional: custom class overrides for a specific element
// const styles = ref(mergeStyles(defaultStyles, {
//   control: { root: 'control custom-control' },
// }));

function onDataChange(event) {
  data.value = event.data;
}
</script>

<template>
  <div class="example-container">
    <header class="example-header">
      <h1>JSON Forms — Vue PrimeVue Example</h1>
      <p>A minimal example using the PrimeVue renderer set with Fluido layout wrappers.</p>
    </header>

    <main class="example-main">
      <div class="form-panel">
        <JsonForms
          :data="data"
          :schema="personSchema"
          :uischema="personUischema"
          :renderers="renderers"
          :styles="styles"
          @change="onDataChange"
        />
      </div>

      <div class="data-panel">
        <h2>Bound Data</h2>
        <pre>{{ JSON.stringify(data, null, 2) }}</pre>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
