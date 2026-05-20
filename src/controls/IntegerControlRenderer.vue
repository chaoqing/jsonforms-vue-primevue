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
        <InputNumber
          v-disabled-icon-focus
          :id="control.id + '-input'"
          :class="[styles.control.input, { 'p-invalid': control.errors }]"
          :disabled="!control.enabled"
          :readonly="control.readonly"
          :autofocus="appliedOptions.focus"
          :placeholder="appliedOptions.placeholder"
          :model-value="value"
          :step="step"
          :min="control.schema.minimum"
          :max="control.schema.maximum"
          :use-grouping="false"
          v-bind="primeVueProps('InputNumber')"
          @update:model-value="onChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
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
import InputNumber from 'primevue/inputnumber';
import Fluid from 'primevue/fluid';
import { determineClearValue, usePrimeVueControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const controlRenderer = defineComponent({
  name: 'integer-control-renderer',
  components: {
    ControlWrapper,
    InputNumber,
    Fluid,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue(0);
    const adaptValue = (value: any) => (value === null ? clearValue : value);
    const input = usePrimeVueControl(useJsonFormsControl(props), adaptValue);

    return { ...input, adaptValue };
  },
  computed: {
    step(): number {
      const options: any = this.appliedOptions;
      return options.step ?? 1;
    },
    value(): number | null | undefined {
      if (
        typeof this.control.data === 'number' ||
        this.control.data === null ||
        this.control.data === undefined
      ) {
        return this.control.data;
      }
      return Number(this.control.data);
    },
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

.control-inner .p-inputnumber {
  width: 100%;
}
</style>
