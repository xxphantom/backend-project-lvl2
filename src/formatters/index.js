import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const getFormatter = (format) => {
  const formatters = {
    stylish: (astTree) => stylish(astTree),
    plain: (astTree) => plain(astTree),
    json: (astTree) => json(astTree),
  };
  const formatter = formatters[format];
  return formatter;
};
export default getFormatter;
