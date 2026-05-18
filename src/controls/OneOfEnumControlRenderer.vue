<template>
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
      <Dropdown
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="[styles.control.input, { 'p-invalid': control.errors }]"
        :disabled="!control.enabled"
        :readonly="control.readonly"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :model-value="control.data"
        :options="control.options"
        option-label="label"
        option-value="value"
        :show-clear="clearable"
        v-bind="primeVueProps('Dropdown')"
        @update:model-value="onChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <small v-if="control.errors" class="primevue-control-error">{{ control.errors }}</small>
      <small v-else-if="control.description && persistentHint()" class="primevue-control-hint">{{ control.description }}</small>
    </div>
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsOneOfEnumControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import { determineClearValue, usePrimeVueControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const controlRenderer = defineComponent({
  name: 'oneof-enum-control-renderer',
  components: {
    ControlWrapper,
    Dropdown,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue('');
    return usePrimeVueControl(useJsonFormsOneOfEnumControl(props), (value) =>
      value === null ? clearValue : value,
    );
  },
});

export default controlRenderer;
</script>
