<template>
  <Fieldset
    v-if="layout.visible"
    :legend="layout.label"
    :class="classes"
    v-bind="primeVueProps('Fieldset')"
  >
    <div
      v-for="(element, index) in (layout.uischema as Layout).elements"
      :key="`${layout.path}-${(layout.uischema as Layout).elements.length}-${index}`"
      :class="styles.group.item"
    >
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
  </Fieldset>
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
import Fieldset from 'primevue/fieldset';
import { usePrimeVueLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'group-renderer',
  components: {
    DispatchRenderer,
    Fieldset,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return usePrimeVueLayout(useJsonFormsLayout(props)) as Record<string, any>;
  },
  computed: {
    bare(): boolean {
      return !!this.appliedOptions.bare;
    },
    classes(): string {
      const classes = [`${this.styles.group.root}`];
      if (this.bare) {
        classes.push(`${this.styles.group.bare}`);
      }
      return classes.join(' ');
    },
  },
}) as any;

export default layoutRenderer;
</script>
