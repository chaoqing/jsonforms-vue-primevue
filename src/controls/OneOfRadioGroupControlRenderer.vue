<template>
  <Fluid>
    <control-wrapper
      v-bind="controlWrapper"
      :styles="styles"
      :isFocused="isFocused"
      :appliedOptions="appliedOptions"
    >
      <div :class="styles.control.root + '-inner'">
        <label v-if="computedLabel" :for="control.id + '-input'" class="primevue-control-label">
          {{ computedLabel }}
          <span v-if="control.required" class="primevue-control-required">*</span>
        </label>
        <div :id="control.id + '-input'" :class="styles.control.input">
          <div
            v-for="o in control.options"
            :key="o.value"
            class="flex align-items-center gap-2 mb-2"
          >
            <RadioButton
              :input-id="control.id + '-' + o.value"
              :name="control.id + '-input'"
              :value="o.value"
              :model-value="control.data"
              :disabled="!control.enabled"
              :readonly="control.readonly"
              v-bind="primeVueProps('RadioButton')"
              @update:model-value="onChange"
              @focus="handleFocus"
              @blur="handleBlur"
            />
            <label :for="control.id + '-' + o.value">{{ o.label }}</label>
          </div>
        </div>
        <small v-if="control.errors" class="primevue-control-error">{{ control.errors }}</small>
        <small v-else-if="control.description && persistentHint()" class="primevue-control-hint">{{ control.description }}</small>
      </div>
    </control-wrapper>
  </Fluid>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  useJsonFormsOneOfEnumControl,
  type RendererProps,
} from '@jsonforms/vue';
import RadioButton from 'primevue/radiobutton';
import Fluid from 'primevue/fluid';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { usePrimeVueControl } from '../util';

const controlRenderer = defineComponent({
  name: 'oneof-radio-group-control-renderer',
  components: {
    ControlWrapper,
    RadioButton,
    Fluid,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return usePrimeVueControl(useJsonFormsOneOfEnumControl(props));
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

.control-inner .p-radiobutton {
  width: 100%;
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
