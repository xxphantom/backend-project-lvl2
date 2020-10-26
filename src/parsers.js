import yaml from 'js-yaml';

const getParser = {
  yaml: yaml.safeLoad,
  json: JSON.parse,
};

const parse = (data, type) => {
  if (!type) {
    throw new Error('unexpected input format');
  }
  const parser = getParser[type];
  const parsedData = parser(data);
  return parsedData;
};
export default parse;
