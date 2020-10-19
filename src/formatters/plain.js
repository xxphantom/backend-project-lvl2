import _ from 'lodash';

const plain = (astTree) => {
  const indentLength = 4;
  const space = ' ';
  const openBracket = '{';
  const closeBracket = '}';

  const iter = (ast, deep = 0) => {
    const propertyName = ast[0];
    const type = ast[1];
    const body = ast[2];
    const bodyChanged = ast[3];
    const flag = {
      deletedProperty: ['- '],
      addedProperty: ['+ '],
      changedProperty: ['- ', '+ '],
      unchangedProperty: [''],
      nodeProperty: [''],
    };
    const indent = space.repeat(deep - flag[type][0].length);

    const formatNestedProperty = (value, deepCount) => {
      if (!_.isObject(value)) {
        return value;
      }
      const indentForBracket = space.repeat(deepCount - indentLength);
      const nestedProperties = Object.entries(value).map(([pName, pValue]) => {
        const pIndent = space.repeat(deepCount);
        const nestedValue = formatNestedProperty(pValue, deepCount + indentLength);
        return `\n${pIndent}${pName}: ${nestedValue}`;
      }).join('');
      return `${openBracket}${nestedProperties}\n${indentForBracket}${closeBracket}`;
    };

    if (type === 'nodeProperty') {
      const nodeName = deep === 0 ? '' : `${indent}${propertyName}: `;
      const nestedProperties = body.map((a) => iter(a, deep + indentLength)).join('');
      return `${nodeName}${openBracket}\n${nestedProperties}${indent}${closeBracket}\n`;
    }

    const value = formatNestedProperty(body, deep + indentLength);

    if (type === 'changedProperty') {
      const valueAfter = formatNestedProperty(bodyChanged, deep + indentLength);
      const flagBefore = flag[type][0];
      const flagAfter = flag[type][1];
      return `${indent}${flagBefore}${propertyName}: ${value}\n${indent}${flagAfter}${propertyName}: ${valueAfter}\n`;
    }
    return `${indent}${flag[type]}${propertyName}: ${value}\n`;
  };
  return iter(astTree);
};

export default plain;
