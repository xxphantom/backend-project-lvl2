import yaml from 'js-yaml';

const getParser = {
  '.yml': (yamlData) => yaml.safeLoad(yamlData),
  '.json': (jsonData) => JSON.parse(jsonData),
};

const parse = (data, fileFormat) => {
  const parser = getParser[fileFormat];
  const parsedData = parser(data);
  return parsedData;
};
export default parse;
