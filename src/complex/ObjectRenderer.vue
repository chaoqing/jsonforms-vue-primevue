<template>
  <div v-if="control.visible">
    <dispatch-renderer
      :visible="control.visible"
      :enabled="control.enabled"
      :readonly="control.readonly"
      :schema="control.schema"
      :uischema="detailUiSchema"
      :path="control.path"
      :renderers="control.renderers"
      :cells="control.cells"
    />
    <additional-properties
      v-if="hasAdditionalProperties"
      :input="input"
    />
  </div>
</template>

<script lang="ts">
import {
  Generate,
  findUISchema,
  type ControlElement,
  type GroupLayout,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsControlWithDetail,
  type RendererProps,
} from '@jsonforms/vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { computed, defineComponent, provide } from 'vue';
import { useNested, usePrimeVueControl } from '../util';
import { IsDynamicPropertyContext } from '../util';
import AdditionalProperties from './components/AdditionalProperties.vue';

const controlRenderer = defineComponent({
  name: 'object-renderer',
  components: {
    DispatchRenderer,
    AdditionalProperties,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsControlWithDetail(props);
    const control = usePrimeVueControl(input);
    const nested = useNested('object');

    const hasAdditionalProperties = computed(() => {
      const schema = control.control.value.schema;
      return !!(
        schema.patternProperties ||
        typeof schema.additionalProperties === 'object' ||
        schema.additionalProperties === true
      );
    });

    const showAdditionalProperties = computed(() => {
      if (hasAdditionalProperties.value) {
        return true;
      }
      // TODO: check appliedOptions.allowAdditionalPropertiesIfMissing
      return false;
    });

    provide(IsDynamicPropertyContext, true);

    return {
      ...control,
      nested,
      input,
      hasAdditionalProperties,
      showAdditionalProperties,
    };
  },
  computed: {
    detailUiSchema(): UISchemaElement {
      const uiSchemaGenerator = () => {
        const uiSchema = Generate.uiSchema(
          this.control.schema,
          'Group',
          undefined,
          this.control.rootSchema,
        );
        if (isEmpty(this.control.path)) {
          uiSchema.type = 'VerticalLayout';
        } else {
          (uiSchema as GroupLayout).label = this.control.label;
        }
        return uiSchema;
      };

      let result = findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        uiSchemaGenerator,
        this.control.uischema,
        this.control.rootSchema,
      );

      if (this.nested.level > 0) {
        result = cloneDeep(result);
        result.options = {
          ...result.options,
          bare: true,
          alignLeft:
            this.nested.level >= 4 || this.nested.parentElement === 'array',
        };
      }

      return result;
    },
  },
});

export default controlRenderer;
</script>
