# 渲染器指南

本文档详细介绍 `@chaoqing/jsonforms-vue-primevue` 提供的 **35 个渲染器**,包括使用方法、UI Schema 配置和示例。

---

## 📊 渲染器总览

| 类别 | 数量 | 描述 |
|------|------|------|
| **Controls (控件)** | 17 | 基础表单控件 (输入、选择、日期等) |
| **Layouts (布局)** | 6 | 表单布局容器 |
| **Complex (复杂类型)** | 8 | 组合类型和嵌套结构 |
| **Additional (附加)** | 2 | 辅助渲染器 |
| **Extended (扩展)** | 2 | 增强功能 (自动补全) |

---

## 🎮 控件渲染器 (Controls)

### 1. 文本输入

#### `StringControlRenderer`
渲染单行文本输入。

**触发条件**: `type: 'string'` 且无 `format` 或 `enum`

**示例**:
```json
{
  "type": "Control",
  "scope": "#/properties/name"
}
```

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "InputText": {
        "placeholder": "请输入姓名",
        "maxlength": 50
      }
    }
  }
}
```

---

#### `MultiStringControlRenderer`
渲染多行文本输入 (textarea)。

**触发条件**: `type: 'string'`, `format: 'textarea'` 或 `options.multiline: true`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Textarea": {
        "autoResize": true,
        "rows": 5,
        "cols": 50
      }
    }
  }
}
```

---

#### `StringMaskControlRenderer`
渲染带输入掩码的文本框。

**触发条件**: `options.mask: '...'`

**示例**:
```json
{
  "type": "Control",
  "scope": "#/properties/phone",
  "options": {
    "mask": "999-9999-9999"
  }
}
```

---

### 2. 数字输入

#### `NumberControlRenderer`
渲染浮点数输入。

**触发条件**: `type: 'number'`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "InputNumber": {
        "mode": "decimal",
        "minFractionDigits": 2,
        "showButtons": true
      }
    }
  }
}
```

---

#### `IntegerControlRenderer`
渲染整数输入。

**触发条件**: `type: 'integer'`

---

#### `SliderControlRenderer`
渲染滑块控件。

**触发条件**: `options.slider: true` 或 `minimum` + `maximum` 定义

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Slider": {
        "min": 0,
        "max": 100,
        "step": 1
      }
    }
  }
}
```

---

### 3. 布尔值

#### `BooleanControlRenderer`
渲染复选框。

**触发条件**: `type: 'boolean'`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Checkbox": {
        "binary": true
      }
    }
  }
}
```

---

#### `BooleanToggleControlRenderer`
渲染开关切换。

**触发条件**: `options.toggle: true`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "ToggleSwitch": {
        "onLabel": "是",
        "offLabel": "否"
      }
    }
  }
}
```

---

### 4. 枚举选择

#### `EnumControlRenderer`
渲染下拉选择框。

**触发条件**: `enum: [...]` 或 `oneOf: [...]`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Dropdown": {
        "filter": true,
        "placeholder": "请选择",
        "showClear": true
      }
    }
  }
}
```

---

#### `OneOfEnumControlRenderer`
渲染 oneOf 枚举下拉框。

**触发条件**: `oneOf: [...]`

---

#### `OneOfRadioGroupControlRenderer`
渲染单选按钮组。

**触发条件**: `options.radiogroup: true`

---

#### `RadioGroupControlRenderer`
渲染通用单选组。

**触发条件**: `options.radio: true`

---

#### `AnyOfStringOrEnumControlRenderer`
渲染多选枚举或字符串输入。

**触发条件**: `type: 'array'`, `items.enum` 或 `items.type: 'string'`

---

### 5. 日期时间

#### `DateControlRenderer`
渲染日期选择器。

**触发条件**: `format: 'date'`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Calendar": {
        "dateFormat": "yy-mm-dd",
        "showIcon": true,
        "showButtonBar": true
      }
    }
  }
}
```

---

#### `DateTimeControlRenderer`
渲染日期时间选择器。

**触发条件**: `format: 'date-time'`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Calendar": {
        "showTime": true,
        "hourFormat": "12",
        "dateFormat": "yy-mm-dd"
      }
    }
  }
}
```

---

#### `TimeControlRenderer`
渲染时间选择器。

**触发条件**: `format: 'time'`

---

### 6. 特殊控件

#### `PasswordControlRenderer`
渲染密码输入框。

**触发条件**: `format: 'password'` 或 `options.password: true`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Password": {
        "promptLabel": "请输入密码",
        "weakLabel": "弱",
        "mediumLabel": "中",
        "strongLabel": "强"
      }
    }
  }
}
```

---

#### `ChipsControlRenderer`
渲染标签/芯片输入。

**触发条件**: `type: 'array'`, `items.type: 'string'`, `options.chips: true`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "Chips": {
        "allowDuplicate": false,
        "max": 10
      }
    }
  }
}
```

---

## 📐 布局渲染器 (Layouts)

### `VerticalLayoutRenderer`
**用途**: 垂直堆叠子元素 (默认布局)

**UI Schema**:
```json
{
  "type": "VerticalLayout",
  "elements": [
    { "type": "Control", "scope": "#/properties/name" },
    { "type": "Control", "scope": "#/properties/age" }
  ]
}
```

---

### `HorizontalLayoutRenderer`
**用途**: 水平排列子元素

**UI Schema**:
```json
{
  "type": "HorizontalLayout",
  "elements": [
    { "type": "Control", "scope": "#/properties/firstName" },
    { "type": "Control", "scope": "#/properties/lastName" }
  ]
}
```

---

### `GroupRenderer`
**用途**: 带标题的分组容器

**UI Schema**:
```json
{
  "type": "Group",
  "label": "基本信息",
  "elements": [...]
}
```

---

### `ArrayLayoutRenderer`
**用途**: 数组元素的布局容器

**UI Schema**:
```json
{
  "type": "ArrayLayout",
  "label": "联系人列表",
  "elements": [...]
}
```

---

### `CategorizationRenderer`
**用途**: 标签页分类布局

**UI Schema**:
```json
{
  "type": "Categorization",
  "elements": [
    {
      "type": "Category",
      "label": "基本信息",
      "elements": [...]
    },
    {
      "type": "Category",
      "label": "高级设置",
      "elements": [...]
    }
  ]
}
```

---

### `CategorizationStepperRenderer`
**用途**: 分步向导布局 (PrimeVue v4 Stepper)

**UI Schema**:
```json
{
  "type": "Categorization",
  "options": {
    "variant": "stepper"
  },
  "elements": [
    {
      "type": "Category",
      "label": "步骤 1",
      "elements": [...]
    },
    {
      "type": "Category",
      "label": "步骤 2",
      "elements": [...]
    }
  ]
}
```

---

## 🔗 复杂类型渲染器 (Complex)

### `ObjectRenderer`
**用途**: 渲染对象类型 (`type: 'object'`)

**自动生成**: 对象的属性将自动展开为垂直布局

**示例 Schema**:
```json
{
  "type": "object",
  "properties": {
    "address": {
      "type": "object",
      "properties": {
        "street": { "type": "string" },
        "city": { "type": "string" }
      }
    }
  }
}
```

---

### `ArrayControlRenderer`
**用途**: 渲染数组类型 (`type: 'array'`)

**功能**:
- ➕ 添加新元素
- 🗑️ 删除元素
- ⬆️⬇️ 上移/下移排序
- ✏️ 内联编辑

**UI Schema 选项**:
```json
{
  "options": {
    "detail": "Categorization",
    "label": "Add Item"
  }
}
```

---

### `AllOfRenderer`
**用途**: 渲染 `allOf` 组合

**示例 Schema**:
```json
{
  "allOf": [
    { "properties": { "name": { "type": "string" } } },
    { "properties": { "age": { "type": "integer" } } }
  ]
}
```

---

### `AnyOfRenderer`
**用途**: 渲染 `anyOf` 组合 (下拉选择)

**功能**: 用户从多个模式中选择一个

---

### `OneOfRenderer`
**用途**: 渲染 `oneOf` 组合 (下拉选择)

---

### `OneOfTabRenderer`
**用途**: 渲染 `oneOf` 组合 (标签页)

**UI Schema 选项**:
```json
{
  "options": {
    "variant": "tabs"
  }
}
```

---

### `EnumArrayRenderer`
**用途**: 渲染枚举数组 (多选)

**触发条件**: `type: 'array'`, `items.enum: [...]`

---

### `MixedRenderer`
**用途**: 渲染混合类型 (`oneOf` / `anyOf` 嵌套)

---

## 📎 附加渲染器 (Additional)

### `LabelRenderer`
**用途**: 渲染纯文本标签 (非表单控件)

**UI Schema**:
```json
{
  "type": "Label",
  "text": "以下是您的个人信息"
}
```

---

### `ListWithDetailRenderer`
**用途**: 渲染列表+详情布局

**UI Schema**:
```json
{
  "type": "ListWithDetail",
  "scope": "#/properties/items",
  "options": {
    "detail": "VerticalLayout"
  }
}
```

---

## 🚀 扩展渲染器 (Extended)

### `AutocompleteEnumControlRenderer`
**用途**: 带自动补全的枚举选择

**需要**: 使用 `extendedPrimevueRenderers`

**UI Schema 选项**:
```json
{
  "options": {
    "primevue": {
      "AutoComplete": {
        "suggestions": ["选项1", "选项2"],
        "completeOnFocus": true
      }
    }
  }
}
```

---

### `AutocompleteOneOfEnumControlRenderer`
**用途**: 带自动补全的 oneOf 枚举选择

---

## 🎯 UI Schema `primevue` 选项

所有渲染器都支持通过 UI Schema 的 `options.primevue` 传递 PrimeVue 组件 props:

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

**常用 PrimeVue 组件 Props 参考**:
- 查看 [PrimeVue 官方文档](https://primevue.org/inputtext/)
- 使用 Vue DevTools 检查组件 props
- 查看 `node_modules/primevue/{component}/index.d.ts`

---

## 📖 下一步

- 学习 [高级用法](./advanced-usage.md) 了解自定义渲染器
- 参考 [API 参考](./api-reference.md) 查看完整 API
- 查看 [主题指南](./theming.md) 定制外观

---

**需要帮助?** 请在 [GitHub Issues](https://github.com/chaoqing/jsonforms-vue-primevue/issues) 中提问。
