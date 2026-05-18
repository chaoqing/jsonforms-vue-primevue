import { rankWith, scopeEndsWith } from '@jsonforms/core';
import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import UsernameCheckerRenderer from './UsernameCheckerRenderer.vue';

export const prependAppendExampleRenderers: JsonFormsRendererRegistryEntry[] = [
  {
    renderer: UsernameCheckerRenderer,
    tester: rankWith(10, scopeEndsWith('username')),
  },
];

export function getCustomRenderersForExample(
  exampleName: string,
): JsonFormsRendererRegistryEntry[] {
  return exampleName === 'prepend-append-slots'
    ? prependAppendExampleRenderers
    : [];
}
