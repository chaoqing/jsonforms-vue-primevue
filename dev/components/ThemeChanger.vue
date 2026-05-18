<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../store';

const menu = ref(false);
const appStore = useAppStore();

const setTheme = (theme: string) => {
  menu.value = false;
  appStore.theme = theme;
};
</script>

<template>
  <div class="theme-changer">
    <button @click="menu = !menu" class="theme-button" title="Change theme">
      <i class="pi pi-palette" style="font-size: 1.2rem"></i>
    </button>
    <div v-if="menu" class="theme-menu">
      <div class="theme-menu-header">
        <span>{{ appStore.dark ? 'Dark' : 'Light' }} Theme</span>
        <button @click="menu = false" class="close-btn">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <div class="theme-options">
        <div class="theme-option" @click="setTheme('light')">
          Light
        </div>
        <div class="theme-option" @click="setTheme('dark')">
          Dark
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-changer {
  position: relative;
  display: inline-block;
}

.theme-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  border-radius: 50%;
  transition: background-color 0.2s;
}

.theme-button:hover {
  background-color: var(--surface-200);
}

.theme-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.theme-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color-secondary);
}

.close-btn:hover {
  color: var(--text-color);
}

.theme-options {
  padding: 0.5rem;
}

.theme-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.theme-option:hover {
  background-color: var(--primary-color-emphasis);
  color: var(--primary-color);
}
</style>
