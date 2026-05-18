<template>
  <div v-if="control.visible">
    <CombinatorProperties
      :schema="control.schema"
      combinatorKeyword="anyOf"
      :path="path"
      :rootSchema="control.rootSchema"
    />

    <Tabs :value="selectedIndex" @update:value="onTabChange">
      <TabList>
        <Tab
          v-for="(anyOfRenderInfo, anyOfIndex) in anyOfRenderInfos"
          :key="`${control.path}-${anyOfRenderInfos.length}-${anyOfIndex}-tab`"
          :value="anyOfIndex"
        >
          {{ anyOfRenderInfo.label }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel
          v-for="(anyOfRenderInfo, anyOfIndex) in anyOfRenderInfos"
          :key="`${control.path}-${anyOfRenderInfos.length}-${anyOfIndex}-panel`"
          :value="anyOfIndex"
        >
          <DispatchRenderer
            :schema="anyOfRenderInfo.schema"
            :uischema="anyOfRenderInfo.uischema"
            :path="control.path"
            :renderers="control.renderers"
            :cells="control.cells"
            :enabled="control.enabled"
            :readonly="control.readonly"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script lang="ts">
import {
  type CombinatorSubSchemaRenderInfo,
  type ControlElement,
  createCombinatorRenderInfos,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  type RendererProps,
  useJsonFormsAnyOfControl,
} from '@jsonforms/vue';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Tabs from 'primevue/tabs';
import { defineComponent, ref } from 'vue';
import { usePrimeVueControl } from '../util';
import { CombinatorProperties } from './components';

const controlRenderer = defineComponent({
  name: 'any-of-renderer',
  components: {
    DispatchRenderer,
    CombinatorProperties,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsAnyOfControl(props);
    const control = input.control.value;
    const selectedIndex = ref(control.indexOfFittingSchema || 0);

    const onTabChange = (value: string | number) => {
      selectedIndex.value = typeof value === 'string' ? parseInt(value, 10) : value;
    };

    return {
      ...usePrimeVueControl(input),
      selectedIndex,
      onTabChange,
    };
  },
  computed: {
    anyOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
      const result = createCombinatorRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control.schema.anyOf!,
        this.control.rootSchema,
        'anyOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas,
      );
      return result.filter((info) => info.uischema);
    },
  },
});

export default controlRenderer;
</script>
