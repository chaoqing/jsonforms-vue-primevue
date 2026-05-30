# 开发者指南

本文档为想要贡献代码或添加新渲染器的开发者提供详细指导。

---

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/chaoqing/jsonforms-vue-primevue.git
cd jsonforms-vue-primevue
```

### 2. 安装依赖

```bash
npm install --legacy-peer-deps
```

> **注意**: 如果遇到 peer dependency 冲突,使用 `--legacy-peer-deps` 标志。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看示例应用。

### 4. 运行测试

```bash
npm run test
```

### 5. 构建

```bash
npm run build
```

### 6. Lint 和类型检查

```bash
# ESLint
npm run lint

# TypeScript 类型检查
npm run type-check
```

---

## 📂 仓库结构

```
jsonforms-vue-primevue/
├── src/
│   ├── controls/       # 基础表单控件 (字符串、数字、布尔等)
│   ├── complex/        # 组合和复合渲染器 (数组、对象、oneOf 等)
│   ├── layouts/        # 布局渲染器 (垂直、水平、分组)
│   ├── additional/     # 辅助渲染器 (标签、列表+详情)
│   ├── extended/       # 增强渲染器 (自动补全变体)
│   ├── util/           # 共享工具函数 (组合式函数、日期工具、选项)
│   ├── styles/         # CSS 令牌和样式工具
│   ├── i18n/          # 翻译工具
│   └── renderers.ts    # 主注册表导出 (primevueRenderers)
├── tests/
│   └── unit/           # Vitest 单元测试
├── example/            # 示例应用和示例 schema
├── dev/                # 开发工具
└── scripts/            # 构建和工具脚本
```

---

## 🎨 关键架构模式

### 1. 双文件渲染器模式 (推荐)

每个渲染器由 **2 个文件** 组成:

```
MyControl/
├── MyControlRenderer.vue      # Vue 组件
└── MyControlRenderer.entry.ts # 入口文件 (渲染器 + tester)
```

#### 组件文件 (`.vue`)

```vue
<!-- MyControlRenderer.vue -->
<script setup lang="ts">
import { defineComponent } from 'vue';
import { useJsonFormsControl } from '@jsonforms/vue';
import { usePrimeVueControl } from '../../../util';

const props = defineProps({
  ...rendererProps<ControlElement>(),
});

const {
  control,
  handleChange,
  appliedOptions,
} = usePrimeVueControl(useJsonFormsControl(props));

// 值转换函数
const transform = (value: any) => {
  // 处理数据转换 (trim, parse, 等)
  return value?.trim();
};

// 传递给 usePrimeVueControl
usePrimeVueControl(useJsonFormsControl(props), transform);
</script>

<template>
  <ControlWrapper
    :label="control.label"
    :required="control.required"
    :description="control.description"
    :errors="control.errors"
    :visible="control.visible"
    :enabled="control.enabled"
  >
    <PrimeVueComponent
      :modelValue="control.data"
      @update:modelValue="handleChange(control.path, $event)"
      :disabled="!control.enabled"
      v-bind="appliedOptions.primevue?.PrimeVueComponent || {}"
    />
  </ControlWrapper>
</template>
```

#### 入口文件 (`.entry.ts`)

```ts
// MyControlRenderer.entry.ts
import { rankWith } from '@jsonforms/core';
import { isStringControl } from '../helpers';

import MyControlRenderer from './MyControlRenderer.vue';

// Tester 函数
const isMyControl = (uischema: ControlElement, schema: JsonSchema) => {
  // 检测逻辑: 何时使用此渲染器?
  return isStringControl(uischema, schema) &&
    uischema.options?.myOption === true;
};

// 导出 entry
export const myControlRenderer = {
  renderer: MyControlRenderer,
  tester: rankWith(3, isMyControl), // 优先级 3
};
```

---

### 2. 组合式工具函数

位于 `src/util/`:

#### `usePrimeVueControl()`

标准接线 (样式、onChange、防抖、焦点)

```ts
const {
  control,
  handleChange,
  appliedOptions,
} = usePrimeVueControl(useJsonFormsControl(props));
```

#### `useJsonFormsControl()`

核心 JSON Forms 控制逻辑

```ts
const control = useJsonFormsControl(props);
```

#### `useComputedLabel()`, `useStyles()`, `primeVueProps()`

辅助工具函数

```ts
const label = useComputedLabel(control.label);
const styles = useStyles(appliedOptions);
const primeProps = primeVueProps('InputText', uischema);
```

---

### 3. ControlWrapper 组件

中央包装器,渲染标签、错误、提示和一致的样式。所有控件都应使用它。

```vue
<ControlWrapper
  :label="control.label"
  :required="control.required"
  :description="control.description"
  :errors="control.errors"
  :visible="control.visible"
  :enabled="control.enabled"
>
  <!-- 您的 PrimeVue 组件 -->
</ControlWrapper>
```

---

### 4. Tester 和排名

使用 tester 函数 + `rankWith(priority, testerFn)` 选择正确的渲染器。**更高的排名胜出**。

```ts
// 优先级示例
rankWith(1, isStringControl);       // 低优先级
rankWith(3, isEnumControl);         // 中优先级
rankWith(5, isCustomControl);       // 高优先级
```

**支持三种状态逻辑**:
- `true`: 明确启用
- `false`: 明确禁用
- `'auto'`: 自动检测 (默认)

---

## ➕ 如何添加新渲染器 (实践步骤)

### 步骤 1: 规划

- 阅读现有类似控件以镜像模式 (组件 API、appliedOptions、样式、测试)
- 决定 tester 逻辑: 明确选项 vs 自动检测。优先使用三状态逻辑: `options.myRenderer` `true/false/auto`

### 步骤 2: 实现组件

**创建文件**: `src/controls/YourControlRenderer.vue`

```vue
<script setup lang="ts">
import { defineComponent } from 'vue';
import { rendererProps, RendererProps } from '@jsonforms/vue';
import { useJsonFormsControl } from '@jsonforms/vue';
import { usePrimeVueControl } from '../util';

const props = defineProps(rendererProps<RendererProps>());

const {
  control,
  handleChange,
  appliedOptions,
} = usePrimeVueControl(useJsonFormsControl(props));

// 值转换 (如果需要)
const transform = (value: any) => {
  // 例如: trim、过滤空值、转换格式
  return value;
};

// 如果不需要转换,可以省略
</script>

<template>
  <ControlWrapper
    :label="control.label"
    :required="control.required"
    :description="control.description"
    :errors="control.errors"
    :visible="control.visible"
    :enabled="control.enabled"
  >
    <YourPrimeVueComponent
      :modelValue="control.data"
      @update:modelValue="handleChange(control.path, $event)"
      :disabled="!control.enabled"
      v-bind="appliedOptions.primevue?.YourPrimeVueComponent || {}"
    />
  </ControlWrapper>
</template>

<style scoped>
/* 组件样式 */
</style>
```

### 步骤 3: 创建入口文件

**创建文件**: `src/controls/YourControlRenderer.entry.ts`

```ts
import { rankWith, schemaMatches } from '@jsonforms/core';
import { ControlElement } from '@jsonforms/core';

import YourControlRenderer from './YourControlRenderer.vue';

// Tester 逻辑
const isYourControl = (uischema: ControlElement, schema: JsonSchema) => {
  // 示例: 检测 schema 或 ui schema 中的特定条件
  return (
    schema.type === 'string' &&
    uischema.options?.yourOption === true
  );
};

// 导出 entry
export const yourControlRenderer = {
  renderer: YourControlRenderer,
  tester: rankWith(3, isYourControl),
};
```

### 步骤 4: 注册

**编辑文件**: `src/controls/index.ts`

```ts
// 添加导出
export { yourControlRenderer } from './YourControlRenderer.entry';
```

> **注意**: 如果 `src/renderers.ts` 从 `src/controls/index.ts` 导出,则无需额外更改。

### 步骤 5: 添加示例 schema/data

**编辑文件**: `example/src/schemas.js`

```js
// 添加示例
export const yourControlExample = {
  schema: {
    type: 'object',
    properties: {
      yourField: {
        type: 'string',
        title: '您的字段',
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/yourField',
    options: {
      yourOption: true,
    },
  },
  data: {
    yourField: '初始值',
  },
};
```

### 步骤 6: 测试

**创建文件**: `tests/unit/YourControlRenderer.test.ts`

```ts
import { mount } from '@vue/test-utils';
import { mountJsonForms } from '../util';
import { yourControlExample } from '../../example/src/schemas';

describe('YourControlRenderer', () => {
  test('渲染正确的 DOM 元素', () => {
    const wrapper = mountJsonForms(yourControlExample.data, yourControlExample.schema, yourControlExample.uischema);

    // 断言
    expect(wrapper.find('.your-selector').exists()).toBe(true);
  });

  test('正确处理值变化', async () => {
    const wrapper = mountJsonForms(yourControlExample.data, yourControlExample.schema, yourControlExample.uischema);

    // 模拟用户输入
    await wrapper.find('.your-selector').setValue('新值');

    // 断言数据变化
    expect(wrapper.emitted().change[0][0].data.yourField).toBe('新值');
  });

  test('显示验证错误', () => {
    const wrapper = mountJsonForms({}); // 空数据触发错误

    expect(wrapper.find('.p-invalid').exists()).toBe(true);
  });
});
```

运行测试:

```bash
npm run test
```

### 步骤 7: PR 前 QA 检查清单

- [ ] `npm run type-check` (无 TypeScript 错误)
- [ ] `npm run lint` (修复 ESLint 警告/错误)
- [ ] `npm run build` (确保构建输出)
- [ ] `npm run test` (所有测试通过)
- [ ] 在示例应用中手动检查

---

## ⚠️ 常见陷阱及避免方法

### 1. 模板语法错误

Vue 模板被 TypeScript 工具严格解析 - 确保引号和绑定语法正确。

```vue
<!-- ❌ 错误 -->
<input :value="{{ control.data }}">

<!-- ✅ 正确 -->
<input :value="control.data">
```

### 2. 未使用的导入

ESLint 会标记未使用的导入; 只导入您使用的。

```ts
// ❌ 错误
import { ref, computed, watch } from 'vue'; // watch 未使用

// ✅ 正确
import { ref, computed } from 'vue';
```

### 3. Peer Dependency 冲突

如果 `npm install` 因 peer 范围失败,开发时使用 `npm install --legacy-peer-deps`。

### 4. Tester 错误分类

使用明确选项覆盖 + 自动检测组合,避免意外的渲染器选择。

```ts
// 好的做法: 支持三状态
const isMyControl = (uischema: ControlElement) => {
  if (uischema.options?.myRenderer === true) return true;
  if (uischema.options?.myRenderer === false) return false;
  return autoDetect(uischema, schema); // 'auto'
};
```

---

## 🧪 测试模式

### 使用 `mountJsonForms` 工具

位于 `tests/util/`:

```ts
import { mountJsonForms } from '../util';

const wrapper = mountJsonForms(
  data,       // 初始数据
  schema,     // JSON Schema
  uischema,   // UI Schema
  renderers   // 渲染器数组 (可选)
);
```

### 测试应覆盖

- 预期 DOM 元素的渲染
- 值转换 (trimming、parsing、存储格式)
- 禁用/只读状态
- 验证失败时错误显示

---

## 🌿 版本控制、分支和 PR 工作流

### 分支命名

使用功能分支:

```bash
git checkout -b feat/short-description
# 例如: feat/chips-array-renderer
```

### Commit 消息

包含简洁的摘要和要点细节。如果使用 Copilot 生成,添加 `Co-authored-by` 尾部。

```
feat: 添加 Chips 控件渲染器

- 实现 ChipsControlRenderer.vue
- 添加单元测试
- 更新示例 schema

Co-authored-by: Copilot <copilot@github.com>
```

### PR 内容

解释**改变了什么**、**为什么**、**如何测试**以及**列出修改/创建的文件**。

### 跨 fork PR

```bash
# 添加上游远程
git remote add upstream https://github.com/chaoqing/jsonforms-vue-primevue.git

# 创建 PR
gh pr create --repo chaoqing/jsonforms-vue-primevue --head your-fork:your-branch
```

---

## 🤖 AI Agent 自动化指南

如果您使用 AI agent (例如 Copilot、Codebuddy) 生成代码:

### 1. 严格遵循仓库模式

- 使用双文件渲染器模式
- 遵循 `usePrimeVueControl` 签名
- 使用 `ControlWrapper` 包装组件

### 2. 优先非侵入性更改

- 添加新文件
- 在 `index.ts` 中导出它们
- 避免更改核心行为

### 3. 解决冲突时

生产更改优先人工审查 (尤其是 peer dependency 更改)。

### 4. 代码生成时

同时生成测试和示例 schema 条目。

---

## ✅ 功能就绪检查清单

- [ ] 代码匹配仓库模式
- [ ] 单元测试已添加并通过
- [ ] 类型和 lint 检查通过
- [ ] 构建输出已验证
- [ ] 示例已更新用于手动 QA
- [ ] PR 描述记录了测试和迁移说明 (如果有)

---

## 🔧 故障排除技巧

### 1. 构建或安装失败

检查 peer dependency 冲突消息,开发时考虑使用 `--legacy-peer-deps`。

### 2. Lint 失败

运行 ESLint 自动修复并解决剩余问题:

```bash
npm run lint:fix
```

### 3. 渲染器未被选择

确保 tester 排名高于竞争渲染器,并且明确选项被尊重。

```ts
// 调试: 检查 tester 排名
console.log('My renderer rank:', rankWith(3, isMyControl));
```

---

## 📚 延伸阅读和资源

- **JSON Forms 文档**: testers, renderers, ui schema
- **PrimeVue 文档**: 组件 props 和事件 (例如 Chips)
- **Vue 3 Composition API**: defineComponent, ref, computed, provide/inject
- **TypeScript**: 组件 props 和工具函数的严格类型

---

## 📧 联系和贡献礼仪

- 在大更改前**开启 issue** 进行设计/行为讨论
- 保持 PR **小而聚焦**
- 为**破坏性**或**选择性行为**提供使用示例和迁移说明

---

**需要帮助?** 请在 [GitHub Issues](https://github.com/chaoqing/jsonforms-vue-primevue/issues) 中提问。
