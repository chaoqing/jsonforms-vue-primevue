# @chaoqing/jsonforms-vue-primevue

> Vue PrimeVue v4 renderers for [JSON Forms](https://jsonforms.io/) — community-maintained package.

This package provides a PrimeVue-based renderer set for [JSON Forms Vue](https://github.com/eclipsesource/jsonforms/tree/master/packages/vue), serving as a drop-in alternative to `@jsonforms/vue-vuetify` for users in the PrimeVue ecosystem.

It covers **35 renderers** across controls, layouts, complex/combinator types, and extended autocomplete variants.

> **Note**: This is a community-maintained package published under `@chaoqing` scope. If the JSON Forms project officially adopts PrimeVue support, the package will be migrated to the `@jsonforms` scope.

## Installation

```bash
npm i --save @chaoqing/jsonforms-vue-primevue @jsonforms/core @jsonforms/vue
```

Also install PrimeVue and its peer dependencies:

```bash
npm i --save primevue @primevue/themes primeicons
npm i --save dayjs lodash maska ajv
```

## Quick Start

Register PrimeVue in your app entry point:

```ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/aura/theme.css';

const app = createApp(App);
app.use(PrimeVue, { theme: { preset: Aura } });
```

Use the `json-forms` component with the PrimeVue renderer set:

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

For extended renderers (includes autocomplete variants):

```ts
import { extendedPrimevueRenderers } from '@chaoqing/jsonforms-vue-primevue';
```

## Icons

This package supports MDI and Font Awesome icon sets via PrimeVue's icon system:

```ts
import { mdiIconAliases } from '@chaoqing/jsonforms-vue-primevue';
import '@mdi/font/css/materialdesignicons.css';
```

```ts
import { faIconAliases } from '@chaoqing/jsonforms-vue-primevue';
import '@fortawesome/fontawesome-free/css/all.css';
```

## Vite Configuration

If using Vite, exclude `primevue/core` from optimization deps:

```ts
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['primevue/core'],
  },
});
```

## Customization

### Override the ControlWrapper component

All control renderers wrap their components with a **`ControlWrapper`** component. You can supply your own wrapper via Vue's `provide` / `inject` mechanism:

```ts
import { provide, type DefineComponent } from 'vue';
import {
  ControlWrapperSymbol,
  type ControlWrapperProps,
} from '@chaoqing/jsonforms-vue-primevue';
import CustomControlWrapper from './components/CustomControlWrapper.vue';

provide(
  ControlWrapperSymbol,
  CustomControlWrapper as DefineComponent<ControlWrapperProps>,
);
```

### Passing PrimeVue component props via UI Schema

You can pass PrimeVue component props through the `primevue` key in UI Schema options:

```json
{
  "type": "Control",
  "scope": "#/properties/name",
  "options": {
    "primevue": {
      "InputText": { "placeholder": "Enter your name" }
    }
  }
}
```

## Renderer Coverage (35 total)

| Category | Count | Renderers |
|----------|-------|-----------|
| Controls | 17 | Boolean, BooleanToggle, Date, DateTime, Enum, Integer, MultiString, Number, OneOfEnum, OneOfRadioGroup, Password, RadioGroup, Slider, String, StringMask, Time, AnyOfStringOrEnum |
| Layouts | 6 | Vertical, Horizontal, Group, ArrayLayout, Categorization, CategorizationStepper |
| Complex | 8 | AllOf, AnyOf, OneOf, OneOfTab, Object, ArrayControl, EnumArray, Mixed |
| Additional | 2 | Label, ListWithDetail |
| Extended | 2 | AutocompleteEnum, AutocompleteOneOfEnum |

## Backward Compatibility

The following deprecated aliases are provided for users migrating from `@jsonforms/vue-vuetify`:

| Deprecated | Replacement |
|------------|-------------|
| `useVuetifyControl` | `usePrimeVueControl` |
| `useVuetifyLayout` | `usePrimeVueLayout` |
| `useVuetifyArrayControl` | `usePrimeVueArrayControl` |
| `useVuetifyLabel` | `usePrimeVueLabel` |
| `useVuetifyBasicControl` | `usePrimeVueBasicControl` |
| `vuetifyRenderers` | `primevueRenderers` |
| `extendedVuetifyRenderers` | `extendedPrimevueRenderers` |

These aliases will be removed in a future major version.

## PrimeVue Theme Customization

This package uses PrimeVue v4's **design token** system. You can customize the look and feel at multiple levels.

### Switching Themes

PrimeVue v4 uses **presets** instead of legacy theme CSS files. To switch from the default Aura to another preset (e.g., Lara):

```ts
// main.ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';
import Material from '@primevue/themes/material';
import { definePreset } from '@primevue/themes';

const app = createApp(App);

// Option 1: Use built-in preset
app.use(PrimeVue, { theme: { preset: Lara } });

// Option 2: Customize a preset (recommended)
const MyPreset = definePreset(Lara, {
  // Override specific tokens
  primary: 'emerald',
  surface: 'slate',
  colorScheme: {
    light: {
      primary: { DEFAULT: '#10b981' },
    },
    dark: {
      primary: { DEFAULT: '#34d399' },
    },
  },
});

app.use(PrimeVue, { theme: { preset: MyPreset } });
```

See [PrimeVue Theming Docs](https://primevue.org/theming/) for full details.

### Overriding CSS Custom Properties

PrimeVue v4 exposes **design tokens** as CSS custom properties. You can override them globally or scoped to JSON Forms:

```css
/* global.css - overrides all PrimeVue components */
:root {
  /* Primary color (affects buttons, checkboxes, etc.) */
  --p-primary-color: #10b981;

  /* Text colors */
  --p-text-color: #1e293b;
  --p-text-muted-color: #64748b;

  /* Surface colors */
  --p-surface-0: #ffffff;
  --p-surface-50: #f8fafc;
  --p-surface-100: #f1f5f9;
  --p-surface-200: #e2e8f0;
  --p-surface-700: #334155;
  --p-surface-900: #0f172a;

  /* Border */
  --p-content-border-color: #e2e8f0;
  --p-overlay-border-color: #e2e8f0;

  /* Border radius */
  --p-border-radius-sm: 4px;
  --p-border-radius-md: 6px;
  --p-border-radius-lg: 8px;

  /* Focus ring */
  --p-focus-ring-color: rgba(16, 185, 129, 0.5);
  --p-focus-ring-width: 2px;

  /* Transitions */
  --p-transition-duration: 200ms;
}

/* Dark mode */
[data-theme="dark"] {
  --p-text-color: #e2e8f0;
  --p-surface-0: #0f172a;
  --p-surface-100: #1e293b;
}
```

### Scoped Overrides for JSON Forms

To style **only JSON Forms controls** without affecting other PrimeVue components:

```vue
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
  /* Override JSON Forms control styles */
  --p-inputtext-padding-x: 12px;
  --p-inputtext-padding-y: 8px;
  --p-dropdown-padding-x: 12px;
  --p-calendar-padding: 8px 12px;

  /* Make labels bold */
  .p-label {
    font-weight: 600;
  }

  /* Custom error color */
  .p-invalid {
    --p-inputtext-border-color: #ef4444;
  }
}
</style>
```

### Using `primeVueProps()` in UI Schema

You can pass **any PrimeVue component prop** through the `primevue` key in UI Schema options:

```json
{
  "type": "Control",
  "scope": "#/properties/name",
  "options": {
    "primevue": {
      "InputText": {
        "placeholder": "Enter your name",
        "size": "large",
        "variant": "filled"
      }
    }
  }
}
```

**Common use cases:**

#### 1. Disable autocomplete
```json
{
  "options": {
    "primevue": {
      "InputText": { "autocomplete": "off" }
    }
  }
}
```

#### 2. Custom date format
```json
{
  "options": {
    "primevue": {
      "Calendar": {
        "dateFormat": "yy-mm-dd",
        "showTime": true,
        "hourFormat": "12"
      }
    }
  }
}
```

#### 3. Dropdown with filter
```json
{
  "options": {
    "primevue": {
      "Dropdown": {
        "filter": true,
        "filterPlaceholder": "Search...",
        "showClear": true
      }
    }
  }
}
```

#### 4. Textarea auto-resize
```json
{
  "options": {
    "primevue": {
      "Textarea": {
        "autoResize": true,
        "rows": 3
      }
    }
  }
}
```

### Listing Available Props

To see all available props for a PrimeVue component, check:
- **PrimeVue docs**: https://primevue.org/inputtext/ (component-specific page)
- **DevTools**: Inspect the component in Vue DevTools → "Props" tab
- **Source code**: `node_modules/primevue/{component}/index.d.ts`

### Error State Styling

JSON Forms automatically adds `p-invalid` class to PrimeVue components when validation fails. Customize:

```css
/* Custom error border */
.p-invalid {
  --p-inputtext-border-color: #ef4444 !important;
  --p-dropdown-border-color: #ef4444 !important;
}

/* Error message styling (controlled by JSON Forms, not PrimeVue) */
.json-forms-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}
```

### Dark Mode Support

PrimeVue v4 supports dark mode via `data-theme` attribute:

```ts
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Or use PrimeVue's built-in dark mode
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
});
```

```css
/* styles.css */
.app-dark .json-forms {
  --p-surface-0: #0f172a;
  --p-text-color: #e2e8f0;
  --p-content-border-color: #334155;
}
```

---

## Visual Baseline

See [Screenshots.md](./Screenshots.md) for the visual baseline of all 35 renderers.

To regenerate screenshots after making changes:

```bash
cd packages/vue-primevue
pnpm run dev &                    # start dev server
node scripts/visual-check.mjs     # capture screenshots
```

---

## Known Limitations

- **StringMaskControlRenderer**: No dedicated example in the dev app — code-reviewed only
- **AnyOfStringOrEnumControlRenderer**: No dedicated example in the dev app — code-reviewed only
- **CategorizationStepperRenderer**: Uses PrimeVue v4 Stepper component (previously custom implementation)

## License

MIT
