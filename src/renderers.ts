import { additionalRenderers } from './additional';
import { complexRenderers } from './complex';
import { controlRenderers } from './controls';
import { extendedRenderers } from './extended';
import { layoutRenderers } from './layouts';

export const primevueRenderers = [
  ...additionalRenderers,
  ...complexRenderers,
  ...controlRenderers,
  ...layoutRenderers,
];

export const extendedPrimevueRenderers = [
  ...extendedRenderers,
  ...primevueRenderers,
];

/** @deprecated Use primevueRenderers instead */
export const vuetifyRenderers = primevueRenderers;

/** @deprecated Use extendedPrimevueRenderers instead */
export const extendedVuetifyRenderers = extendedPrimevueRenderers;
