<template>
  <label
    v-if="label.visible"
    :class="styles.label.root"
  >
    {{ label.text }}
  </label>
</template>

<script lang="ts">
import { type LabelElement } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsLabel,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { usePrimeVueLabel } from '../util';

const labelRenderer = defineComponent({
  name: 'label-renderer',
  components: {},
  props: {
    ...rendererProps<LabelElement>(),
  },
  setup(props: RendererProps<LabelElement>) {
    return usePrimeVueLabel(useJsonFormsLabel(props));
  },
});

export default labelRenderer;
</script>
