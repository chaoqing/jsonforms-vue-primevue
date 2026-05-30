# API 参考

本文档提供 `@chaoqing/jsonforms-vue-primevue` 的完整 API 参考。

## 📦 主要导出

### 渲染器集

#### `primevueRenderers`

标准的 PrimeVue 渲染器集,包含 35 个渲染器。

```ts
import { primevueRenderers } from '@chaoqing/jsonforms-vue-primevue';

// 类型
const primevueRenderers: JsonFormsRendererRegistryEntry[];
```

**包含渲染器:**
- 17 个控件渲染器 (Controls)
- 6 个布局渲染器 (Layouts)
- 8 个复杂类型渲染器 (Complex)
- 2 个附加渲染器 (Additional)
- 2 个扩展渲染器 (Extended) - 需要 `extendedPrimevueRenderers`

#### `extendedPrimevueRenderers`

扩展的 PrimeVue 渲染器集,在标准集基础上增加了自动补全变体。

```ts
import { extendedPrimevueRenderers } from '@chaoqing/jsonforms-vue-primevue';

// 类型
const extendedPrimevueRenderers: JsonFormsRendererRegistryEntry[];
```

**额外包含:**
- `AutocompleteEnumControlRenderer`
- `AutocompleteOneOfEnumControlRenderer`

---

## 🎮 控件渲染器 (Controls)

### 基础控件

#### `StringControlRenderer`
**用途**: 渲染字符串输入 (`type: 'string'`)

**PrimeVue 组件**: `InputText`

**Props**:
- `schema`: JSON Schema 属性
- `uischema`: UI Schema 配置
- `data`: 当前值
- `renderers`: 渲染器集

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "InputText": {
        "placeholder": "请输入...",
        "maxlength": 100
      }
    }
  }
}
```

#### `NumberControlRenderer`
**用途**: 渲染数字输入 (`type: 'number'`)

**PrimeVue 组件**: `InputNumber`

#### `IntegerControlRenderer`
**用途**: 渲染整数输入 (`type: 'integer'`)

**PrimeVue 组件**: `InputNumber` (无小数)

#### `BooleanControlRenderer`
**用途**: 渲染布尔值 (`type: 'boolean'`)

**PrimeVue 组件**: `Checkbox`

#### `BooleanToggleControlRenderer`
**用途**: 渲染布尔值切换开关

**PrimeVue 组件**: `ToggleSwitch`

#### `PasswordControlRenderer`
**用途**: 渲染密码输入

**PrimeVue 组件**: `Password`

---

### 枚举控件

#### `EnumControlRenderer`
**用途**: 渲染下拉选择 (`enum: [...]`)

**PrimeVue 组件**: `Dropdown`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Dropdown": {
        "filter": true,
        "showClear": true,
        "placeholder": "请选择"
      }
    }
  }
}
```

#### `OneOfEnumControlRenderer`
**用途**: 渲染单选枚举 (oneOf)

**PrimeVue 组件**: `Dropdown`

#### `OneOfRadioGroupControlRenderer`
**用途**: 渲染单选按钮组

**PrimeVue 组件**: `RadioButton`

#### `RadioGroupControlRenderer`
**用途**: 渲染通用单选组

**PrimeVue 组件**: `RadioButton`

#### `AnyOfStringOrEnumControlRenderer`
**用途**: 渲染多选枚举或字符串输入

**PrimeVue 组件**: `AutoComplete` / `MultiSelect`

---

### 日期时间控件

#### `DateControlRenderer`
**用途**: 渲染日期选择 (`format: 'date'`)

**PrimeVue 组件**: `Calendar` (date)

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Calendar": {
        "dateFormat": "yy-mm-dd",
        "showIcon": true
      }
    }
  }
}
```

#### `DateTimeControlRenderer`
**用途**: 渲染日期时间选择 (`format: 'date-time'`)

**PrimeVue 组件**: `Calendar` (date + time)

#### `TimeControlRenderer`
**用途**: 渲染时间选择 (`format: 'time'`)

**PrimeVue 组件**: `Calendar` (time only)

---

### 特殊控件

#### `SliderControlRenderer`
**用途**: 渲染滑块输入

**PrimeVue 组件**: `Slider`

#### `MultiStringControlRenderer`
**用途**: 渲染多行文本

**PrimeVue 组件**: `Textarea`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Textarea": {
        "autoResize": true,
        "rows": 5
      }
    }
  }
}
```

#### `StringMaskControlRenderer`
**用途**: 渲染带掩码的输入

**PrimeVue 组件**: `InputMask` (基于 `maska`)

#### `ChipsControlRenderer`
**用途**: 渲染标签/芯片输入

**PrimeVue 组件**: `Chips`

---

## 📐 布局渲染器 (Layouts)

### `VerticalLayoutRenderer`
**用途**: 垂直布局 (默认)

```json
{
  "type": "VerticalLayout",
  "elements": [...]
}
```

### `HorizontalLayoutRenderer`
**用途**: 水平布局

```json
{
  "type": "HorizontalLayout",
  "elements": [...]
}
```

### `GroupRenderer`
**用途**: 分组布局 (带标题)

```json
{
  "type": "Group",
  "label": "基本信息",
  "elements": [...]
}
```

### `ArrayLayoutRenderer`
**用途**: 数组布局

```json
{
  "type": "ArrayLayout",
  "label": "项目列表",
  "elements": [...]
}
```

### `CategorizationRenderer`
**用途**: 分类标签页布局

```json
{
  "type": "Categorization",
  "elements": [
    {
      "type": "Category",
      "label": "基本信息",
      "elements": [...]
    }
  ]
}
```

### `CategorizationStepperRenderer`
**用途**: 分步向导布局 (PrimeVue v4 Stepper)

```json
{
  "type": "Categorization",
  "options": {
    "variant": "stepper"
  },
  "elements": [...]
}
```

---

## 🔧 复杂类型渲染器 (Complex)

### `ObjectRenderer`
**用途**: 渲染对象类型 (`type: 'object'`)

### `ArrayControlRenderer`
**用途**: 渲染数组类型 (`type: 'array'`)

**功能**:
- 添加/删除元素
- 上移/下移排序
- 内联编辑

### `AllOfRenderer`
**用途**: 渲染 `allOf` 组合

### `AnyOfRenderer`
**用途**: 渲染 `anyOf` 组合

### `OneOfRenderer`
**用途**: 渲染 `oneOf` 组合 (下拉选择)

### `OneOfTabRenderer`
**用途**: 渲染 `oneOf` 组合 (标签页)

### `EnumArrayRenderer`
**用途**: 渲染枚举数组

### `MixedRenderer`
**用途**: 渲染混合类型

---

## 📎 附加渲染器 (Additional)

### `LabelRenderer`
**用途**: 渲染纯标签文本

```json
{
  "type": "Label",
  "text": "这是一段说明文字"
}
```

### `ListWithDetailRenderer`
**用途**: 渲染列表+详情布局

---

## 🔍 扩展渲染器 (Extended)

### `AutocompleteEnumControlRenderer`
**用途**: 带自动补全的枚举选择

**PrimeVue 组件**: `AutoComplete`

### `AutocompleteOneOfEnumControlRenderer`
**用途**: 带自动补全的 oneOf 枚举选择

**PrimeVue 组件**: `AutoComplete`

---

## 🎨 工具函数

### `usePrimeVueControl()`

组合式函数,用于创建自定义控件渲染器。

```ts
import { usePrimeVueControl } from '@chaoqing/jsonforms-vue-primevue';

export default defineComponent({
  setup(props) {
    const {
      control,
      handleChange,
      appliedOptions,
    } = usePrimeVueControl(useJsonFormsControl(props));

    return { control, handleChange, appliedOptions };
  },
});
```

### `usePrimeVueLayout()`

组合式函数,用于创建自定义布局渲染器。

```ts
import { usePrimeVueLayout } from '@chaoqing/jsonforms-vue-primevue';

export default defineComponent({
  setup(props) {
    const layout = usePrimeVueLayout(useJsonFormsLayout(props));
    return { layout };
  },
});
```

### `primeVueProps()`

从 UI Schema 的 `options.primevue` 中提取 PrimeVue 组件 props。

```ts
import { primeVueProps } from '@chaoqing/jsonforms-vue-primevue';

// 在组件中使用
const primeProps = primeVueProps('InputText', props.uischema);
```

### `useStyles()`

获取样式相关的计算属性。

```ts
import { useStyles } from '@chaoqing/jsonforms-vue-primevue';

const { styles } from useStyles();
```

---

## 🎯 符号导出 (Symbols)

### `ControlWrapperSymbol`

用于提供自定义 `ControlWrapper` 组件。

```ts
import { ControlWrapperSymbol } from '@chaoqing/jsonforms-vue-primevue';
import CustomControlWrapper from './CustomControlWrapper.vue';

provide(ControlWrapperSymbol, CustomControlWrapper);
```

---

## 📌 类型定义

### `ControlWrapperProps`

`ControlWrapper` 组件的 props 类型。

```ts
interface ControlWrapperProps {
  label: string;
  required: boolean;
  description: string;
  errors: string[];
  visible: boolean;
  enabled: boolean;
  // ...
}
```

---

## 🔄 向后兼容别名

为从 `@jsonforms/vue-vuetify` 迁移的用户提供废弃别名:

| 废弃名称 | 替代名称 |
|---------|---------|
| `useVuetifyControl` | `usePrimeVueControl` |
| `useVuetifyLayout` | `usePrimeVueLayout` |
| `useVuetifyArrayControl` | `usePrimeVueArrayControl` |
| `vuetifyRenderers` | `primevueRenderers` |
| `extendedVuetifyRenderers` | `extendedPrimevueRenderers` |

> ⚠️ **废弃警告**: 这些别名将在未来的主要版本中移除。

---

## 📖 下一步

- 查看 [渲染器指南](./renderers-guide.md) 了解每个渲染器的详细用法
- 学习 [高级用法](./advanced-usage.md) 了解自定义渲染器和 UI Schema 选项
- 参考 [主题指南](./theming.md) 定制外观

---

**需要帮助?** 请在 [GitHub Issues](https://github.com/chaoqing/jsonforms-vue-primevue/issues) 中提问。
