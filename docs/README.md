# @chaoqing/jsonforms-vue-primevue 文档

> Vue PrimeVue v4 renderers for [JSON Forms](https://jsonforms.io/) — 社区维护包

本包为 [JSON Forms Vue](https://github.com/eclipsesource/jsonforms/tree/master/packages/vue) 提供基于 PrimeVue 的渲染器集,作为 `@jsonforms/vue-vuetify` 的替代品,服务于 PrimeVue 生态系统用户。

## 📚 文档导航

- [快速开始](./getting-started.md) - 安装和基本使用
- [API 参考](./api-reference.md) - 完整的 API 文档
- [渲染器指南](./renderers-guide.md) - 35 个渲染器详解
- [自定义主题](./theming.md) - PrimeVue 主题定制
- [高级用法](./advanced-usage.md) - 自定义渲染器、UI Schema 选项
- [开发者指南](./developer-guide.md) - 贡献代码、添加新渲染器
- [迁移指南](./migration-guide.md) - 从 Vuetify 版本迁移

## 🎯 核心特性

- ✅ **35 个渲染器** - 覆盖控件、布局、复杂类型
- ✅ **PrimeVue 4 设计令牌** - 完全支持主题定制
- ✅ **TypeScript 支持** - 完整的类型定义
- ✅ **Vue 3 Composition API** - 现代 Vue 最佳实践
- ✅ **扩展渲染器** - 支持自动补全变体
- ✅ **图标支持** - MDI 和 Font Awesome

## 📦 渲染器覆盖 (35 个)

| 类别 | 数量 | 渲染器 |
|------|------|---------|
| **控件 (Controls)** | 17 | Boolean, BooleanToggle, Date, DateTime, Enum, Integer, MultiString, Number, OneOfEnum, OneOfRadioGroup, Password, RadioGroup, Slider, String, StringMask, Time, AnyOfStringOrEnum |
| **布局 (Layouts)** | 6 | Vertical, Horizontal, Group, ArrayLayout, Categorization, CategorizationStepper |
| **复杂类型 (Complex)** | 8 | AllOf, AnyOf, OneOf, OneOfTab, Object, ArrayControl, EnumArray, Mixed |
| **附加 (Additional)** | 2 | Label, ListWithDetail |
| **扩展 (Extended)** | 2 | AutocompleteEnum, AutocompleteOneOfEnum |

## 🚀 快速示例

```vue
<script setup lang="ts">
import { JsonForms } from '@jsonforms/vue';
import { primevueRenderers } from '@chaoqing/jsonforms-vue-primevue';

const renderers = Object.freeze(primevueRenderers);
</script>

<template>
  <json-forms
    :data="data"
    :schema="schema"
    :uischema="uischema"
    :renderers="renderers"
    @change="onChange"
  />
</template>
```

## 🔗 相关链接

- **GitHub 仓库**: https://github.com/chaoqing/jsonforms-vue-primevue
- **问题追踪**: https://github.com/chaoqing/jsonforms-vue-primevue/issues
- **JSON Forms 官方文档**: https://jsonforms.io/docs/
- **PrimeVue 官方文档**: https://primevue.org/

## 📄 许可证

[MIT License](./LICENSE)

---

## 贡献

欢迎贡献!请查看 [开发者指南](./developer-guide.md) 了解如何参与。

**维护者**: chaoqing

> **注意**: 这是社区维护的包,发布在 `@chaoqing` 作用域下。如果 JSON Forms 项目正式采用 PrimeVue 支持,该包将迁移到 `@jsonforms` 作用域。
