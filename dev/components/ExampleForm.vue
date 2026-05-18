<script setup lang="ts">
import type {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsI18nState,
  JsonFormsRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  Middleware,
  UISchemaElement,
  ValidationMode,
} from '@jsonforms/core';
import {
  JsonForms,
  type JsonFormsChangeEvent,
  type MaybeReadonly,
} from '@jsonforms/vue';
import type { Ajv, ErrorObject } from 'ajv';
import * as JsonRefs from 'json-refs';
import { computed, onMounted, shallowReactive, watch } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

export type ResolvedSchema = {
  schema?: JsonSchema;
  resolved: boolean;
  error?: string;
};

export interface JsonFormsProps {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  renderers: MaybeReadonly<JsonFormsRendererRegistryEntry[]>;
  cells?: MaybeReadonly<JsonFormsCellRendererRegistryEntry[]>;
  config?: any;
  readonly?: boolean;
  uischemas?: MaybeReadonly<JsonFormsUISchemaRegistryEntry[]>;
  validationMode?: ValidationMode;
  ajv?: Ajv;
  i18n?: JsonFormsI18nState;
  additionalErrors?: ErrorObject<string, Record<string, any>, unknown>[];
  middleware?: Middleware;
}

const props = defineProps<{
  state: JsonFormsProps;
}>();

const resolvedSchema = shallowReactive<ResolvedSchema>({
  schema: undefined,
  resolved: false,
  error: undefined,
});

const emits = defineEmits(['jsfchange']);

const onChange = (event: JsonFormsChangeEvent): void => {
  emits('jsfchange', event);
};

watch(
  () => props.state.schema,
  (schema) => {
    resolveSchema(schema);
  },
);

const resolveSchema = (schema?: JsonSchema): void => {
  resolvedSchema.schema = undefined;
  resolvedSchema.resolved = false;
  resolvedSchema.error = undefined;

  if (schema) {
    JsonRefs.resolveRefs(schema).then(
      function (res) {
        resolvedSchema.schema = res.resolved;
        resolvedSchema.resolved = true;
      },
      function (err: Error) {
        resolvedSchema.resolved = true;
        resolvedSchema.error = err.message;
      },
    );
  } else {
    // nothing to resolve
    resolvedSchema.resolved = true;
  }
};

onMounted(() => {
  resolveSchema(props.state.schema);
});

const properties = computed<JsonFormsProps>(() => ({
  ...props.state,
  schema: resolvedSchema.schema ?? props.state.schema,
}));
</script>

<style scoped>
.loading-error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.loading-text {
  font-size: 1.1rem;
  color: var(--text-color);
  margin: 0;
}

.error-content {
  width: 100%;
  max-width: 500px;
}
</style>

<template>
  <div>
    <json-forms
      v-if="resolvedSchema.resolved && resolvedSchema.error === undefined"
      v-bind="properties"
      @change="onChange"
    ></json-forms>
    <div v-else class="loading-error-container">
      <div
        v-if="!resolvedSchema.resolved"
        class="loading-content"
      >
        <p class="loading-text">Resolving Schema Refs</p>
        <ProgressSpinner></ProgressSpinner>
      </div>
      <div
        v-else-if="resolvedSchema.error !== undefined"
        class="error-content"
      >
        <Message severity="error" :text="resolvedSchema.error" />
      </div>
    </div>
  </div>
</template>
