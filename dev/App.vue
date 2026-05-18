<script setup lang="ts">
import { computed, provide, type DefineComponent } from 'vue';
import ControlWrapper from './components/ControlWrapper.vue';
import ExampleAppBar from './components/ExampleAppBar.vue';
import ExampleDrawer from './components/ExampleDrawer.vue';
import ExampleSettings from './components/ExampleSettings.vue';

import ExampleView from './views/ExampleView.vue';
import HomeView from './views/HomeView.vue';

import { ControlWrapperSymbol, type ControlWrapperProps } from '@/util';
import examples from './examples';
import { useAppStore } from './store';

const appStore = useAppStore();

const example = computed(() =>
  examples.find((ex) => ex.name === appStore.exampleName),
);

// override the default ControlWrapper
provide(
  ControlWrapperSymbol,
  ControlWrapper as DefineComponent<ControlWrapperProps>,
);
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': appStore.dark }">
    <example-app-bar></example-app-bar>
    <div class="app-content" :class="{ 'drawer-open': appStore.drawer }">
      <example-drawer></example-drawer>
      <div class="main-content">
        <example-settings></example-settings>
        <suspense>
          <example-view v-if="example" :example="example"></example-view>
          <home-view v-else></home-view>
        </suspense>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--p-surface-ground, #f8fafc);
  color: var(--p-text-color, #334155);
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* PrimeVue control styling — minimal layout */
.primevue-control-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-text-color, #334155);
}

.primevue-control-required {
  color: var(--p-red-500, #ef4444);
}

.primevue-control-error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--p-red-500, #ef4444);
}

.primevue-control-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--p-surface-500, #64748b);
}

/* Control inner wrapper — gives consistent spacing */
.control-inner,
[class$="-inner"] {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Control root — standard .control spacing */
.control {
  padding: 8px 0;
  min-width: 0;
}

.control .p-inputtext,
.control .p-calendar,
.control .p-dropdown {
  width: 100%;
}

/* Horizontal layout */
.horizontal-layout {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.horizontal-layout-item {
  flex: 1;
  min-width: 0;
}

/* Vertical layout — flexbox container */
.vertical-layout {
  display: flex;
  flex-direction: column;
}

.vertical-layout-item {
  padding: 4px 0;
}

/* Drawer open state — offset main content */
.app-content.drawer-open .main-content {
  margin-left: 256px;
}
</style>
