<script setup lang="ts">
import { appstoreLayouts, useAppStore, type AppstoreLayouts } from '../store';

const appStore = useAppStore();

const validationModes = [
  { text: 'Validate And Show', value: 'ValidateAndShow' },
  { text: 'Validate And Hide', value: 'ValidateAndHide' },
  { text: 'No Validation', value: 'NoValidation' },
];

const locales = [
  { text: 'English (en)', value: 'en' },
  { text: 'German (de)', value: 'de' },
  { text: 'Bulgarian (bg)', value: 'bg' },
  { text: 'Browser Language', value: navigator.language },
];

const blueprints = [
  { text: 'Material Design 1', value: 'md1' },
  { text: 'Material Design 2', value: 'md2' },
  { text: 'Material Design 3', value: 'md3' },
];

const variants = [
  { text: 'Regular', value: '' },
  { text: 'Solo', value: 'solo' },
  { text: 'Filled', value: 'filled' },
  { text: 'Outlined', value: 'outlined' },
  { text: 'Plain', value: 'plain' },
  { text: 'Underlined', value: 'underlined' },
];

const iconsets = [
  { text: 'Material Design', value: 'mdi' },
  { text: 'Font Awesome', value: 'fa' },
];

const layoutMapping: Record<AppstoreLayouts, string> = {
  '': 'Default',
  'demo-and-data': 'Demo and Data',
};

const layouts = appstoreLayouts.map((value: AppstoreLayouts) => ({
  text: layoutMapping[value] ?? value,
  value: value,
}));
</script>

<template>
  <aside class="settings" :class="{ open: appStore.settings }">
    <div class="settings-header">
      <h2>Settings</h2>
      <button 
        @click="appStore.settings = false"
        class="close-btn"
        title="Close"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>

    <div class="settings-content">
      <!-- Theme -->
      <section class="settings-section">
        <label class="section-title">Theme</label>
        <div class="toggle-group">
          <button 
            :class="{ active: !appStore.dark }"
            @click="appStore.dark = false"
          >
            <i class="pi pi-sun"></i> Light
          </button>
          <button 
            :class="{ active: appStore.dark }"
            @click="appStore.dark = true"
          >
            <i class="pi pi-moon"></i> Dark
          </button>
        </div>
      </section>

      <!-- Direction -->
      <section class="settings-section">
        <label class="section-title">Direction</label>
        <div class="toggle-group">
          <button 
            :class="{ active: !appStore.rtl }"
            @click="appStore.rtl = false"
          >
            LTR
          </button>
          <button 
            :class="{ active: appStore.rtl }"
            @click="appStore.rtl = true"
          >
            RTL
          </button>
        </div>
      </section>

      <!-- Validation -->
      <section class="settings-section">
        <label class="section-title">Validation Mode</label>
        <select v-model="appStore.jsonforms.validationMode" class="select-input">
          <option v-for="mode in validationModes" :key="mode.value" :value="mode.value">
            {{ mode.text }}
          </option>
        </select>
      </section>

      <!-- Locale -->
      <section class="settings-section">
        <label class="section-title">Locale</label>
        <select v-model="appStore.jsonforms.locale" class="select-input">
          <option v-for="locale in locales" :key="locale.value" :value="locale.value">
            {{ locale.text }}
          </option>
        </select>
      </section>

      <!-- Layout -->
      <section class="settings-section">
        <label class="section-title">Demo Layout</label>
        <select v-model="appStore.layout" class="select-input">
          <option v-for="layout in layouts" :key="layout.value" :value="layout.value">
            {{ layout.text }}
          </option>
        </select>
      </section>

      <!-- Blueprints -->
      <section class="settings-section">
        <label class="section-title">Blueprints (reload needed)</label>
        <select v-model="appStore.blueprint" class="select-input">
          <option v-for="bp in blueprints" :key="bp.value" :value="bp.value">
            {{ bp.text }}
          </option>
        </select>
      </section>

      <!-- Variants -->
      <section class="settings-section">
        <label class="section-title">Variants</label>
        <select v-model="appStore.variant" class="select-input">
          <option v-for="v in variants" :key="v.value" :value="v.value">
            {{ v.text }}
          </option>
        </select>
      </section>

      <!-- Icon Set -->
      <section class="settings-section">
        <label class="section-title">Icon Set (reload needed)</label>
        <select v-model="appStore.iconset" class="select-input">
          <option v-for="icon in iconsets" :key="icon.value" :value="icon.value">
            {{ icon.text }}
          </option>
        </select>
      </section>

      <!-- Options -->
      <section class="settings-section">
        <label class="section-title">Options</label>
        
        <label class="checkbox-label">
          <input v-model="appStore.overrideControlTemplate" type="checkbox" />
          Use custom ControlWrapper
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.hideRequiredAsterisk" type="checkbox" />
          Hide Required Asterisk
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.showUnfocusedDescription" type="checkbox" />
          Show Unfocused Description
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.restrict" type="checkbox" />
          Restrict
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.readonly" type="checkbox" />
          Read-Only
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.collapseNewItems" type="checkbox" />
          Collapse new array items
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.hideArraySummaryValidation" type="checkbox" />
          Hide array summary validation
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.initCollapsed" type="checkbox" />
          Collapse arrays initially
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.hideAvatar" type="checkbox" />
          Hide Array Item Avatar
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.enableFilterErrorsBeforeTouch" type="checkbox" />
          Enable Filter Errors Before Touch
        </label>

        <label class="checkbox-label">
          <input v-model="appStore.jsonforms.config.allowAdditionalPropertiesIfMissing" type="checkbox" />
          Allow Additional Properties By Default
        </label>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.settings {
  position: fixed;
  right: 0;
  top: 64px;
  width: 300px;
  height: calc(100vh - 64px);
  background-color: var(--surface-card);
  border-left: 1px solid var(--surface-border);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;
}

.settings.open {
  transform: translateX(0);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.settings-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-color-secondary);
}

.close-btn:hover {
  color: var(--text-color);
}

.settings-content {
  padding: 1rem;
}

.settings-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.settings-section:last-child {
  border-bottom: none;
}

.section-title {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.toggle-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.toggle-group button {
  padding: 0.5rem;
  border: 1px solid var(--surface-border);
  background-color: var(--surface-50);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-color);
  transition: all 0.2s;
}

.toggle-group button:hover {
  border-color: var(--primary-color);
}

.toggle-group button.active {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  border-color: var(--primary-color);
}

.select-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  background-color: var(--surface-50);
  color: var(--text-color);
  font-size: 0.9rem;
}

.select-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--surface-card);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.9rem;
}

.checkbox-label input {
  cursor: pointer;
}

.checkbox-label:hover {
  color: var(--primary-color);
}
</style>
