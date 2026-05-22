/**
 * Custom Example Schemas for JSON Forms
 *
 * This file contains example schemas, UI schemas, and data for testing
 * and development purposes. Each example demonstrates specific features.
 */

/**
 * Example: Person Form
 *
 * Shows:
 * - HorizontalLayout with multiple fields in a row
 * - VerticalLayout for stacked fields
 * - Group (Fieldset) with legend
 * - ArrayLayout with items
 * - String, Number, Boolean, Enum, Date controls
 * - Required field validation
 */
export const personSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'birthDate'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      minLength: 2,
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      minLength: 2,
    },
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 0,
      maximum: 150,
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    birthDate: {
      type: 'string',
      format: 'date',
      title: 'Birth Date',
    },
    nationality: {
      type: 'string',
      enum: ['US', 'UK', 'DE', 'FR', 'JP', 'Other'],
      title: 'Nationality',
    },
    vegetarian: {
      type: 'boolean',
      title: 'Vegetarian',
    },
    hobbies: {
      type: 'array',
      title: 'Hobbies',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
          skillLevel: {
            type: 'string',
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            title: 'Skill Level',
          },
        },
      },
    },
  },
};

export const personUischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/firstName',
        },
        {
          type: 'Control',
          scope: '#/properties/lastName',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/age',
        },
        {
          type: 'Control',
          scope: '#/properties/birthDate',
        },
      ],
    },
    {
      type: 'Control',
      scope: '#/properties/email',
    },
    {
      type: 'Group',
      label: 'Preferences',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/nationality',
        },
        {
          type: 'Control',
          scope: '#/properties/vegetarian',
        },
      ],
    },
    {
      type: 'Control',
      scope: '#/properties/hobbies',
      options: {
        detail: {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/name',
            },
            {
              type: 'Control',
              scope: '#/properties/skillLevel',
            },
          ],
        },
      },
    },
  ],
};

export const personData = {
  firstName: 'Jane',
  lastName: 'Doe',
  age: 28,
  email: 'jane.doe@example.com',
  birthDate: '1996-05-20',
  nationality: 'US',
  vegetarian: true,
  hobbies: [
    { name: 'Reading', skillLevel: 'Expert' },
    { name: 'Hiking', skillLevel: 'Intermediate' },
  ],
};

/**
 * Example: Tags Schema with Chips Control
 *
 * Shows:
 * - Array of strings rendered as editable Chips
 * - Comma and Enter key to add tags
 * - Backspace to remove tags
 * - Whitespace trimming
 */
export const tagsSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title',
      description: 'A title for your collection',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      title: 'Tags',
      description: 'Add tags separated by comma or press Enter',
    },
    keywords: {
      type: 'array',
      items: {
        type: 'string',
      },
      title: 'Keywords',
      minItems: 1,
      maxItems: 5,
      description: 'Add up to 5 keywords',
    },
  },
};

export const tagsUischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/title',
    },
    {
      type: 'Control',
      scope: '#/properties/tags',
    },
    {
      type: 'Control',
      scope: '#/properties/keywords',
      options: { chips: true },
    },
  ],
};

export const tagsData = {
  title: 'My Awesome Project',
  tags: ['vue', 'forms', 'primevue'],
  keywords: ['json-schema', 'ui-generation'],
};

/**
 * Export all examples as an array
 * Each example must have:
 * - name: identifier for lookups (used by .find())
 * - label: display name in the UI
 * - schema: JSON Schema
 * - uischema: UI Schema
 * - data: Initial data (optional)
 */
export const customExamples = {
  person: {
    name: 'person',
    label: 'Person',
    schema: personSchema,
    uischema: personUischema,
    data: personData,
  },
  tags: {
    name: 'tags',
    label: 'Tags',
    schema: tagsSchema,
    uischema: tagsUischema,
    data: tagsData,
  },
};
