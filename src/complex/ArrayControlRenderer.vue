<template>
  <div v-if="control.visible" :class="styles.arrayList.root">
    <div :class="styles.arrayList.title">
      <div :class="styles.arrayList.toolbar">
        <span :class="styles.arrayList.label">{{ computedLabel }}</span>
        <Button
          icon="pi pi-plus"
          text
          rounded
          :aria-label="control.translations.addAriaLabel"
          :disabled="
            !isControlEditable(control) ||
            (appliedOptions.restrict &&
              control.arraySchema !== undefined &&
              control.arraySchema.maxItems !== undefined &&
              dataLength >= control.arraySchema.maxItems)
          "
          @click="addButtonClick"
          v-tooltip="control.translations.addTooltip"
        />
      </div>
    </div>
    <DataTable
      v-if="appliedOptions.tableView !== false"
      :value="control.data"
      :class="styles.arrayList.item"
    >
      <Column
        v-for="prop in validColumnProps"
        :key="prop"
        :header="title(prop)"
      >
        <template #body="{ data, index }">
          <dispatch-renderer
            :schema="control.schema"
            :uischema="resolveUiSchema(prop)"
            :path="composePaths(control.path, `${index}`)"
            :enabled="control.enabled"
            :readonly="control.readonly"
            :renderers="control.renderers"
            :cells="control.cells"
          />
        </template>
      </Column>
      <Column v-if="isControlEditable(control)" :header="''">
        <template #body="{ index }">
          <Button
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            :aria-label="control.translations.removeAriaLabel"
            :disabled="
              !isControlEditable(control) ||
              (appliedOptions.restrict &&
                control.arraySchema !== undefined &&
                control.arraySchema.minItems !== undefined &&
                dataLength <= control.arraySchema.minItems)
            "
            @click="removeItemsClick($event, [index])"
            v-tooltip="control.translations.removeTooltip"
          />
        </template>
      </Column>
      <Column v-if="appliedOptions.showSortButtons && isControlEditable(control)" :header="''">
        <template #body="{ index }">
          <Button
            icon="pi pi-chevron-up"
            text
            rounded
            :aria-label="control.translations.upAriaLabel"
            :disabled="index <= 0 || !isControlEditable(control)"
            @click="moveUpClick($event, index)"
          />
          <Button
            icon="pi pi-chevron-down"
            text
            rounded
            :aria-label="control.translations.downAriaLabel"
            :disabled="
              index >= dataLength - 1 ||
              !isControlEditable(control)
            "
            @click="moveDownClick($event, index)"
          />
        </template>
      </Column>
    </DataTable>
    <template v-if="appliedOptions.tableView === false">
      <div :class="styles.arrayList.item" v-for="(element, index) in control.data" :key="`${control.path}-${control.data.length}-${index}`">
        <dispatch-renderer
          :schema="control.schema"
          :uischema="controlWithoutLabel('#')"
          :path="composePaths(control.path, `${index}`)"
          :enabled="control.enabled"
          :readonly="control.readonly"
          :renderers="control.renderers"
          :cells="control.cells"
        />
        <Button
          icon="pi pi-trash"
          text
          rounded
          severity="danger"
          :aria-label="control.translations.removeAriaLabel"
          :disabled="
            !isControlEditable(control) ||
            (appliedOptions.restrict &&
              control.arraySchema !== undefined &&
              control.arraySchema.minItems !== undefined &&
              dataLength <= control.arraySchema.minItems)
          "
          @click="removeItemsClick($event, [index])"
          v-tooltip="control.translations.removeTooltip"
        />
      </div>
    </template>
    <div v-if="dataLength === 0" :class="styles.arrayList.noData">
      {{ control.translations.noDataMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  composePaths,
  createDefaultValue,
  type ControlElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import startCase from 'lodash/startCase';
import { isControlEditable, usePrimeVueArrayControl } from '../util';

const controlRenderer = defineComponent({
  name: 'array-control-renderer',
  components: {
    DispatchRenderer,
    Button,
    DataTable,
    Column,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsArrayControl(props);

    return {
      ...usePrimeVueArrayControl(input),
      isControlEditable,
    };
  },
  computed: {
    dataLength(): number {
      return this.control.data ? this.control.data.length : 0;
    },
    validColumnProps() {
      if (
        this.control.schema.type === 'object' &&
        typeof this.control.schema.properties === 'object'
      ) {
        return Object.keys(this.control.schema.properties).filter(
          (prop) => this.control.schema.properties![prop].type !== 'array',
        );
      }
      // primitives
      return [''];
    },
  },
  methods: {
    composePaths,
    createDefaultValue,
    startCase,
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema, this.control.rootSchema),
      )();
    },
    removeItemsClick(event: Event, toDelete: number[]): void {
      event.stopPropagation();
      this.removeItems?.(this.control.path, toDelete)();
    },
    moveUpClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveUp?.(this.control.path, toMove)();
    },
    moveDownClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveDown?.(this.control.path, toMove)();
    },
    controlWithoutLabel(scope: string): ControlElement {
      return { type: 'Control', scope: scope, label: false };
    },
    title(prop: string) {
      return this.control.schema.properties?.[prop]?.title ?? startCase(prop);
    },
    resolveUiSchema(propName: string) {
      return this.control.schema.properties && propName
        ? this.controlWithoutLabel(`#/properties/${propName}`)
        : this.controlWithoutLabel('#');
    },
  },
});

export default controlRenderer;
</script>
