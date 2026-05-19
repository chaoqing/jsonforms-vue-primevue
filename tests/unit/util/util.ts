import type {
  JsonFormsI18nState,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import { mount } from '@vue/test-utils';
import TestComponent from './TestComponent.vue';
import { markRaw } from 'vue';

export const mountJsonForms = (
  data: any,
  schema: JsonSchema,
  renderers: JsonFormsRendererRegistryEntry[],
  uischema?: UISchemaElement,
  config?: any,
  i18n?: JsonFormsI18nState,
) => {
  return mount(TestComponent, {
    propsData: {
      data: data,
      schema,
      uischema,
      config,
      renderers: markRaw(renderers),
      i18n,
    },
    attachTo: document.body,
  });
};
