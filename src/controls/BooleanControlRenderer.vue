<template>
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
import { default as ControlWrapper } from './ControlWrapper.vue';
import { usePrimeVueControl } from '../util';

const controlRenderer = defineComponent({
  name: 'boolean-control-renderer',
  components: {
    ControlWrapper,
    Checkbox,
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
