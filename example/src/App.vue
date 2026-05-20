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

<style>
/* Global reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    sans-serif;
  background: var(--p-surface-ground, #f8fafc);
  color: var(--p-text-color, #334155);
  -webkit-font-smoothing: antialiased;
}

.example-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.example-header {
  background: var(--p-primary-color, #3b82f6);
  color: var(--p-primary-contrast-color, #fff);
  padding: 1.5rem 2rem;
}

.example-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.example-header p {
  font-size: 0.875rem;
  opacity: 0.85;
}

.example-main {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.form-panel {
  flex: 1;
  min-width: 0;
  background: var(--p-content-background, #fff);
  border-radius: var(--p-border-radius-lg, 0.5rem);
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-panel {
  flex: 0 0 380px;
  background: var(--p-content-background, #fff);
  border-radius: var(--p-border-radius-lg, 0.5rem);
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;
  max-height: calc(100vh - 120px);
  position: sticky;
  top: 1.5rem;
}

.data-panel h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--p-text-color, #334155);
}

.data-panel pre {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--p-text-color, #334155);
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 768px) {
  .example-main {
    flex-direction: column;
    padding: 1rem;
  }

  .data-panel {
    flex: 0 0 auto;
    max-height: 300px;
    position: static;
  }
}
</style>
