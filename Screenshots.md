# Visual Baseline — @chaoqing/jsonforms-vue-primevue

> Generated: 2026-05-17
> Dev app: http://localhost:5173
> Total renderers: 35
> PrimeVue v4.5.5 | Aura theme

---

## Verification Summary

| Category | Total | PASS | FAIL | SKIP |
|----------|-------|------|------|------|
| Controls | 17 | 15 | 0 | 2 |
| Layouts | 6 | 6 | 0 | 0 |
| Complex | 8 | 8 | 0 | 0 |
| Additional | 2 | 2 | 0 | 0 |
| Extended | 2 | 2 | 0 | 0 |
| **Total** | **35** | **33** | **0** | **2** |

---

## Controls (17)

| # | Renderer | Example | Screenshot | Status | Notes |
|---|----------|---------|-------------|--------|-------|
| 1 | StringControlRenderer | String | [screenshot](./screenshots/controls/StringControlRenderer.png) | ✅ PASS | InputText renders correctly |
| 2 | IntegerControlRenderer | Numbers | [screenshot](./screenshots/controls/IntegerControlRenderer.png) | ✅ PASS | InputNumber with integer mode |
| 3 | NumberControlRenderer | Numbers | [screenshot](./screenshots/controls/NumberControlRenderer.png) | ✅ PASS | InputNumber with decimal support |
| 4 | BooleanControlRenderer | Control Options | [screenshot](./screenshots/controls/BooleanControlRenderer.png) | ✅ PASS | Checkbox with binary prop |
| 5 | BooleanToggleControlRenderer | Control Options | [screenshot](./screenshots/controls/BooleanToggleControlRenderer.png) | ✅ PASS | InputSwitch component |
| 6 | DateControlRenderer | Dates | [screenshot](./screenshots/controls/DateControlRenderer.png) | ✅ PASS | Calendar with date picker |
| 7 | DateTimeControlRenderer | Dates | [screenshot](./screenshots/controls/DateTimeControlRenderer.png) | ✅ PASS | Calendar with showTime |
| 8 | TimeControlRenderer | Dates | [screenshot](./screenshots/controls/TimeControlRenderer.png) | ✅ PASS | Calendar with timeOnly mode |
| 9 | EnumControlRenderer | Enums | [screenshot](./screenshots/controls/EnumControlRenderer.png) | ✅ PASS | Dropdown component |
| 10 | OneOfEnumControlRenderer | Enums | [screenshot](./screenshots/controls/OneOfEnumControlRenderer.png) | ✅ PASS | Dropdown with oneOf options |
| 11 | MultiStringControlRenderer | Text Control Options | [screenshot](./screenshots/controls/MultiStringControlRenderer.png) | ✅ PASS | Textarea with autoResize |
| 12 | PasswordControlRenderer | Login Form | [screenshot](./screenshots/controls/PasswordControlRenderer.png) | ✅ PASS | Password component with toggle |
| 13 | RadioGroupControlRenderer | Radio Group | [screenshot](./screenshots/controls/RadioGroupControlRenderer.png) | ✅ PASS | RadioButton group |
| 14 | OneOfRadioGroupControlRenderer | Radio Group | [screenshot](./screenshots/controls/OneOfRadioGroupControlRenderer.png) | ✅ PASS | RadioButton group with oneOf |
| 15 | SliderControlRenderer | Numbers | [screenshot](./screenshots/controls/SliderControlRenderer.png) | ✅ PASS | Slider component |
| 16 | StringMaskControlRenderer | — | — | ⬜ SKIP | No example uses `mask` UI Schema option; code-reviewed only |
| 17 | AnyOfStringOrEnumControlRenderer | — | — | ⬜ SKIP | No example with `anyOf` enum+string pattern; code-reviewed only |

## Layouts (6)

| # | Renderer | Example | Screenshot | Status | Notes |
|---|----------|---------|-------------|--------|-------|
| 1 | VerticalLayoutRenderer | Layout Vertical | [screenshot](./screenshots/layouts/VerticalLayoutRenderer.png) | ✅ PASS | Flexbox column layout |
| 2 | HorizontalLayoutRenderer | Layout Horizontal | [screenshot](./screenshots/layouts/HorizontalLayoutRenderer.png) | ✅ PASS | Flexbox row layout with gap |
| 3 | GroupRenderer | Layout Group | [screenshot](./screenshots/layouts/GroupRenderer.png) | ✅ PASS | Fieldset component |
| 4 | ArrayLayoutRenderer | Array | [screenshot](./screenshots/layouts/ArrayLayoutRenderer.png) | ✅ PASS | Panel with collapse |
| 5 | CategorizationRenderer | Categorization | [screenshot](./screenshots/layouts/CategorizationRenderer.png) | ✅ PASS | Tabs component |
| 6 | CategorizationStepperRenderer | Categorization (Stepper) | [screenshot](./screenshots/layouts/CategorizationStepperRenderer.png) | ✅ PASS | PrimeVue v4 Stepper component |

## Complex (8)

| # | Renderer | Example | Screenshot | Status | Notes |
|---|----------|---------|-------------|--------|-------|
| 1 | AllOfRenderer | allOf | [screenshot](./screenshots/complex/AllOfRenderer.png) | ✅ PASS | Combinator + DispatchRenderer |
| 2 | AnyOfRenderer | anyOf | [screenshot](./screenshots/complex/AnyOfRenderer.png) | ✅ PASS | Dropdown + Dialog confirmation |
| 3 | OneOfRenderer | oneOf | [screenshot](./screenshots/complex/OneOfRenderer.png) | ✅ PASS | Dropdown + Dialog confirmation |
| 4 | OneOfTabRenderer | oneOf | [screenshot](./screenshots/complex/OneOfTabRenderer.png) | ✅ PASS | Tabs for oneOf switching |
| 5 | ObjectRenderer | Object | [screenshot](./screenshots/complex/ObjectRenderer.png) | ✅ PASS | With AdditionalProperties |
| 6 | ArrayControlRenderer | Array of Strings | [screenshot](./screenshots/complex/ArrayControlRenderer.png) | ✅ PASS | DataTable for objects, list for primitives |
| 7 | EnumArrayRenderer | Enum Multi | [screenshot](./screenshots/complex/EnumArrayRenderer.png) | ✅ PASS | Checkbox group for multi-select |
| 8 | MixedRenderer | Mixed Object | [screenshot](./screenshots/complex/MixedRenderer.png) | ✅ PASS | Dropdown for type switching, dispatch renders input |

## Additional (2)

| # | Renderer | Example | Screenshot | Status | Notes |
|---|----------|---------|-------------|--------|-------|
| 1 | LabelRenderer | Layout Complex | [screenshot](./screenshots/additional/LabelRenderer.png) | ✅ PASS | HTML label element |
| 2 | ListWithDetailRenderer | List With Detail | [screenshot](./screenshots/additional/ListWithDetailRenderer.png) | ✅ PASS | Listbox + DispatchRenderer |

## Extended (2)

| # | Renderer | Example | Screenshot | Status | Notes |
|---|----------|---------|-------------|--------|-------|
| 1 | AutocompleteEnumControlRenderer | Person | [screenshot](./screenshots/extended/AutocompleteEnumControlRenderer.png) | ✅ PASS | AutoComplete for enum fields |
| 2 | AutocompleteOneOfEnumControlRenderer | Person | [screenshot](./screenshots/extended/AutocompleteOneOfEnumControlRenderer.png) | ✅ PASS | AutoComplete for oneOf enum fields |

---

## Bugs Found & Fixed (2026-05-17)

### Bug 1: ArrayControlRenderer — Missing `isPrimitiveArrayControl` tester
- **Issue**: `ArrayControlRenderer.entry.ts` only used `isObjectArrayControl`, so primitive arrays (like `string[]`) showed "No applicable renderer found."
- **Fix**: Added `isPrimitiveArrayControl` via `or(isObjectArrayControl, isPrimitiveArrayControl)` to match the Vuetify version.
- **File**: `src/complex/ArrayControlRenderer.entry.ts`

### Bug 2: MixedRenderer — Duplicate event handler + missing CSS
- **Issue**: Both `@update:model-value` and `@change` were bound to `handleSelectChange`, causing double invocation. The `handleSelectChange` method also used complex event type detection instead of a simple `newIndex` parameter. Missing CSS styles for flex layout.
- **Fix**: Removed `@change` event binding, simplified `handleSelectChange` to accept `newIndex: number` directly (matching Vuetify version), added scoped CSS styles.
- **File**: `src/complex/MixedRenderer.vue`

---

## Verification Checklist (per renderer)

- [x] Renders without console errors
- [x] Label displays correctly
- [x] Input interaction works (type, click, select)
- [x] Validation errors display (tested on Login Form, Control Options)
- [x] Readonly mode renders correctly (tested on Readonly examples)
- [x] Disabled mode works via global "Read-Only" setting
- [x] Styling matches PrimeVue design language
- [x] No Vuetify CSS leakage

---

## Regenerating Screenshots

```bash
cd packages/vue-primevue
pnpm run dev &                       # start dev server
node scripts/visual-check.mjs       # capture screenshots
```
