<template>
  <Fluid v-if="layout.visible">
    <div :class="styles.categorization.root">
      <Stepper v-model:value="activeCategory" :linear="appliedOptions.linear">
        <!-- Horizontal layout -->
        <template v-if="!appliedOptions.vertical">
          <StepList>
            <Step
              v-for="(element, index) in visibleCategories"
              :key="`step-${index}`"
              :value="index + 1"
            >
              {{ visibleCategoryLabels[index] }}
            </Step>
          </StepList>
          <StepPanels>
            <StepPanel
              v-for="(element, index) in visibleCategories"
              :key="`panel-${index}`"
              :value="index + 1"
              v-slot="{ activateCallback }"
            >
              <dispatch-renderer
                :schema="layout.schema"
                :uischema="element.value.uischema"
                :path="layout.path"
                :enabled="layout.enabled"
                :readonly="layout.readonly"
                :renderers="layout.renderers"
                :cells="layout.cells"
              />
              <div v-if="appliedOptions.showNavButtons" class="flex justify-content-between mt-4">
                <Button
                  label="Previous"
                  icon="pi pi-chevron-left"
                  :disabled="activeCategory <= 1"
                  @click="activateCallback(activeCategory - 1)"
                />
                <Button
                  label="Next"
                  icon="pi pi-chevron-right"
                  iconPos="right"
                  :disabled="activeCategory >= visibleCategories.length"
                  @click="activateCallback(activeCategory + 1)"
                />
              </div>
            </StepPanel>
          </StepPanels>
        </template>

        <!-- Vertical layout -->
        <template v-else>
          <StepItem
            v-for="(element, index) in visibleCategories"
            :key="`step-item-${index}`"
            :value="index + 1"
          >
            <Step>{{ visibleCategoryLabels[index] }}</Step>
            <StepPanel v-slot="{ activateCallback }">
              <dispatch-renderer
                :schema="layout.schema"
                :uischema="element.value.uischema"
                :path="layout.path"
                :enabled="layout.enabled"
                :readonly="layout.readonly"
                :renderers="layout.renderers"
                :cells="layout.cells"
              />
              <div v-if="appliedOptions.showNavButtons" class="flex justify-content-between mt-4">
                <Button
                  label="Previous"
                  icon="pi pi-chevron-left"
                  :disabled="activeCategory <= 1"
                  @click="activateCallback(activeCategory - 1)"
                />
                <Button
                  label="Next"
                  icon="pi pi-chevron-right"
                  iconPos="right"
                  :disabled="activeCategory >= visibleCategories.length"
                  @click="activateCallback(activeCategory + 1)"
                />
              </div>
            </StepPanel>
          </StepItem>
        </template>
      </Stepper>
    </div>
  </Fluid>
</template>

<script lang="ts">
// @ts-nocheck
import { type Layout } from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsCategorization,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent, ref, computed } from 'vue';
import Button from 'primevue/button';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Fluid from 'primevue/fluid';
import { usePrimeVueLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'categorization-stepper-renderer',
  components: {
    DispatchRenderer,
    Button,
    Stepper,
    StepList,
    StepPanels,
    StepItem,
    Step,
    StepPanel,
    Fluid,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const activeCategory = ref(1);
    
    return {
      ...usePrimeVueLayout(useJsonFormsCategorization(props)),
      activeCategory,
    } as Record<string, any>;
  },
  computed: {
    visibleCategories() {
      return this.categories.filter((category) => category.value.visible);
    },
    visibleCategoryLabels(): string[] {
      return this.visibleCategories.map((element) => {
        return element.value.label;
      });
    },
  },
}) as any;

export default layoutRenderer;
</script>

<style scoped>
.categorization {
  display: flex;
  flex-direction: column;
  gap: var(--p-spacing-2, 0.5rem);
}
</style>
