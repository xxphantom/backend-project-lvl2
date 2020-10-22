const json = (astTree) => {
  const iter = (ast) => {
    const [propertyName, nodeType, body, bodyChanged] = ast;

    const obj = {
      key: propertyName,
      type: nodeType,
    };

    switch (nodeType) {
      case 'node':
        obj.children = body.map((a) => iter(a));
        break;
      case 'changed':
        obj.value1 = body;
        obj.value2 = bodyChanged;
        break;
      default:
        obj.value = body;
        break;
    }
    return obj;
  };
  return `${JSON.stringify(astTree.map((node) => iter(node)), null, '')}\n`;
};

export default json;
