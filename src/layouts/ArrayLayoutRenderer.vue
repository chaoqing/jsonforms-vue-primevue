<template>
  <Fluid v-if="control.visible">
    <div :class="styles.arrayList.root">
      <div :class="styles.arrayList.title">
        <div :class="styles.arrayList.toolbar">
          <span :class="styles.arrayList.label">{{ computedLabel }}</span>
          <Button
            icon="pi pi-plus"
            text
            rounded
            :aria-label="control.translations.addAriaLabel"
            :disabled="addDisabled"
            @click="addButtonClick"
            v-tooltip="control.translations.addTooltip"
          />
        </div>
      </div>
      <div :class="styles.arrayList.container">
        <Panel
          v-for="(_element, index) in control.data"
          :key="`${control.path}-${control.data.length}-${index}`"
          :class="styles.arrayList.item"
          :header="childLabelForIndex(index) || `${index + 1}`"
          :toggleable="true"
          :collapsed="currentlyExpanded !== index"
          @toggle="currentlyExpanded = currentlyExpanded === index ? null : index"
        >
          <div :class="styles.arrayList.itemContent">
            <dispatch-renderer
              :schema="control.schema"
              :uischema="foundUISchema"
              :path="composePaths(control.path, `${index}`)"
              :enabled="control.enabled"
              :readonly="control.readonly"
              :renderers="control.renderers"
              :cells="control.cells"
            />
          </div>
          <template #icons>
            <Button
              v-if="appliedOptions.showSortButtons"
              icon="pi pi-arrow-up"
              text
              rounded
              size="small"
              :disabled="index <= 0 || !isControlEditable(control)"
              @click="moveUpClick($event, index)"
              v-tooltip="control.translations.up"
            />
            <Button
              v-if="appliedOptions.showSortButtons"
              icon="pi pi-arrow-down"
              text
              rounded
              size="small"
              :disabled="index >= dataLength - 1 || !isControlEditable(control)"
              @click="moveDownClick($event, index)"
              v-tooltip="control.translations.down"
            />
            <Button
              icon="pi pi-trash"
              text
              rounded
              size="small"
              severity="danger"
              :disabled="
                !isControlEditable(control) ||
                (appliedOptions.restrict &&
                  control.arraySchema !== undefined &&
                  control.arraySchema.minItems !== undefined &&
                  dataLength <= control.arraySchema.minItems)
              "
              @click="suggestToDelete = index"
              v-tooltip="control.translations.removeTooltip"
            />
          </template>
        </Panel>
      </div>
      <div v-if="dataLength === 0" :class="styles.arrayList.noData">
        {{ control.translations.noDataMessage }}
      </div>
      <Dialog v-model:visible="showDeleteDialog" header="Confirm Delete" modal>
        <p>{{ control.translations.deleteDialogMessage }}</p>
        <template #footer>
          <Button :label="control.translations.deleteDialogDecline" text @click="showDeleteDialog = false" />
          <Button :label="control.translations.deleteDialogAccept" @click="confirmDelete" />
        </template>
      </Dialog>
    </div>
  </Fluid>
</template>

<script lang="ts">
// @ts-nocheck
import {
  composePaths,
  createDefaultValue,
  findUISchema,
  type ControlElement,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  type RendererProps,
} from '@jsonforms/vue';
import { computed, defineComponent, ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel';
import Fluid from 'primevue/fluid';
import { isControlEditable, useNested, usePrimeVueArrayControl } from '../util';

const controlRenderer = defineComponent({
  name: 'array-layout-renderer',
  components: {
    DispatchRenderer,
    Button,
    Dialog,
    Panel,
    Fluid,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const control = usePrimeVueArrayControl(useJsonFormsArrayControl(props));
    const currentlyExpanded = ref<null | number>(
      control.appliedOptions.value.initCollapsed ? null : 0,
    );
    const suggestToDelete = ref<null | number>(null);
    const showDeleteDialog = computed(() => suggestToDelete.value !== null);
    useNested('array');

    return {
      ...control,
      currentlyExpanded,
      suggestToDelete,
      showDeleteDialog,
      isControlEditable,
    } as Record<string, any>;
  },
  computed: {
    addDisabled(): boolean {
      return (
        !this.isControlEditable(this.control) ||
        (this.appliedOptions.restrict &&
          this.control.arraySchema !== undefined &&
          this.control.arraySchema.maxItems !== undefined &&
          this.dataLength >= this.control.arraySchema.maxItems)
      );
    },
    dataLength(): number {
      return this.control.data ? this.control.data.length : 0;
    },
    foundUISchema(): UISchemaElement {
      return findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        undefined,
        this.control.uischema,
        this.control.rootSchema,
      );
    },
  },
  methods: {
    composePaths,
    createDefaultValue,
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema, this.control.rootSchema),
      )();
      if (!this.appliedOptions.collapseNewItems && this.control.data?.length) {
        this.currentlyExpanded = this.dataLength - 1;
      }
    },
    moveUpClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveUp?.(this.control.path, toMove)();
    },
    moveDownClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveDown?.(this.control.path, toMove)();
    },
    confirmDelete(): void {
      if (this.suggestToDelete !== null) {
        this.removeItems?.(this.control.path, [this.suggestToDelete])();
        this.suggestToDelete = null;
      }
    },
  },
}) as any;

export default controlRenderer;
</script>

<style scoped>
.array-list {
  display: flex;
  flex-direction: column;
  gap: var(--p-spacing-2, 0.5rem);
}

.array-list-title {
  display: flex;
  flex-direction: column;
  gap: var(--p-spacing-2, 0.5rem);
}

.array-list-toolbar {
  display: flex;
  gap: var(--p-spacing-2, 0.5rem);
  align-items: center;
}

.array-list-label {
  font-weight: 600;
  flex: 1;
}

.array-list-container {
  display: flex;
  flex-direction: column;
  gap: var(--p-spacing-2, 0.5rem);
}

.array-list-item {
  width: 100%;
}

.array-list-item-content {
  display: flex;
  flex-direction: column;
  gap: var(--p-spacing-2, 0.5rem);
}

.array-list-no-data {
  text-align: center;
  color: var(--p-text-color-secondary, #6b7280);
  padding: var(--p-spacing-3, 0.75rem);
}
</style>
