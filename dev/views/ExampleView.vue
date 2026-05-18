<script setup lang="ts">
import type { JsonFormsChangeEvent } from '@jsonforms/vue';
import type { ErrorObject } from 'ajv';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {
  markRaw,
  onMounted,
  provide,
  ref,
  shallowReactive,
  shallowRef,
  watch,
  type ShallowRef,
} from 'vue';
import type { ExampleDescription } from '../../../examples/lib';
import { defaultStyles, mergeStyles } from '../../src';
import ExampleForm from '../components/ExampleForm.vue';
import MonacoEditor from '../components/MonacoEditor.vue';
import {
  configureDataValidation,
  configureJsonSchemaValidation,
  configureUISchemaValidation,
  getMonacoModelForUri,
} from '../core/jsonSchemaValidation';
import type { MonacoApi } from '../core/monaco';
import examples from '../examples';
import { useAppStore } from '../store';
import { createAjv } from '../validate';

import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { getCustomRenderersForExample } from '../renderers';

import Card from 'primevue/card';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Tabs from 'primevue/tabs';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const { extendedPrimevueRenderers } = await import('../../src');

const props = defineProps<{
  example: ExampleDescription;
}>();

const appStore = useAppStore();
const toast = useToast();

const myStyles = mergeStyles(defaultStyles, {
  control: { root: 'my-control' },
});

provide('styles', myStyles);

const ajv = createAjv();
const errors = ref<
  ErrorObject<string, Record<string, any>, unknown>[] | undefined
>(undefined);

const schemaModel = shallowRef<monaco.editor.ITextModel | undefined>(undefined);
const uischemaModel = shallowRef<monaco.editor.ITextModel | undefined>(
  undefined,
);
const dataModel = shallowRef<monaco.editor.ITextModel | undefined>(undefined);

const initialState = (exampleProp: ExampleDescription) => {
  const example = cloneDeep(exampleProp);

  // Get custom renderers for this example (if any)
  const customRenderers = getCustomRenderersForExample(example.name);
  const renderers = markRaw([...customRenderers, ...extendedPrimevueRenderers]);

  return {
    data: example.data,
    schema: example.schema,
    uischema: example.uischema,
    renderers: renderers,
    cells: undefined, // not defined
    config: appStore.jsonforms.config,
    readonly: appStore.jsonforms.readonly,
    uischemas: example.uischemas,
    validationMode: appStore.jsonforms.validationMode,
    ajv: ajv,
    i18n: exampleProp.i18n ?? {
      locale: appStore.jsonforms.locale,
    },
    additionalErrors: undefined,
    middleware: undefined,
  };
};
const state = shallowReactive(initialState(props.example));

const onChange = (event: JsonFormsChangeEvent): void => {
  if (props.example.name) {
    dataModel.value = getMonacoModelForUri(
      monaco.Uri.parse(toDataUri(props.example.name)),
      event.data !== undefined ? JSON.stringify(event.data, null, 2) : '',
    );
    state.data = event.data;
  }
  errors.value = event.errors;
};

const reloadMonacoSchema = () => {
  const example = find(
    examples,
    (example) => example.name === appStore.exampleName,
  );

  if (example) {
    schemaModel.value = getMonacoModelForUri(
      monaco.Uri.parse(toSchemaUri(example.name)),
      example.schema ? JSON.stringify(example.schema, null, 2) : '',
    );
    toastMessage('Original example schema loaded. Apply it to take effect.');
  }
};

const saveMonacoSchema = () => {
  saveMonacoModel(
    schemaModel,
    (modelValue) =>
      (state.schema = modelValue ? JSON.parse(modelValue) : undefined),
    'New schema applied',
  );

  if (state.schema) {
    configureDataValidation(
      monaco,
      `inmemory://${toSchemaUri(props.example.name)}`,
      toDataUri(props.example.name),
      cloneDeep(state.schema),
    );
  }
};

const reloadMonacoUiSchema = () => {
  const example = find(
    examples,
    (example) => example.name === appStore.exampleName,
  );

  if (example) {
    uischemaModel.value = getMonacoModelForUri(
      monaco.Uri.parse(toUiSchemaUri(example.name)),
      example.uischema ? JSON.stringify(example.uischema, null, 2) : '',
    );
    toastMessage('Original example UI schema loaded. Apply it to take effect.');
  }
};

const saveMonacoUiSchema = () => {
  saveMonacoModel(
    uischemaModel,
    (modelValue) =>
      (state.uischema = modelValue ? JSON.parse(modelValue) : undefined),
    'New UI schema applied',
  );
};

const reloadMonacoData = () => {
  const example = find(
    examples,
    (example) => example.name === appStore.exampleName,
  );

  if (example) {
    dataModel.value = getMonacoModelForUri(
      monaco.Uri.parse(toDataUri(example.name)),
      example.data !== undefined ? JSON.stringify(example.data, null, 2) : '',
    );
    toastMessage('Original example data loaded. Apply it to take effect.');
  }
};

const saveMonacoData = () => {
  saveMonacoModel(
    dataModel,
    (modelValue) => {
      state.data = modelValue === '' ? undefined : JSON.parse(modelValue);
    },
    'New data applied',
  );
};

const saveMonacoModel = (
  model: ShallowRef<monaco.editor.ITextModel | undefined>,
  apply: (value: string) => void,
  successToast: string,
) => {
  if (model.value) {
    const modelValue = model.value.getValue();

    try {
      apply(modelValue);
      toastMessage(successToast);
    } catch (error) {
      toastMessage(`Error: ${error}`);
    }
  }
};

const registerValidations = (editor: MonacoApi) => {
  configureJsonSchemaValidation(editor, ['*.schema.json']);
  configureUISchemaValidation(editor, ['*.uischema.json']);
  for (const example of examples) {
    const schema = {
      ...example.schema,
      title: example.label,
    };

    if (example && example.schema) {
      configureDataValidation(
        editor,
        `inmemory://${toSchemaUri(example.name)}`,
        toDataUri(example.name),
        schema,
      );
    }
  }
};

const updateMonacoModels = (example: ExampleDescription) => {
  schemaModel.value = getMonacoModelForUri(
    monaco.Uri.parse(toSchemaUri(example.name)),
    example.schema ? JSON.stringify(example.schema, null, 2) : '',
  );

  uischemaModel.value = getMonacoModelForUri(
    monaco.Uri.parse(toUiSchemaUri(example.name)),
    example.uischema ? JSON.stringify(example.uischema, null, 2) : '',
  );

  dataModel.value = getMonacoModelForUri(
    monaco.Uri.parse(toDataUri(example.name)),
    example.data !== undefined ? JSON.stringify(example.data, null, 2) : '',
  );
};

const toSchemaUri = (id: string): string => {
  return `${id}.schema.json`;
};
const toUiSchemaUri = (id: string): string => {
  return `${id}.uischema.json`;
};
const toDataUri = (id: string): string => {
  return `${id}.data.json`;
};
const toI18NUri = (id: string): string => {
  return `${id}.i18n.json`;
};
const toastMessage = (message: string): void => {
  toast.add({ severity: 'info', summary: 'Success', detail: message, life: 3000 });
};

onMounted(() => {
  updateMonacoModels(props.example);
});

watch(
  () => props.example,
  (value) => {
    updateMonacoModels(props.example);
    // reset state when example changes
    Object.assign(state, initialState(value));
  },
);

watch(
  () => appStore.formOnly,
  (value) => {
    if (!value) {
      // we need to show the wrapper so make sure that the monaco models are updated
      updateMonacoModels(props.example);
    }
  },
);

type Action = NonNullable<ExampleDescription['actions']>[number];

const handleAction = (action: Action) => {
  if (action) {
    const newState = action.apply(state);
    if (newState) {
      if (newState.renderers) {
        newState.renderers = markRaw(newState.renderers);
      }

      Object.assign(state, newState);
    }
  }
};
</script>

<template>
  <div>
    <Toast position="top-right" />
    <div class="demo-container" v-if="!appStore.formOnly">
      <Card>
        <template #header>
          <div class="card-header">
            <h3>{{ example.label }}</h3>
          </div>
        </template>
        <template #content>
          <Tabs :value="appStore.activeTab" @update:value="appStore.activeTab = $event">
            <TabList>
              <Tab :value="0">{{ appStore.layout == 'demo-and-data' ? 'Demo and Data' : 'Demo' }}</Tab>
              <Tab :value="1">Schema</Tab>
              <Tab :value="2">UI Schema</Tab>
              <Tab v-if="appStore.layout !== 'demo-and-data'" :value="3">Data</Tab>
            </TabList>
            <TabPanels>
              <TabPanel :value="0">
                <div class="demo-tab-header">
                  <h4 class="toolbar-title">JSONForm</h4>
                  <div style="flex: 1"></div>
                  <Button 
                    v-for="(action, index) in example.actions"
                    :key="index"
                    :label="action.label"
                    @click="() => handleAction(action)"
                    text
                    size="small"
                  />
                </div>
                <hr class="divider">
                <div class="json-forms">
                  <splitpanes
                    :class="['default-theme', 'splitpanes-primevue']"
                    :rtl="appStore.rtl"
                    v-if="appStore.layout === 'demo-and-data'"
                  >
                    <pane min-size="20">
                      <Card>
                        <template #header>
                          <div class="toolbar">
                            <h4 class="toolbar-title">Demo</h4>
                          </div>
                        </template>
                        <template #content>
                          <example-form :state="state" @jsfchange="onChange" />
                        </template>
                      </Card>
                    </pane>
                    <pane>
                      <Card>
                        <template #header>
                          <div class="toolbar">
                            <h4 class="toolbar-title">Data</h4>
                            <div style="flex: 1"></div>
                            <Button
                              icon="pi pi-refresh"
                              text
                              rounded
                              v-tooltip="'Reload Example Data'"
                              @click="reloadMonacoData"
                            />
                            <Button
                              icon="pi pi-save"
                              text
                              rounded
                              v-tooltip="'Apply Change To Example Data'"
                              @click="saveMonacoData"
                            />
                          </div>
                        </template>
                        <template #content>
                          <monaco-editor
                            language="json"
                            v-model="dataModel"
                            style="height: calc(100vh - 200px)"
                            :editorBeforeMount="registerValidations"
                          ></monaco-editor>
                        </template>
                      </Card>
                    </pane>
                  </splitpanes>

                  <example-form :state="state" @jsfchange="onChange" v-else />
                </div>
              </TabPanel>
              <TabPanel :value="1">
                <Card>
                  <template #header>
                    <div class="toolbar">
                      <h4 class="toolbar-title">Schema</h4>
                      <div style="flex: 1"></div>
                      <Button
                        icon="pi pi-refresh"
                        text
                        rounded
                        v-tooltip="'Reload Example Schema'"
                        @click="reloadMonacoSchema"
                      />
                      <Button
                        icon="pi pi-save"
                        text
                        rounded
                        v-tooltip="'Apply Change To Example Schema'"
                        @click="saveMonacoSchema"
                      />
                    </div>
                  </template>
                  <template #content>
                    <monaco-editor
                      language="json"
                      v-model="schemaModel"
                      style="height: calc(100vh - 100px)"
                      :editorBeforeMount="registerValidations"
                    ></monaco-editor>
                  </template>
                </Card>
              </TabPanel>
              <TabPanel :value="2">
                <Card>
                  <template #header>
                    <div class="toolbar">
                      <h4 class="toolbar-title">UI Schema</h4>
                      <div style="flex: 1"></div>
                      <Button
                        icon="pi pi-refresh"
                        text
                        rounded
                        v-tooltip="'Reload Example UI Schema'"
                        @click="reloadMonacoUiSchema"
                      />
                      <Button
                        icon="pi pi-save"
                        text
                        rounded
                        v-tooltip="'Apply Change To Example UI Schema'"
                        @click="saveMonacoUiSchema"
                      />
                    </div>
                  </template>
                  <template #content>
                    <monaco-editor
                      language="json"
                      v-model="uischemaModel"
                      style="height: calc(100vh - 100px)"
                      :editorBeforeMount="registerValidations"
                    ></monaco-editor>
                  </template>
                </Card>
              </TabPanel>
              <TabPanel v-if="appStore.layout !== 'demo-and-data'" :value="3">
                <Card>
                  <template #header>
                    <div class="toolbar">
                      <h4 class="toolbar-title">Data</h4>
                      <div style="flex: 1"></div>
                      <Button
                        icon="pi pi-refresh"
                        text
                        rounded
                        v-tooltip="'Reload Example Data'"
                        @click="reloadMonacoData"
                      />
                      <Button
                        icon="pi pi-save"
                        text
                        rounded
                        v-tooltip="'Apply Change To Example Data'"
                        @click="saveMonacoData"
                      />
                    </div>
                  </template>
                  <template #content>
                    <monaco-editor
                      language="json"
                      v-model="dataModel"
                      style="height: calc(100vh - 100px)"
                      :editorBeforeMount="registerValidations"
                    ></monaco-editor>
                  </template>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </template>
      </Card>
    </div>
    <div class="json-forms" v-else>
      <example-form :state="state" @jsfchange="onChange" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
  margin: -1rem -1rem 0 -1rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  width: 100%;
}

.toolbar-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.demo-tab-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--surface-border);
  margin-bottom: 1rem;
}

.divider {
  border: none;
  border-top: 1px solid var(--surface-border);
  margin: 1rem 0;
}

.json-forms {
  padding: 1rem 0;
}

:deep(.default-theme) {
  &.splitpanes--vertical > .splitpanes__splitter,
  .splitpanes--vertical > .splitpanes__splitter {
    border-left: 1px solid var(--surface-border);
  }

  &.splitpanes--horizontal > .splitpanes__splitter,
  .splitpanes--horizontal > .splitpanes__splitter {
    border-top: 1px solid var(--surface-border);
  }

  .splitpanes__splitter {
    background-color: var(--surface-color);
    &:before,
    &:after {
      background-color: var(--surface-border);
    }
    &:hover:before,
    &:hover:after {
      background-color: var(--surface-border);
    }
  }
}

:deep(.p-tabs) {
  margin-top: 1rem;
}

:deep(.p-tabpanel) {
  padding: 0;
}
</style>
