import {
  rankWith,
  schemaMatches,
  uiTypeIs,
  and,
  type TesterContext,
  type JsonFormsRendererRegistryEntry,
  type JsonSchema,
  type UISchemaElement,
} from '@jsonforms/core';
import controlRenderer from './ChipsControlRenderer.vue';

const isArrayOfStrings = (schema: JsonSchema): boolean => {
  return (
    schema.type === 'array' &&
    schema.items !== undefined &&
    typeof schema.items === 'object' &&
    'type' in schema.items &&
    schema.items.type === 'string'
  );
};

const isChipsControl = (
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext,
): boolean => {
  // Check if explicit chips option is set
  const chipsOption = (uischema as any)?.options?.chips;
  if (chipsOption === true) {
    return true;
  }
  // Explicitly disabled
  if (chipsOption === false) {
    return false;
  }

  // Check if schema is array of strings
  return schemaMatches(isArrayOfStrings)(uischema, schema, context);
};

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(5, and(uiTypeIs('Control'), isChipsControl)),
};
