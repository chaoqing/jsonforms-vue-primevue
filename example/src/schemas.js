/**
 * Example Person Schema
 *
 * Shows:
 * - HorizontalLayout with multiple fields in a row
 * - VerticalLayout for stacked fields
 * - Group (Fieldset) with legend
 * - ArrayLayout with items
 * - String, Number, Boolean, Enum, Date controls
 * - Required field validation
 */

// Schema (JSON Schema)
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

// UI Schema (layout)
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

// Initial data
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
