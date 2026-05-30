# 快速开始

本指南将帮助您在 5 分钟内启动并运行 `@chaoqing/jsonforms-vue-primevue`。

## 📋 前置要求

- **Node.js**: v18.0.0 或更高版本
- **Vue 3**: ^3.5.0
- **PrimeVue 4**: ^4.5.0
- **JSON Forms**: ^3.7.0

## 📦 安装

### 1. 安装核心依赖

```bash
npm install --save @chaoqing/jsonforms-vue-primevue @jsonforms/core @jsonforms/vue
```

### 2. 安装 PrimeVue 和图标

```bash
# PrimeVue 核心
npm install --save primevue @primevue/themes primeicons

# 可选: 日期处理
npm install --save dayjs

# 可选: 掩码输入
npm install --save maska

# 可选: JSON Schema 验证
npm install --save ajv lodash
```

### 3. 可选图标集

```bash
# MDI 图标
npm install --save @mdi/font

# Font Awesome 图标
npm install --save @fortawesome/fontawesome-free
```

## 🚀 快速开始

### 步骤 1: 配置 PrimeVue

在您的 `main.ts` 或 `main.js` 入口文件中:

```ts
// main.ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

// 导入 PrimeVue 样式
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/aura/theme.css';

const app = createApp(App);

// 注册 PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount('#app');
```

### 步骤 2: 使用 JSON Forms

在您的 Vue 组件中:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { JsonForms } from '@jsonforms/vue';
import { primevueRenderers } from '@chaoqing/jsonforms-vue-primevue';

// 数据
const data = ref({});

// JSON Schema
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
    },
    age: {
      type: 'integer',
      title: '年龄',
      minimum: 0,
    },
    agree: {
      type: 'boolean',
      title: '同意条款',
    },
  },
  required: ['name', 'age'],
};

// UI Schema (可选,不提供将自动生成)
const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name',
    },
    {
      type: 'Control',
      scope: '#/properties/age',
    },
    {
      type: 'Control',
      scope: '#/properties/agree',
    },
  ],
};

// 渲染器集
const renderers = Object.freeze(primevueRenderers);

// 变化处理
const onChange = (event: any) => {
  console.log('Data changed:', event.data);
};
</script>

<template>
  <div class="my-form">
    <json-forms
      :data="data"
      :schema="schema"
      :uischema="uischema"
      :renderers="renderers"
      @change="onChange"
    />
  </div>
</template>
```

## 🎨 使用扩展渲染器

如果您需要**自动补全**功能,请使用 `extendedPrimevueRenderers`:

```ts
import { extendedPrimevueRenderers } from '@chaoqing/jsonforms-vue-primevue';

const renderers = Object.freeze(extendedPrimevueRenderers);
```

## 🎯 使用图标

### MDI 图标

```ts
// main.ts
import { mdiIconAliases } from '@chaoqing/jsonforms-vue-primevue';
import '@mdi/font/css/materialdesignicons.css';
```

### Font Awesome 图标

```ts
// main.ts
import { faIconAliases } from '@chaoqing/jsonforms-vue-primevue';
import '@fortawesome/fontawesome-free/css/all.css';
```

## ⚙️ Vite 配置

如果使用 Vite,请将 `primevue/core` 从优化依赖中排除:

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['primevue/core'],
  },
});
```

## 🐛 常见问题

### 1. Peer Dependency 冲突

如果遇到 peer dependency 冲突,使用 `--legacy-peer-deps` 标志:

```bash
npm install --legacy-peer-deps
```

### 2. TypeScript 类型错误

确保您的 `tsconfig.json` 包含以下内容:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

### 3. 样式不生效

检查是否正确导入了 PrimeVue 主题 CSS:

```ts
import 'primevue/resources/themes/aura/theme.css';
import 'primeicons/primeicons.css';
```

## 📖 下一步

- 查看 [API 参考](./api-reference.md) 了解所有可用的 props 和选项
- 学习 [渲染器指南](./renderers-guide.md) 了解 35 个渲染器的详细用法
- 自定义主题请查看 [主题指南](./theming.md)
- 高级用法请查看 [高级用法](./advanced-usage.md)

## 🔗 相关资源

- **JSON Forms 文档**: https://jsonforms.io/docs/
- **PrimeVue 文档**: https://primevue.org/
- **示例项目**: [example/](./example/) 目录

---

**需要帮助?** 请在 [GitHub Issues](https://github.com/chaoqing/jsonforms-vue-primevue/issues) 中提问。
