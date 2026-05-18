<script setup lang="ts">
import JsonFormsLogo from '../assets/JsonFormsLogo.vue';
import { useAppStore } from '../store';
import ThemeChanger from './ThemeChanger.vue';

const appStore = useAppStore();
</script>

<template>
  <header class="app-bar">
    <button @click="appStore.drawer = !appStore.drawer" class="nav-button" :title="appStore.drawer ? 'Hide menu' : 'Show menu'">
      <i class="pi pi-bars"></i>
    </button>
    <div class="app-bar-title">
      <JsonFormsLogo width="40" height="40" />
      <span>JSON Forms</span>
    </div>
    <div class="app-bar-actions">
      <button 
        class="action-button" 
        :disabled="!appStore.exampleName"
        @click="appStore.formOnly = !appStore.formOnly"
        :title="appStore.formOnly ? 'Show Form Wrapper' : 'Hide Form Wrapper'"
      >
        <i class="pi pi-eye" v-if="!appStore.formOnly"></i>
        <i class="pi pi-eye-slash" v-else></i>
      </button>
      <theme-changer />
      <button 
        class="action-button"
        @click="appStore.settings = !appStore.settings"
        title="Settings"
      >
        <i class="pi pi-cog"></i>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  height: 64px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: var(--surface-200);
}

.app-bar-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.2rem;
  flex: 1;
  color: var(--text-color);
}

.app-bar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.action-button:hover:not(:disabled) {
  background-color: var(--surface-200);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
