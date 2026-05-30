# PrimeVue 主题定制指南

本文档详细介绍如何定制 `@chaoqing/jsonforms-vue-primevue` 的视觉外观,利用 PrimeVue v4 的设计令牌系统。

---

## 🎨 PrimeVue v4 主题系统

PrimeVue v4 使用**设计令牌 (Design Tokens)** 和 **预设 (Presets)** 系统,取代了 v3 的 CSS 主题文件。

### 核心概念

1. **预设 (Presets)**: 预定义的设计令牌集合 (Aura, Lara, Material, etc.)
2. **设计令牌 (Design Tokens)**: CSS 自定义属性,控制颜色、间距、圆角等
3. **层叠样式**: 可以通过 CSS 覆盖设计令牌

---

## 🚀 快速开始

### 1. 使用内置预设

```ts
// main.ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';
import Material from '@primevue/themes/material';

const app = createApp(App);

// 使用 Aura 预设 (默认)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
```

**可用预设**:
- `Aura` (默认)
- `Lara`
- `Material`
- `Nora` (需要安装 `@primevue/themes`)

---

### 2. 自定义预设

使用 `definePreset()` 扩展现有预设:

```ts
// main.ts
import { definePreset } from '@primevue/themes';
import Lara from '@primevue/themes/lara';

const MyPreset = definePreset(Lara, {
  // 自定义主色
  primary: 'emerald',

  // 自定义表面色
  surface: 'slate',

  // 细粒度自定义
  colorScheme: {
    light: {
      primary: { DEFAULT: '#10b981' },
      surface: { 0: '#ffffff', 100: '#f8fafc' },
    },
    dark: {
      primary: { DEFAULT: '#34d399' },
      surface: { 0: '#0f172a', 100: '#1e293b' },
    },
  },

  // 自定义组件样式
  components: {
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
  },
});
```

---

## 🎨 全局 CSS 覆盖

PrimeVue v4 将设计令牌暴露为 **CSS 自定义属性**,可以在全局 CSS 中覆盖。

### 常用设计令牌

```css
/* global.css 或 styles.css */
:root {
  /* 主色 (影响按钮、复选框等) */
  --p-primary-color: #10b981;
  --p-primary-contrast-color: #ffffff;

  /* 文本颜色 */
  --p-text-color: #1e293b;
  --p-text-muted-color: #64748b;
  --p-text-hover-color: #0f172a;

  /* 表面颜色 (背景) */
  --p-surface-0: #ffffff;
  --p-surface-50: #f8fafc;
  --p-surface-100: #f1f5f9;
  --p-surface-200: #e2e8f0;
  --p-surface-700: #334155;
  --p-surface-900: #0f172a;

  /* 边框 */
  --p-content-border-color: #e2e8f0;
  --p-overlay-border-color: #e2e8f0;
  --p-divider-border-color: #e2e8f0;

  /* 圆角 */
  --p-border-radius-sm: 4px;
  --p-border-radius-md: 6px;
  --p-border-radius-lg: 8px;
  --p-border-radius-xl: 12px;

  /* 焦点环 */
  --p-focus-ring-color: rgba(16, 185, 129, 0.5);
  --p-focus-ring-width: 2px;
  --p-focus-ring-style: solid;
  --p-focus-ring-offset: 2px;

  /* 过渡动画 */
  --p-transition-duration: 200ms;
  --p-transition-timing-function: ease-in-out;

  /* 阴影 */
  --p-shadow-1: 0 1px 3px rgba(0, 0, 0, 0.1);
  --p-shadow-2: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## 🎯 针对 JSON Forms 的样式覆盖

如果您只想影响 **JSON Forms 控件**,而不影响其他 PrimeVue 组件:

### 方法 1: 容器作用域

```vue
<!-- YourForm.vue -->
<template>
  <div class="jsonforms-container">
    <json-forms
      :data="data"
      :schema="schema"
      :uischema="uischema"
      :renderers="renderers"
    />
  </div>
</template>

<style scoped>
.jsonforms-container {
  /* 只影响 JSON Forms 内的 PrimeVue 组件 */

  /* 输入框内边距 */
  --p-inputtext-padding-x: 12px;
  --p-inputtext-padding-y: 8px;

  /* 下拉框内边距 */
  --p-dropdown-padding-x: 12px;
  --p-dropdown-padding-y: 8px;

  /* 日历内边距 */
  --p-calendar-padding: 8px 12px;

  /* 标签加粗 */
  --p-label-font-weight: 600;

  /* 错误状态颜色 */
  --p-invalid-border-color: #ef4444;
  --p-invalid-text-color: #ef4444;
}

/* 深度选择器 (Vue 3) */
.jsonforms-container :deep(.p-label) {
  font-weight: 600;
}

.jsonforms-container :deep(.p-invalid) {
  border-color: #ef4444 !important;
}
</style>
```

---

### 方法 2: CSS 类选择器

```css
/* styles.css */
.json-forms input,
.json-forms .p-inputtext {
  border-radius: 6px;
  padding: 8px 12px;
}

.json-forms .p-dropdown {
  border-radius: 6px;
}

.json-forms .p-button {
  border-radius: 6px;
  padding: 8px 16px;
}

/* 错误状态 */
.json-forms .p-invalid {
  border-color: #ef4444 !important;
}

/* 错误消息 (由 JSON Forms 控制,不是 PrimeVue) */
.json-forms .json-forms-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}
```

---

## 🌙 暗黑模式支持

PrimeVue v4 支持通过 `data-theme` 属性切换暗黑模式。

### 方法 1: 手动切换

```ts
// 切换到暗黑模式
document.documentElement.setAttribute('data-theme', 'dark');

// 切换回明亮模式
document.documentElement.setAttribute('data-theme', 'light');
```

### 方法 2: PrimeVue 内置暗黑模式

```ts
// main.ts
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.app-dark', // 或 'system' 自动检测
    },
  },
});
```

```css
/* styles.css */
.app-dark {
  --p-surface-0: #0f172a;
  --p-surface-100: #1e293b;
  --p-text-color: #e2e8f0;
  --p-content-border-color: #334155;
}
```

```vue
<!-- 切换暗黑模式 -->
<template>
  <button @click="toggleDarkMode">
    Toggle Dark Mode
  </button>
</template>

<script setup lang="ts">
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('app-dark');
};
</script>
```

---

## 🎨 常用组件样式定制

### 输入框 (InputText)

```css
:root {
  /* 内边距 */
  --p-inputtext-padding-x: 12px;
  --p-inputtext-padding-y: 8px;

  /* 边框 */
  --p-inputtext-border-color: #e2e8f0;
  --p-inputtext-hover-border-color: #94a3b8;
  --p-inputtext-focus-border-color: #10b981;

  /* 背景 */
  --p-inputtext-bg: #ffffff;
  --p-inputtext-hover-bg: #ffffff;
  --p-inputtext-focus-bg: #ffffff;

  /* 文字 */
  --p-inputtext-text-color: #1e293b;
  --p-inputtext-placeholder-color: #94a3b8;

  /* 圆角 */
  --p-inputtext-border-radius: 6px;

  /* 阴影 */
  --p-inputtext-shadow: none;
  --p-inputtext-focus-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
```

---

### 下拉框 (Dropdown)

```css
:root {
  --p-dropdown-padding-x: 12px;
  --p-dropdown-padding-y: 8px;
  --p-dropdown-border-radius: 6px;
  --p-dropdown-bg: #ffffff;
  --p-dropdown-text-color: #1e293b;
}
```

---

### 按钮 (Button)

```css
:root {
  --p-button-padding-x: 16px;
  --p-button-padding-y: 10px;
  --p-button-border-radius: 6px;
  --p-button-font-weight: 500;
  --p-button-bg: #10b981;
  --p-button-text-color: #ffffff;
  --p-button-hover-bg: #059669;
}
```

---

### 复选框 (Checkbox)

```css
:root {
  --p-checkbox-width: 20px;
  --p-checkbox-height: 20px;
  --p-checkbox-border-radius: 4px;
  --p-checkbox-checked-bg: #10b981;
  --p-checkbox-checked-border-color: #10b981;
}
```

---

### 日历 (Calendar)

```css
:root {
  --p-calendar-padding: 8px 12px;
  --p-calendar-border-radius: 6px;
  --p-calendar-bg: #ffffff;
  --p-calendar-panel-bg: #ffffff;
  --p-calendar-today-bg: #10b981;
}
```

---

## 📦 完整示例

### 自定义主题预设

```ts
// themes/my-theme.ts
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

export const MyTheme = definePreset(Aura, {
  primary: 'emerald',
  surface: 'slate',

  colorScheme: {
    light: {
      primary: { DEFAULT: '#10b981' },
      surface: {
        0: '#ffffff',
        50: '#f8fafc',
        100: '#f1f5f9',
      },
    },
    dark: {
      primary: { DEFAULT: '#34d399' },
      surface: {
        0: '#0f172a',
        100: '#1e293b',
      },
    },
  },

  components: {
    inputtext: {
      borderRadius: '6px',
      paddingX: '12px',
      paddingY: '8px',
    },
    button: {
      borderRadius: '6px',
      paddingX: '16px',
      paddingY: '10px',
    },
  },
});
```

```ts
// main.ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import { MyTheme } from './themes/my-theme';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: MyTheme,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
});
```

---

## 🔗 参考资源

- **PrimeVue 主题文档**: https://primevue.org/theming/
- **设计令牌列表**: https://primevue.org/theming/#design-tokens
- **预设源码**: `node_modules/@primevue/themes/`

---

## 📖 下一步

- 查看 [高级用法](./advanced-usage.md) 了解自定义渲染器
- 参考 [API 参考](./api-reference.md) 查看完整 API
- 学习 [快速开始](./getting-started.md) 了解安装步骤

---

**需要帮助?** 请在 [GitHub Issues](https://github.com/chaoqing/jsonforms-vue-primevue/issues) 中提问。
