<template>
  <div v-if="layout.visible" :class="styles.categorization.root">
    <Tabs
      v-model:value="activeCategory"
      :orientation="appliedOptions.vertical ? 'vertical' : 'horizontal'"
    >
      <TabList>
        <Tab
          v-for="(_, index) in visibleCategories"
          :key="`${layout.path}-${visibleCategories.length}-${index}`"
          :value="index"
        >
          {{ visibleCategoryLabels[index] }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel
          v-for="(element, index) in visibleCategories"
          :key="`${layout.path}-${visibleCategories.length}-${index}`"
          :value="index"
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
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
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
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import { usePrimeVueLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'categorization-renderer',
  components: {
    DispatchRenderer,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const activeCategory = ref(0);
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
