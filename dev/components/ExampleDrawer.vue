<script setup lang="ts">
import { computed, ref } from 'vue';
import examples from '../examples';
import { useAppStore } from '../store';

const appStore = useAppStore();

const handleExampleClick = (exampleName: string) => {
  appStore.exampleName = exampleName;
  appStore.drawer = false;
};
const search = ref('');

const filteredExamples = computed(() => {
  return examples.filter(
    (example) =>
      example.name.toLowerCase().includes(search.value.toLowerCase()) ||
      example.label.toLowerCase().includes(search.value.toLowerCase()),
  );
});
</script>

<template>
  <aside class="drawer" :class="{ open: appStore.drawer }">
    <div class="drawer-header">
      <h2>Examples</h2>
      <button 
        @click="appStore.drawer = false" 
        class="close-btn"
        title="Close"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>

    <div class="drawer-search">
      <input 
        v-model="search"
        type="text"
        placeholder="Search examples"
        class="search-input"
      />
      <i class="pi pi-search"></i>
    </div>

    <nav class="drawer-list">
      <button
        v-for="example in filteredExamples"
        :key="example.name"
        @click="handleExampleClick(example.name)"
        class="drawer-item"
        :class="{ active: appStore.exampleName === example.name }"
      >
        {{ example.label }}
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.drawer {
  position: fixed;
  left: 0;
  top: 64px;
  width: 256px;
  height: calc(100vh - 64px);
  background-color: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;
}

.drawer.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.drawer-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.close-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .close-btn {
    display: block;
  }
}

.drawer-search {
  position: relative;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--surface-50);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--surface-card);
}

.drawer-search i {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-secondary);
}

.drawer-list {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.drawer-item {
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.95rem;
  transition: background-color 0.2s;
}

.drawer-item:hover {
  background-color: var(--surface-200);
}

.drawer-item.active {
  background-color: var(--primary-color-emphasis);
  color: var(--primary-color);
  font-weight: 600;
}
</style>
