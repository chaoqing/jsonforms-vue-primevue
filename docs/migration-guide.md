# 迁移指南

本文档帮助您从其他渲染器集迁移到 `@chaoqing/jsonforms-vue-primevue`,或从旧版本升级。

---

## 🔄 从 `@jsonforms/vue-vuetify` 迁移

如果您正在从 Vuetify 渲染器迁移,本库提供**废弃别名**以简化迁移。

### 1. 更新依赖

```bash
# 移除 Vuetify 渲染器
npm uninstall @jsonforms/vue-vuetify vuetify

# 安装 PrimeVue 渲染器
npm install --save @chaoqing/jsonforms-vue-primevue primevue @primevue/themes primeicons

# 安装 PrimeVue peer dependencies
npm install --save dayjs lodash maska ajv
```

### 2. 更新导入

#### 渲染器集

```ts
// ❌ 旧代码 (Vuetify)
import { vuetifyRenderers } from '@jsonforms/vue-vuetify';

// ✅ 新代码 (PrimeVue)
import { primevueRenderers } from '@chaoqing/jsonforms-vue-primevue';
```

#### 扩展渲染器

```ts
// ❌ 旧代码
import { extendedVuetifyRenderers } from '@jsonforms/vue-vuetify';

// ✅ 新代码
import { extendedPrimevueRenderers } from '@chaoqing/jsonforms-vue-primevue';
```

### 3. 更新组合式函数

```ts
// ❌ 旧代码
import { useVuetifyControl } from '@jsonforms/vue-vuetify';
import { useVuetifyLayout } from '@jsonforms/vue-vuetify';
import { useVuetifyArrayControl } from '@jsonforms/vue-vuetify';
import { useVuetifyLabel } from '@jsonforms/vue-vuetify';
import { useVuetifyBasicControl } from '@jsonforms/vue-vuetify';

// ✅ 新代码
import { usePrimeVueControl } from '@chaoqing/jsonforms-vue-primevue';
import { usePrimeVueLayout } from '@chaoqing/jsonforms-vue-primevue';
import { usePrimeVueArrayControl } from '@chaoqing/jsonforms-vue-primevue';
import { usePrimeVueLabel } from '@chaoqing/jsonforms-vue-primevue';
import { usePrimeVueBasicControl } from '@chaoqing/jsonforms-vue-primevue';
```

### 4. 注册 PrimeVue

在 `main.ts` 中添加:

```ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/aura/theme.css';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
```

### 5. 废弃别名 (临时兼容)

为方便迁移,以下别名**暂时可用**,但将在未来主要版本中移除:

| 废弃名称 | 替代名称 |
|---------|---------|
| `useVuetifyControl` | `usePrimeVueControl` |
| `useVuetifyLayout` | `usePrimeVueLayout` |
| `useVuetifyArrayControl` | `usePrimeVueArrayControl` |
| `useVuetifyLabel` | `usePrimeVueLabel` |
| `useVuetifyBasicControl` | `usePrimeVueBasicControl` |
| `vuetifyRenderers` | `primevueRenderers` |
| `extendedVuetifyRenderers` | `extendedPrimevueRenderers` |

> ⚠️ **警告**: 请尽快迁移到新名称,废弃别名将在 v4.0.0 中移除。

---

## 🔄 从 PrimeVue v3 升级到 v4

如果您正在从使用 PrimeVue v3 的旧版本升级:

### 1. 更新 PrimeVue 依赖

```bash
npm install --save primevue@^4.5.0 @primevue/themes@^4.5.0
```

### 2. 主题系统变更

PrimeVue v4 **不再使用 CSS 主题文件**,改为使用 **预设 (Presets)** 和 **设计令牌**。

#### ❌ 旧方式 (v3)

```ts
// main.ts
import 'primevue/resources/themes/bootstrap4-theme.css';
```

#### ✅ 新方式 (v4)

```ts
// main.ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
```

### 3. 自定义主题

#### ❌ 旧方式 (v3): 覆盖 CSS 类

```css
/* v3: 覆盖 .p-inputtext */
.p-inputtext {
  border-radius: 6px;
}
```

#### ✅ 新方式 (v4): 覆盖设计令牌

```css
/* v4: 覆盖 CSS 自定义属性 */
:root {
  --p-inputtext-border-radius: 6px;
}
```

或使用 `definePreset()`:

```ts
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MyPreset = definePreset(Aura, {
  components: {
    inputtext: {
      borderRadius: '6px',
    },
  },
});

app.use(PrimeVue, { theme: { preset: MyPreset } });
```

### 4. 图标系统变更

PrimeVue v4 使用 `primeicons` 作为默认图标集。

```bash
npm install --save primeicons
```

```ts
import 'primeicons/primeicons.css';
```

---

## 🔄 从 v2.x 升级到 v3.x

### 1. JSON Forms 3.x 兼容性

确保 `@jsonforms/core` 和 `@jsonforms/vue` 版本为 `^3.7.0`。

```bash
npm install --save @jsonforms/core@^3.7.0 @jsonforms/vue@^3.7.0
```

### 2. Vue 3.5+ 要求

本库现在需要 **Vue 3.5+**。

```bash
npm install --save vue@^3.5.0
```

### 3. TypeScript 5.5+ 要求

```bash
npm install --save-dev typescript@~5.5.0
```

---

## 🔄 从 v1.x 升级到 v2.x

### 1. 渲染器 API 变更

v2.x 引入了**双文件渲染器模式** (`.vue` + `.entry.ts`)。

如果您有**自定义渲染器**,需要更新:

#### ❌ 旧方式 (v1.x)

```ts
// MyControlRenderer.ts
export const myControlRenderer = {
  renderer: MyControlRenderer,
  tester: rankWith(3, isMyControl),
};
```

#### ✅ 新方式 (v2.x+)

**文件 1**: `MyControlRenderer.vue`

```vue
<script setup lang="ts">
import { usePrimeVueControl } from '@chaoqing/jsonforms-vue-primevue';
// ...
</script>
```

**文件 2**: `MyControlRenderer.entry.ts`

```ts
import MyControlRenderer from './MyControlRenderer.vue';

export const myControlRenderer = {
  renderer: MyControlRenderer,
  tester: rankWith(3, isMyControl),
};
```

### 2. `usePrimeVueControl()` 签名变更

```ts
// v1.x
const control = usePrimeVueControl(props);

// v2.x+
const { control, handleChange, appliedOptions } = usePrimeVueControl(useJsonFormsControl(props));
```

---

## 🧰 迁移工具

### ESLint 自动修复

```bash
npm run lint:fix
```

### 类型检查

```bash
npm run type-check
```

### 单元测试

```bash
npm run test
```

---

## ❓ 常见迁移问题

### 1. 样式不生效

**原因**: PrimeVue v4 使用设计令牌,旧 CSS 覆盖可能无效。

**解决**: 使用新的 CSS 自定义属性:

```css
:root {
  --p-inputtext-border-radius: 6px;
  --p-button-padding-x: 16px;
}
```

### 2. 图标不显示

**原因**: 未安装 `primeicons`。

**解决**:

```bash
npm install --save primeicons
```

```ts
import 'primeicons/primeicons.css';
```

### 3. TypeScript 类型错误

**原因**: 类型定义变更。

**解决**: 运行类型检查并修复:

```bash
npm run type-check
```

### 4. 渲染器未被选择

**原因**: Tester 排名不足。

**解决**: 增加 `rankWith()` 的优先级:

```ts
// 提高优先级
export const myControlRenderer = {
  renderer: MyControlRenderer,
  tester: rankWith(5, isMyControl), // 从 3 提高到 5
};
```

---

## 📚 延伸阅读

- **PrimeVue v4 迁移指南**: https://primevue.org/v4-migration/
- **JSON Forms 3.x 更新日志**: https://github.com/eclipsesource/jsonforms/releases
- **Vue 3.5 变更**: https://blog.vuejs.org/posts/vue-3-5

---

## 🆘 需要帮助?

- 查看 [API 参考](./api-reference.md)
- 查看 [渲染器指南](./renderers-guide.md)
- 在 [GitHub Issues](https://github.com/chaoqing/jsonforms-vue-primevue/issues) 中提问

---

**维护者**: chaoqing
