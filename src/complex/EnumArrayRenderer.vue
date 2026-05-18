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
      <div :class="checkboxGroupClasses">
        <div
          v-for="(o, index) in control.options"
          :key="o.value"
          class="flex align-items-center gap-2 mb-2"
        >
          <Checkbox
            :input-id="control.id + `-input-${index}`"
            :name="control.id + '-input'"
            :value="o.value"
            :model-value="control.data || []"
            :disabled="!control.enabled"
            :readonly="control.readonly"
            v-bind="primeVueProps('Checkbox')"
            @update:model-value="() => toggle(o.value)"
          />
          <label :for="control.id + `-input-${index}`">{{ o.label }}</label>
        </div>
      </div>
      <small v-if="control.errors" class="primevue-control-error">{{ control.errors }}</small>
      <small v-else-if="control.description && persistentHint()" class="primevue-control-hint">{{ control.description }}</small>
    </div>
  </control-wrapper>
</template>

<script lang="ts">
import { composePaths, type ControlElement } from '@jsonforms/core';
import {
  rendererProps,
  type RendererProps,
  useJsonFormsMultiEnumControl,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import Checkbox from 'primevue/checkbox';
import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { usePrimeVueControl } from '../util';

const controlRenderer = defineComponent({
  name: 'enum-array-renderer',
  components: {
    ControlWrapper,
    Checkbox,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return usePrimeVueControl(useJsonFormsMultiEnumControl(props));
  },
  methods: {
    dataHasEnum(value: any) {
      return !!this.control.data?.includes(value);
    },
    composePaths,
    toggle(value: any) {
      if (!this.dataHasEnum(value)) {
        this.addItem(this.control.path, value);
      } else {
        this.removeItem?.(this.control.path, value);
      }
    },
  },
  computed: {
    checkboxGroupClasses() {
      const classes = ['flex', 'gap-3'];
      if (this.appliedOptions.vertical) {
        classes.push('flex-column');
      } else {
        classes.push('flex-wrap');
      }
      return classes.join(' ');
    },
  },
});

export default controlRenderer;
</script>
