<template>
  <Fluid
    v-if="layout.visible && (layout.uischema as Layout).elements.length > 0"
  >
    <div :class="styles.verticalLayout.root">
      <div
        v-for="(element, index) in (layout.uischema as Layout).elements"
        :key="`${layout.path}-${(layout.uischema as Layout).elements.length}-${index}`"
      >
        <div :class="styles.verticalLayout.item">
          <dispatch-renderer
            :schema="layout.schema"
            :uischema="element"
            :path="layout.path"
            :enabled="layout.enabled"
            :readonly="layout.readonly"
            :renderers="layout.renderers"
            :cells="layout.cells"
          />
        </div>
      </div>
    </div>
  </Fluid>
</template>

<script lang="ts">
// @ts-nocheck
import { type Layout } from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { usePrimeVueLayout } from '../util';
import Fluid from 'primevue/fluid';

const layoutRenderer = defineComponent({
  name: 'vertical-layout-renderer',
  components: {
    DispatchRenderer,
    Fluid,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return usePrimeVueLayout(useJsonFormsLayout(props)) as Record<string, any>;
  },
}) as any;

export default layoutRenderer;
</script>

<style scoped>
.vertical-layout {
  display: flex;
  flex-direction: column;
  gap: var(--p-spacing-2, 0.5rem);
}

.vertical-layout-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
