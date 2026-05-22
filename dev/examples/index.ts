import { getExamples } from '@jsonforms/examples';
import { customExamples } from './schemas.js';

const builtInExamples = getExamples();

// Convert customExamples object to array format
const customExamplesArray = Object.values(customExamples);

// Merge built-in examples array with custom examples
const examples = [...builtInExamples, ...customExamplesArray];

export default examples;
