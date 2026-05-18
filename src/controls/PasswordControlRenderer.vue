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
      <Password
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="[styles.control.input, { 'p-invalid': control.errors }]"
        :disabled="!control.enabled"
        :readonly="control.readonly"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :model-value="control.data"
        :maxlength="
          appliedOptions.restrict ? control.schema.maxLength : undefined
        "
        :feedback="false"
        :toggle-mask="true"
        v-bind="primeVueProps('Password')"
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
import { defineComponent } from 'vue';
import Password from 'primevue/password';
import { usePrimeVueControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const controlRenderer = defineComponent({
  name: 'password-control-renderer',
  components: {
    ControlWrapper,
    Password,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return usePrimeVueControl(
      useJsonFormsControl(props),
      (value) => value || undefined,
      300,
    );
  },
});

export default controlRenderer;
</script>
