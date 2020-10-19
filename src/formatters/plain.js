import _ from 'lodash';

const flag = {
  deletedProperty: 'removed',
  addedProperty: 'added with value:',
};
const formatNestedProperty = (body) => {
  if (typeof body === 'string') {
    return ` '${body}'`;
  }
  return _.isObject(body) ? ' [complex value]' : ` ${body}`;
};

const plain = (astTree) => {
  const iter = (ast, parentName = '') => {
    const [propertyName, nodeType, body, bodyChanged] = ast;
    if (nodeType === 'unchangedProperty') {
      return '';
    }
    const chainNodeNames = [parentName, propertyName].filter((n) => n !== '' && n !== 'root').join('.');

    if (nodeType === 'nodeProperty') {
      const nestedProperties = body.map((a) => iter(a, `${chainNodeNames}`)).join('');
      return `${nestedProperties}`;
    }

    const value = formatNestedProperty(body);

    if (nodeType === 'changedProperty') {
      const valueAfter = formatNestedProperty(bodyChanged);
      return `Property '${chainNodeNames}' was updated. From${value} to${valueAfter}\n`;
    }
    return `Property '${chainNodeNames}' was ${flag[nodeType]}${nodeType === 'deletedProperty' ? '' : value}\n`;
  };
  return iter(astTree);
};
export default plain;
