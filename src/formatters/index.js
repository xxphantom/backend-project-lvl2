import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = { stylish, plain, json };
const getFormatter = (format) => formatters[format];

export default getFormatter;
