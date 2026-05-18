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
      <Calendar
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="[styles.control.input, { 'p-invalid': control.errors }]"
        :disabled="!control.enabled"
        :readonly="control.readonly"
        :placeholder="appliedOptions.placeholder ?? timeFormat"
        :model-value="pickerValue"
        :time-only="true"
        :hour-format="hourFormat"
        :show-seconds="useSeconds"
        v-bind="primeVueProps('Calendar')"
        @update:model-value="onPickerChange"
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
import { computed, defineComponent } from 'vue';
import Calendar from 'primevue/calendar';
import { determineClearValue, parseDateTime, usePrimeVueControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const JSON_SCHEMA_TIME_FORMATS = [
  'HH:mm:ss.SSSZ',
  'HH:mm:ss.SSS',
  'HH:mm:ssZ',
  'HH:mm:ss',
];

const controlRenderer = defineComponent({
  name: 'time-control-renderer',
  components: {
    ControlWrapper,
    Calendar,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue('');
    const adaptValue = (value: any) => value || clearValue;
    return usePrimeVueControl(useJsonFormsControl(props), adaptValue);
  },
  computed: {
    timeFormat(): string {
      return typeof this.appliedOptions.timeFormat == 'string'
        ? this.appliedOptions.timeFormat
        : 'HH:mm';
    },
    timeSaveFormat(): string {
      return typeof this.appliedOptions.timeSaveFormat == 'string'
        ? this.appliedOptions.timeSaveFormat
        : 'HH:mm:ssZ';
    },
    formats(): string[] {
      return [
        this.timeSaveFormat,
        this.timeFormat,
        ...JSON_SCHEMA_TIME_FORMATS,
      ];
    },
    useSeconds(): boolean {
      return this.timeFormat.includes('s') ? true : false;
    },
    hourFormat(): string {
      return this.appliedOptions.ampm === true ? '12' : '24';
    },
    pickerValue(): Date | null {
      const value = this.control.data;
      const time = parseDateTime(value, this.formats);
      return time ? time.toDate() : null;
    },
  },
  methods: {
    onPickerChange(value: Date | null): void {
      const time = parseDateTime(value, undefined);
      const newdata: string | null = time
        ? time.format(this.timeSaveFormat)
        : null;
      this.onChange(newdata);
    },
  },
});

export default controlRenderer;
</script>
