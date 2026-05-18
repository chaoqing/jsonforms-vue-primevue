<template>
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
import { usePrimeVueControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';

const controlRenderer = defineComponent({
  name: 'boolean-toggle-control-renderer',
  components: {
    ControlWrapper,
    InputSwitch,
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
