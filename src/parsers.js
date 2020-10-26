import yaml from 'js-yaml';

const parsers = {
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
  json: JSON.parse,
};

const parse = (data, format) => {
  if (!format) {
    throw new Error('unexpected input format');
  }
  const parsedData = parsers[format](data);
  return parsedData;
};
export default parse;
