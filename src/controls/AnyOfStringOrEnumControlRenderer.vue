<template>
  <Fluid>
    <control-wrapper
      v-bind="controlWrapper"
      :styles="styles"
      :isFocused="isFocused"
      :appliedOptions="appliedOptions"
    >
      <Select
        :id="control.id + '-input'"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :readonly="control.readonly"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :label="computedLabel"
        :hint="control.description"
        :required="control.required"
        :model-value="control.data"
        :options="items"
        :editable="true"
        :maxlength="
          appliedOptions.restrict ? control.schema.maxLength : undefined
        "
        v-bind="primeVueProps('Select')"
        @update:model-value="onChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </control-wrapper>
  </Fluid>
</template>

<script lang="ts">
import { type ControlElement, type JsonSchema } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import Select from 'primevue/select';
import Fluid from 'primevue/fluid';
import { determineClearValue, usePrimeVueControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';

const controlRenderer = defineComponent({
  name: 'anyof-string-or-enum-control-renderer',
  components: {
    ControlWrapper,
    Select,
    Fluid,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue('');
    return usePrimeVueControl(
      useJsonFormsControl(props),
      (value) => value || clearValue,
    );
  },
  computed: {
    items(): string[] {
      // made sure via the testers
      return findEnumSchema(this.control.schema.anyOf!)!.enum!;
    },
  },
});

export default controlRenderer;

const findEnumSchema = (schemas: JsonSchema[]) =>
  schemas.find(
    (s) =>
      s.enum !== undefined && (s.type === 'string' || s.type === undefined),
  );
</script>

<style scoped>
.control-inner {
  display: flex;
  flex-direction: column;
  gap: var(--p-spacing-1, 0.25rem);
}

.control-inner .p-select {
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
