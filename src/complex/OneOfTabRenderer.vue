<template>
  <div v-if="control.visible">
    <combinator-properties
      :schema="control.schema"
      combinatorKeyword="oneOf"
      :path="control.path"
      :rootSchema="control.rootSchema"
    />

    <Tabs v-model:value="selectIndex" @update:value="handleTabChange" :disabled="!isControlEditable(control)">
      <TabList>
        <Tab
          v-for="(oneOfRenderInfo, oneOfIndex) in oneOfRenderInfos"
          :key="`${control.path}-${oneOfRenderInfos.length}-${oneOfIndex}`"
          :value="oneOfIndex"
        >
          {{ oneOfRenderInfo.label }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel
          v-for="(oneOfRenderInfo, oneOfIndex) in oneOfRenderInfos"
          :key="`${control.path}-${oneOfRenderInfos.length}-${oneOfIndex}`"
          :value="oneOfIndex"
        >
          <dispatch-renderer
            v-if="selectedIndex === oneOfIndex"
            :schema="oneOfRenderInfo.schema"
            :uischema="oneOfRenderInfo.uischema"
            :path="control.path"
            :renderers="control.renderers"
            :cells="control.cells"
            :enabled="control.enabled"
            :readonly="control.readonly"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog v-model:visible="dialog" modal :closable="false">
      <template #header>
        <span class="text-xl">{{ control.translations.clearDialogTitle }}</span>
      </template>
      <p>{{ control.translations.clearDialogMessage }}</p>
      <template #footer>
        <Button :label="control.translations.clearDialogDecline" text @click="cancel" />
        <Button :label="control.translations.clearDialogAccept" @click="confirm" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import {
  type CombinatorSubSchemaRenderInfo,
  type ControlElement,
  createCombinatorRenderInfos,
  createDefaultValue,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  type RendererProps,
  useJsonFormsOneOfControl,
} from '@jsonforms/vue';
import { defineComponent, ref } from 'vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { isControlEditable, useCombinatorTranslations, usePrimeVueControl } from '../util';
import { default as CombinatorProperties } from './components/CombinatorProperties.vue';

const controlRenderer = defineComponent({
  name: 'one-of-tab-renderer',
  components: {
    DispatchRenderer,
    CombinatorProperties,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Dialog,
    Button,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsOneOfControl(props);
    const control = input.control.value;

    const selectedIndex = ref(control.indexOfFittingSchema || 0);
    const selectIndex = ref(selectedIndex.value);
    const newSelectedIndex = ref(0);
    const dialog = ref(false);

    return {
      ...useCombinatorTranslations(usePrimeVueControl(input)),
      isControlEditable,
      selectedIndex,
      selectIndex,
      dialog,
      newSelectedIndex,
    };
  },
  computed: {
    oneOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
      const result = createCombinatorRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control.schema.oneOf!,
        this.control.rootSchema,
        'oneOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas,
      );
      return result.filter((info) => info.uischema);
    },
  },
  methods: {
    handleTabChange(): void {
      this.newSelectedIndex = this.selectIndex;
      // revert back to the original value until the dialog is done
      this.selectIndex = this.selectedIndex;

      if (this.control.data === undefined) {
        this.openNewTab(this.newSelectedIndex);
      } else {
        this.dialog = true;
      }
    },
    confirm(): void {
      this.openNewTab(this.newSelectedIndex);
      this.dialog = false;
    },
    cancel(): void {
      this.dialog = false;
    },
    openNewTab(newIndex: number): void {
      this.handleChange(
        this.control.path,
        createDefaultValue(
          this.oneOfRenderInfos[newIndex].schema,
          this.control.rootSchema,
        ),
      );
      this.selectIndex = newIndex;
      this.selectedIndex = newIndex;
    },
  },
});

export default controlRenderer;
</script>
