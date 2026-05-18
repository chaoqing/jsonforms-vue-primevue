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
          />
          <label :for="control.id + '-' + o.value">{{ o.label }}</label>
        </div>
      </div>
      <small v-if="control.errors" class="primevue-control-error">{{ control.errors }}</small>
      <small v-else-if="control.description && persistentHint()" class="primevue-control-hint">{{ control.description }}</small>
    </div>
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  useJsonFormsEnumControl,
  type RendererProps,
} from '@jsonforms/vue';
import RadioButton from 'primevue/radiobutton';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { usePrimeVueControl } from '../util';

const controlRenderer = defineComponent({
  name: 'radio-group-control-renderer',
  components: {
    ControlWrapper,
    RadioButton,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return usePrimeVueControl(useJsonFormsEnumControl(props));
  },
});

export default controlRenderer;
</script>
