import _ from 'lodash';
import parse from './parsers.js';

const formatter = (astTree) => {
  const indentLength = 4;
  const delFlag = '- ';
  const addFlag = '+ ';
  const space = ' ';

  const iter = (ast, deep = 0) => {
    const key = ast[0];
    const type = ast[1];
    const body = ast[2];
    const bodyChanged = ast[3];
    const spaces = space.repeat(deep);

    const format = {
      node: () => {
        const nodeName = deep === 0 ? '' : `${spaces}${key}: `;
        return `${nodeName}{\n${body.map((a) => iter(a, deep + indentLength)).join('')}${space.repeat(deep)}}\n`;
      },
      deleted: () => `${spaces.slice(0, -delFlag.length)}${delFlag}${key}: ${format.complex(body, deep + indentLength)}\n`,
      added: () => `${spaces.slice(0, -addFlag.length)}${addFlag}${key}: ${format.complex(body, deep + indentLength)}\n`,
      changed: () => `${spaces.slice(0, -addFlag.length)}${delFlag}${key}: ${format.complex(body, deep + indentLength)}\n${spaces.slice(0, -delFlag.length)}${addFlag}${key}: ${format.complex(bodyChanged, deep + indentLength)}\n`,
      unchanged: () => `${spaces}${key}: ${body}\n`,
      complex: (iBody, iDeep) => {
        if (_.isObject(iBody)) {
          return `{${Object.entries(iBody).map(([ikey, value]) => {
            if (_.isObject(value)) {
              return `\n${space.repeat(iDeep)}${ikey}: ${format.complex(value, iDeep + indentLength)}`;
            }
            return `\n${space.repeat(iDeep)}${ikey}: ${value}`;
          }).join('')}\n${space.repeat(iDeep - indentLength)}}`;
        }
        return iBody;
      },
    };

    return format[type](ast, deep);
  };
  return iter(astTree);
};

const diff = (filepath1, filepath2) => {
  const dataBefore = parse(filepath1);
  const dataAfter = parse(filepath2);

  const iter = (data1, data2) => {
    const uniqueKeys = _.union(_.keys(data2), _.keys(data1)).sort();
    const deletedKeys = _.difference(uniqueKeys, _.keys(data2));
    const addedKeys = _.difference(uniqueKeys, _.keys(data1));
    const nodesKeys = _.difference(uniqueKeys, deletedKeys, addedKeys)
      .filter((key) => (_.isObject(data1[key]) && _.isObject(data2[key])));
    const changedKeys = _.difference(uniqueKeys, deletedKeys, addedKeys, nodesKeys)
      .filter((key) => data1[key] !== data2[key]);

    const result = uniqueKeys.map((key) => {
      if (nodesKeys.includes(key)) {
        return [key, 'node', iter(data1[key], data2[key])];
      }
      if (deletedKeys.includes(key)) {
        return [key, 'deleted', data1[key]];
      }
      if (addedKeys.includes(key)) {
        return [key, 'added', data2[key]];
      }
      if (changedKeys.includes(key)) {
        return [key, 'changed', data1[key], data2[key]];
      }
      return [key, 'unchanged', data1[key]];
    });
    return result;
  };
  return formatter(['', 'node', iter(dataBefore, dataAfter)]);
};

export default diff;
