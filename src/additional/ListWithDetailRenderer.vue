<template>
  <div v-if="control.visible" class="flex flex-col gap-2">
    <div class="flex align-items-center justify-content-between mb-2">
      <span class="text-lg font-semibold">{{ computedLabel }}</span>
      <Button
        icon="pi pi-plus"
        text
        rounded
        :aria-label="control.translations.addAriaLabel"
        @click="addButtonClick"
        :disabled="
          !isControlEditable(control) ||
          (appliedOptions.restrict &&
            control.arraySchema !== undefined &&
            control.arraySchema.maxItems !== undefined &&
            dataLength >= control.arraySchema.maxItems)
        "
        v-tooltip="control.translations.addTooltip"
      />
    </div>
    
    <div v-if="dataLength === 0" class="text-center p-4 text-gray-500">
      {{ control.translations.noDataMessage }}
    </div>
    
    <div v-else class="flex gap-3" style="min-height: 300px;">
      <!-- List -->
      <div class="flex-shrink-0" style="width: 250px;">
        <div
          v-for="(item, index) in control.data"
          :key="`${control.path}-${index}`"
          class="flex align-items-center gap-2 p-2 cursor-pointer hover:surface-200"
          :class="{ 'bg-primary text-white': selectedIndex === index }"
          @click="selectedIndex = index"
        >
          <Avatar
            :label="`${index + 1}`"
            :class="selectedIndex === index ? 'bg-white text-primary' : 'bg-gray-200 text-gray-700'"
            shape="circle"
          />
          <span class="flex-grow-1 text-sm">Item {{ index + 1 }}</span>
          <div class="flex gap-1">
            <Button
              v-if="appliedOptions.showSortButtons"
              icon="pi pi-arrow-up"
              text
              rounded
              severity="secondary"
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
              severity="secondary"
              size="small"
              :disabled="index >= dataLength - 1 || !isControlEditable(control)"
              @click="moveDownClick($event, index)"
              v-tooltip="control.translations.down"
            />
            <Button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              size="small"
              @click="removeItemsClick($event, [index])"
              :disabled="
                !isControlEditable(control) ||
                (appliedOptions.restrict &&
                  control.arraySchema !== undefined &&
                  control.arraySchema.minItems !== undefined &&
                  dataLength <= control.arraySchema.minItems)
              "
              v-tooltip="control.translations.removeTooltip"
            />
          </div>
        </div>
      </div>
      
      <!-- Detail -->
      <div
        v-if="selectedIndex !== undefined && selectedIndex !== null"
        class="flex-grow-1"
      >
        <dispatch-renderer
          :schema="control.schema"
          :uischema="foundUISchema"
          :path="composePaths(control.path, `${selectedIndex}`)"
          :enabled="control.enabled"
          :readonly="control.readonly"
          :renderers="control.renderers"
          :cells="control.cells"
        />
      </div>
      <div v-else class="flex-grow-1 flex align-items-center justify-content-center">
        <span class="text-gray-500">{{ control.translations.noSelection }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
import { computed, defineComponent, ref, watch } from 'vue';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import { isControlEditable, usePrimeVueArrayControl } from '../util';

const controlRenderer = defineComponent({
  name: 'list-with-detail-renderer',
  components: {
    DispatchRenderer,
    Avatar,
    Button,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = usePrimeVueArrayControl(useJsonFormsArrayControl(props));
    
    const selectedIndex = ref<number | undefined>(undefined);
    
    // Watch data length to ensure selectedIndex is valid
    watch(
      () => input.control.value.data?.length ?? 0,
      (newLength) => {
        if (newLength === 0) {
          selectedIndex.value = undefined;
        } else if (selectedIndex.value === undefined || selectedIndex.value >= newLength) {
          selectedIndex.value = 0;
        }
      },
      { immediate: true }
    );
    
    return {
      ...input,
      selectedIndex,
      isControlEditable,
      composePaths,
      createDefaultValue,
    };
  },
  computed: {
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
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema, this.control.rootSchema),
      )();
    },
    moveUpClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveUp?.(this.control.path, toMove)();
    },
    moveDownClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveDown?.(this.control.path, toMove)();
    },
    removeItemsClick(event: Event, toDelete: number[]): void {
      event.stopPropagation();
      this.removeItems?.(this.control.path, toDelete)();
    },
  },
});

export default controlRenderer;
</script>
