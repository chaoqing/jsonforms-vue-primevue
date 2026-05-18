<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <Dropdown
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
      v-bind="primeVueProps('Dropdown')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement, type JsonSchema } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import { determineClearValue, usePrimeVueControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';

const controlRenderer = defineComponent({
  name: 'anyof-string-or-enum-control-renderer',
  components: {
    ControlWrapper,
    Dropdown,
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
