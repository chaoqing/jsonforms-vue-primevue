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
        v-if="suggestions !== undefined"
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :placeholder="appliedOptions.placeholder || 'Select an option'"
        :options="suggestions"
        :model-value="control.data"
        :clearable="clearable"
        :show-clear="clearable"
        option-label="label"
        option-value="value"
        v-bind="primeVueProps('Dropdown')"
        @update:model-value="onChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <InputText
        v-else
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="[styles.control.input, { 'p-invalid': control.errors }]"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :model-value="control.data"
        :max-length="
          appliedOptions.restrict ? control.schema.maxLength : undefined
        "
        v-bind="primeVueProps('InputText')"
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
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import every from 'lodash/every';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { usePrimeVueControl, determineClearValue } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const controlRenderer = defineComponent({
  name: 'string-control-renderer',
  components: {
    ControlWrapper,
    InputText,
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
    return usePrimeVueControl(
      useJsonFormsControl(props),
      (value) => value || clearValue,
      300,
    );
  },
  computed: {
    suggestions(): Array<{ label: string; value: string }> | undefined {
      const suggestions = this.control.uischema.options?.suggestion;

      if (
        suggestions === undefined ||
        !isArray(suggestions) ||
        !every(suggestions, isString)
      ) {
        return undefined;
      }
      return suggestions.map((s: string) => ({ label: s, value: s }));
    },
  },
});

export default controlRenderer;
</script>
