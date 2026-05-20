<template>
  <Fluid>
    <control-wrapper
      v-bind="controlWrapper"
      :styles="styles"
      :isFocused="isFocused"
      :appliedOptions="appliedOptions"
    >
      <div class="flex align-items-center gap-2">
        <InputSwitch
          :id="control.id + '-input'"
          :class="styles.control.input"
          :disabled="!control.enabled"
          :readonly="control.readonly"
          :autofocus="appliedOptions.focus"
          :model-value="control.data"
          v-bind="primeVueProps('InputSwitch')"
          @update:model-value="onChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <label v-if="computedLabel" :for="control.id + '-input'" class="text-sm">
          {{ computedLabel }}
        </label>
      </div>
    </control-wrapper>
  </Fluid>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import InputSwitch from 'primevue/inputswitch';
import Fluid from 'primevue/fluid';
import { usePrimeVueControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';

const controlRenderer = defineComponent({
  name: 'boolean-toggle-control-renderer',
  components: {
    ControlWrapper,
    InputSwitch,
    Fluid,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return usePrimeVueControl(useJsonFormsControl(props));
  },
});

export default controlRenderer;
</script>

<style scoped>
.control-inner {
  display: flex;
  flex-direction: column;
  gap: var(--p-spacing-1, 0.25rem);
}

.primevue-control-label {
  font-weight: 500;
  color: var(--p-text-color);
  font-size: var(--p-font-size-sm, 0.875rem);
  display: flex;
  align-items: center;
  gap: var(--p-spacing-1, 0.25rem);
}

.primevue-control-required {
  color: var(--p-error-color, #f87171);
  font-weight: 600;
}

.primevue-control-error {
  color: var(--p-error-color, #f87171);
  font-size: var(--p-font-size-sm, 0.875rem);
  display: block;
  margin-top: var(--p-spacing-1, 0.25rem);
}

.primevue-control-hint {
  color: var(--p-text-color-secondary, #6b7280);
  font-size: var(--p-font-size-sm, 0.875rem);
  display: block;
  margin-top: var(--p-spacing-1, 0.25rem);
}
</style>
