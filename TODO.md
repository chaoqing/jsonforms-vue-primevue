# TODO - @chaoqing/jsonforms-vue-primevue

> Status: **All 35 renderers migrated and verified.** Build passes. Visual verification complete.
> Last updated: 2026-05-17

---

## ✅ Completed Tasks

| # | Task | Status | Commit / Date |
|---|------|--------|----------------|
| 1 | AdditionalProperties for ObjectRenderer | ✅ DONE | Commit `756a9fc6` |
| 2 | Restore Table View (ArrayControlRenderer) | ✅ DONE | Commit `d8f42602` |
| 3 | Improve CategorizationStepperRenderer | ✅ DONE | Commit `1f44b1b1` |
| 4 | Visual Verification (all 35 renderers) | ✅ DONE | 2026-05-17 |
| 5 | Fix ArrayControlRenderer missing `isPrimitiveArrayControl` | ✅ DONE | 2026-05-17 |
| 6 | Fix MixedRenderer duplicate event handler + missing CSS | ✅ DONE | 2026-05-17 |
| 7 | Create Screenshots.md visual baseline | ✅ DONE | 2026-05-17 |
| 8 | Create Playwright screenshot script | ✅ DONE | 2026-05-17 |

---

## Visual Verification Results (2026-05-17)

### Summary

| Category | Total | PASS | FAIL | SKIP |
|----------|-------|------|------|------|
| Controls | 17 | 15 | 0 | 2 |
| Layouts | 6 | 6 | 0 | 0 |
| Complex | 8 | 8 | 0 | 0 |
| Additional | 2 | 2 | 0 | 0 |
| Extended | 2 | 2 | 0 | 0 |
| **Total** | **35** | **33** | **0** | **2** |

**Skipped renderers** (no dedicated example in dev app):
- StringMaskControlRenderer — code-reviewed only
- AnyOfStringOrEnumControlRenderer — code-reviewed only

### Bugs Found & Fixed

#### Bug 1: ArrayControlRenderer — Missing `isPrimitiveArrayControl` tester
- **Issue**: `ArrayControlRenderer.entry.ts` only used `isObjectArrayControl`, so primitive arrays (like `string[]`) showed "No applicable renderer found."
- **Fix**: Added `isPrimitiveArrayControl` via `or(isObjectArrayControl, isPrimitiveArrayControl)` to match the Vuetify version.
- **File**: `src/complex/ArrayControlRenderer.entry.ts`

#### Bug 2: MixedRenderer — Duplicate event handler + missing CSS
- **Issue**: Both `@update:model-value` and `@change` were bound to `handleSelectChange`, causing double invocation. The `handleSelectChange` method also used complex event type detection instead of a simple `newIndex` parameter. Missing CSS styles for flex layout.
- **Fix**: Removed `@change` event binding, simplified `handleSelectChange` to accept `newIndex: number` directly (matching Vuetify version), added scoped CSS styles.
- **File**: `src/complex/MixedRenderer.vue`

---

## Remaining Work (Low Priority)

### Unit Test Infrastructure Fix
- **Status**: Pre-existing jsdom/webidl-conversions issue (same in `@jsonforms/vue-vuetify`)
- **May not be worth fixing** — upstream issue in jsdom
- **What would be needed**: investigate jsdom version compatibility, possibly add `webidl-conversions` polyfill or update `jsdom` in devDependencies

### Playwright Automated Visual Regression
- **Status**: Screenshot script created (`scripts/visual-check.mjs`)
- **What's next**: Add `@playwright/test` as devDependency, create `test-visual/` specs that compare screenshots with baseline using `pixelmatch` or Playwright's `expect(page).toHaveScreenshot()`
- **Priority**: Low — useful for CI but not blocking

### PrimeVue v4 Deprecation Warnings
- **Status**: Console warnings detected in browser: `Dropdown` → `Select`, `Calendar` → `DatePicker`
- **Priority**: Very low — these are future deprecation warnings; the current components still work correctly
- **What would be needed**: Replace `Dropdown` with `Select`, `Calendar` with `DatePicker` in all renderer components

---

## Progress Tracking

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | AdditionalProperties for ObjectRenderer | ✅ DONE | Commit `756a9fc6` |
| 2 | Restore Table View (ArrayControlRenderer) | ✅ DONE | Commit `d8f42602` |
| 3 | Improve CategorizationStepperRenderer | ✅ DONE | Commit `1f44b1b1` |
| 4 | Visual Verification (all 35 renderers) | ✅ DONE | 33/35 verified in browser, 2 code-reviewed |
| 5 | Unit Test Infrastructure Fix | ⬜ SKIP | Low priority, jsdom issue |
| 6 | Playwright Automated Visual Regression | ⬜ TODO | Depends on #4 (DONE), script created |

---

## Commit Convention

Each task:
1. `pnpm run build` — verify build passes
2. `git add ...` + `git commit -m "feat/fix/doc(vue-primevue): ..."`
3. `git push` to `migrate2primevue` branch on GitHub

---

**Last updated**: 2026-05-17
**Package**: `@chaoqing/jsonforms-vue-primevue@3.8.1`
