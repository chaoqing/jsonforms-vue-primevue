# 高级用法

本文档介绍 `@chaoqing/jsonforms-vue-primevue` 的高级用法和自定义技巧。

---

## 🎨 自定义 ControlWrapper 组件

所有控件渲染器都使用 `ControlWrapper` 组件来渲染标签、错误提示和提示文本。您可以提供自定义版本的 `ControlWrapper`。

### 步骤 1: 创建自定义 ControlWrapper

```vue
<!-- CustomControlWrapper.vue -->
<script setup lang="ts">
import { ControlWrapperProps } from '@chaoqing/jsonforms-vue-primevue';

const props = defineProps<ControlWrapperProps & {
  // 添加自定义 props
  variant?: 'default' | 'compact';
}>();

const variant = props.variant || 'default';
</script>

<template>
  <div :class="['control-wrapper', `variant-${variant}`]">
    <!-- 自定义标签 -->
    <label v-if="props.label" :for="props.id" class="custom-label">
      {{ props.label }}
      <span v-if="props.required" class="required-star">*</span>
    </label>

    <!-- 插槽用于渲染子组件 -->
    <slot />

    <!-- 自定义错误提示 -->
    <div v-if="props.errors.length > 0" class="custom-errors">
      <div v-for="(error, idx) in props.errors" :key="idx" class="error-item">
        ⚠️ {{ error }}
      </div>
    </div>

    <!-- 自定义提示 -->
    <div v-if="props.description" class="custom-hint">
      {{ props.description }}
    </div>
  </div>
</template>

<style scoped>
.control-wrapper {
  margin-bottom: 16px;
}

.custom-label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.required-star {
  color: #ef4444;
  margin-left: 2px;
}

.variant-compact {
  margin-bottom: 8px;
}

.error-item {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.custom-hint {
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
}
</style>
```

### 步骤 2: 使用 `provide` 注入自定义 ControlWrapper

```ts
// main.ts 或某个父组件
import { provide } from 'vue';
import { ControlWrapperSymbol } from '@chaoqing/jsonforms-vue-primevue';
import CustomControlWrapper from './CustomControlWrapper.vue';

provide(
  ControlWrapperSymbol,
  CustomControlWrapper as DefineComponent<ControlWrapperProps>
);
```

---

## 🎯 通过 UI Schema 传递 PrimeVue Props

您可以通过 UI Schema 的 `options.primevue` 键传递任何 PrimeVue 组件的 props。

### 语法

```json
{
  "type": "Control",
  "scope": "#/properties/fieldName",
  "options": {
    "primevue": {
      "ComponentName": {
        "prop1": "value1",
        "prop2": "value2"
      }
    }
  }
}
```

### 示例 1: 禁用自动补全

```json
{
  "type": "Control",
  "scope": "#/properties/name",
  "options": {
    "primevue": {
      "InputText": {
        "autocomplete": "off"
      }
    }
  }
}
```

### 示例 2: 自定义日期格式

```json
{
  "type": "Control",
  "scope": "#/properties/birthday",
  "options": {
    "primevue": {
      "Calendar": {
        "dateFormat": "yy-mm-dd",
        "showTime": true,
        "hourFormat": "12",
        "showIcon": true,
        "showButtonBar": true
      }
    }
  }
}
```

### 示例 3: 下拉框带过滤

```json
{
  "type": "Control",
  "scope": "#/properties/country",
  "options": {
    "primevue": {
      "Dropdown": {
        "filter": true,
        "filterPlaceholder": "搜索国家...",
        "showClear": true,
        "placeholder": "请选择国家"
      }
    }
  }
}
```

### 示例 4: Textarea 自动调整高度

```json
{
  "type": "Control",
  "scope": "#/properties/description",
  "options": {
    "primevue": {
      "Textarea": {
        "autoResize": true,
        "rows": 3,
        "cols": 50
      }
    }
  }
}
```

### 示例 5: 滑块带刻度

```json
{
  "type": "Control",
  "scope": "#/properties/rating",
  "options": {
    "primevue": {
      "Slider": {
        "min": 0,
        "max": 100,
        "step": 10,
        "range": false
      }
    }
  }
}
```

---

## 🔧 创建自定义渲染器

如果您需要完全自定义的行为,可以创建自己的渲染器。

### 步骤 1: 创建 Vue 组件

```vue
<!-- CustomSliderRenderer.vue -->
<script setup lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useJsonFormsControl } from '@jsonforms/vue';
import { usePrimeVueControl } from '@chaoqing/jsonforms-vue-primevue';
import { rendererProps, RendererProps } from '@jsonforms/vue';

const props = defineProps(rendererProps<RendererProps>());

// 使用 JSON Forms 控制逻辑
const {
  control,
  handleChange,
  appliedOptions,
} = usePrimeVueControl(useJsonFormsControl(props));

// 本地状态
const sliderValue = ref(control.data || 0);

// 监听变化
watch(sliderValue, (newVal) => {
  handleChange(props.path, newVal);
});
</script>

<template>
  <div class="custom-slider">
    <label :for="control.id">{{ control.label }}</label>

    <div class="slider-container">
      <Slider
        :id="control.id"
        v-model="sliderValue"
        :min="appliedOptions.min || 0"
        :max="appliedOptions.max || 100"
        :step="appliedOptions.step || 1"
        :disabled="!control.enabled"
      />

      <span class="slider-value">{{ sliderValue }}</span>
    </div>

    <small v-if="control.description">{{ control.description }}</small>

    <div v-if="control.errors" class="errors">
      {{ control.errors }}
    </div>
  </div>
</template>

<style scoped>
.custom-slider {
  margin-bottom: 16px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider-value {
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}
</style>
```

### 步骤 2: 创建 Entry 文件

```ts
// CustomSliderRenderer.entry.ts
import { ControlElement } from '@jsonforms/core';
import { isNumberControl, rankWith } from '../helpers';

import CustomSliderRenderer from './CustomSliderRenderer.vue';

// Tester 函数
const isCustomSlider = (uischema: ControlElement) => {
  return isNumberControl(uischema) &&
    uischema.options?.format === 'custom-slider';
};

// 导出 entry
export const customSliderRenderer = {
  renderer: CustomSliderRenderer,
  tester: rankWith(3, isCustomSlider), // 优先级 3
};
```

### 步骤 3: 注册自定义渲染器

```ts
// main.ts 或组件中
import { jsonformsRenderers } from '@jsonforms/vue';
import { primevueRenderers } from '@chaoqing/jsonforms-vue-primevue';
import { customSliderRenderer } from './CustomSliderRenderer.entry';

// 合并渲染器
const myRenderers = [
  ...primevueRenderers,
  customSliderRenderer,
];

// 使用
<json-forms
  :data="data"
  :schema="schema"
  :uischema="uischema"
  :renderers="myRenderers"
  @change="onChange"
/>
```

---

## 🎭 动态显示/隐藏控件

使用 `rule` 属性实现条件显示。

### 示例: 根据复选框显示字段

```json
{
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/hasPet",
      "label": "是否有宠物?"
    },
    {
      "type": "Control",
      "scope": "#/properties/petName",
      "label": "宠物名字",
      "rule": {
        "effect": "SHOW",
        "condition": {
          "scope": "#/properties/hasPet",
          "schema": { "const": true }
        }
      }
    }
  ]
}
```

---

## 📝 自定义验证消息

### 使用自定义 Ajv 关键字

```ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

// 添加自定义关键字
ajv.addKeyword({
  keyword: 'isStrongPassword',
  validate: (schema: any, data: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(data);
  },
  error: {
    message: '密码必须包含大小写字母和数字,且至少 8 位',
  },
});

// 在 schema 中使用
const schema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      isStrongPassword: true,
    },
  },
};
```

---

## 🔄 处理数组数据

### 自定义数组项渲染

```json
{
  "type": "Control",
  "scope": "#/properties/tags",
  "options": {
    "detail": {
      "type": "HorizontalLayout",
      "elements": [
        { "type": "Control", "scope": "#/properties/name" },
        { "type": "Control", "scope": "#/properties/value" }
      ]
    }
  }
}
```

---

## 🌐 国际化 (i18n)

### 使用自定义标签

```ts
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 在 schema 中
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: t('form.name'), // 使用 i18n
    },
  },
};
```

---

## 📦 性能优化

### 1. 使用 `Object.freeze()` 冻结渲染器数组

```ts
const renderers = Object.freeze(primevueRenderers);
```

### 2. 懒加载 schema

```ts
// 动态导入 schema
const schema = ref({});

onMounted(async () => {
  const module = await import('./schema.json');
  schema.value = module.default;
});
```

### 3. 避免不必要的重新渲染

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';

// 使用 shallowRef 避免深度响应
const data = shallowRef({});
const schema = shallowRef({});
</script>
```

---

## 🐛 调试技巧

### 1. 查看当前数据

```vue
<template>
  <div>
    <json-forms ... />

    <!-- 调试用 -->
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
```

### 2. 查看渲染器选择

```ts
// 在浏览器控制台
console.log(primevueRenderers.map(r => r.tester));
```

---

## 📖 下一步

- 查看 [API 参考](./api-reference.md) 了解完整 API
- 学习 [渲染器指南](./renderers-guide.md) 了解 35 个渲染器
- 参考 [开发者指南](./developer-guide.md) 了解如何贡献代码

---

**需要帮助?** 请在 [GitHub Issues](https://github.com/chaoqing/jsonforms-vue-primevue/issues) 中提问。
