import stylish from './stylish.js';
import plain from './plain.js';

const formatters = { stylish, plain, json: JSON.stringify };
const getFormatter = (format) => formatters[format];

export default getFormatter;
