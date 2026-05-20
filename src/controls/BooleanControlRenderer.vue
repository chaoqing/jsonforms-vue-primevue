<template>
  <Fluid>
    <control-wrapper
      v-bind="controlWrapper"
      :styles="styles"
      :isFocused="isFocused"
      :appliedOptions="appliedOptions"
    >
      <div :class="styles.control.root + '-inner'">
        <label :for="control.id + '-input'" class="primevue-control-label">
          <Checkbox
            :id="control.id + '-input'"
            :class="styles.control.input"
            :disabled="!control.enabled"
            :readonly="control.readonly"
            :binary="true"
            :model-value="!!control.data"
            v-bind="primeVueProps('Checkbox')"
            @update:model-value="onChange"
            @focus="handleFocus"
            @blur="handleBlur"
          />
          {{ computedLabel }}
          <span v-if="control.required" class="primevue-control-required">*</span>
        </label>
        <small v-if="control.errors" class="primevue-control-error">{{ control.errors }}</small>
        <small v-else-if="control.description && persistentHint()" class="primevue-control-hint">{{ control.description }}</small>
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
import Checkbox from 'primevue/checkbox';
import Fluid from 'primevue/fluid';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { usePrimeVueControl } from '../util';

const controlRenderer = defineComponent({
  name: 'boolean-control-renderer',
  components: {
    ControlWrapper,
    Checkbox,
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
  display: flex;
  align-items: center;
  gap: var(--p-spacing-1, 0.25rem);
  font-weight: 500;
  color: var(--p-text-color);
  font-size: var(--p-font-size-sm, 0.875rem);
}
</style>
