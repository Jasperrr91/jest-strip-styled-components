const { getHashes } = require('./utils');

let cache = new WeakSet();
const getNodes = (node, nodes = []) => {
  if (typeof node === 'object') {
    nodes.push(node);
  }

  if (node.children) {
    Array.from(node.children).forEach((child) => getNodes(child, nodes));
  }

  return nodes;
};

const getClassNamesFromDOM = (node) => Array.from(node.classList);
const getClassNamesFromProps = (node) => {
  const classNameProp = node.props && (node.props.class || node.props.className);

  if (classNameProp) {
    return classNameProp.trim().split(/\s+/);
  }

  return [];
};

const getClassNames = (nodes) =>
  nodes.reduce((classNames, node) => {
    let newClassNames = null;

    if (global.Element && node instanceof global.Element) {
      newClassNames = getClassNamesFromDOM(node);
    } else {
      newClassNames = getClassNamesFromProps(node);
    }

    newClassNames.forEach((className) => classNames.add(className));

    return classNames;
  }, new Set());

const isStyledClass = (className) => /^\.?(\w+(-|_))?sc-/.test(className);

const filterUnreferencedClassNames = (classNames, hashes) =>
  classNames.filter((className) => isStyledClass(className) && !hashes.includes(className));

const stripClassNames = (result, classNames) =>
  classNames.reduce((acc, className) => acc.replace(new RegExp(`${className}\\s?`, 'g'), ''), result);

module.exports = {
  test(val) {
    return (
      val &&
      !cache.has(val) &&
      (val.$$typeof === Symbol.for('react.test.json') || (global.Element && val instanceof global.Element))
    );
  },

  print(val, print) {
    const nodes = getNodes(val);
    nodes.forEach(cache.add, cache);

    const hashes = getHashes();
    const classNames = [...getClassNames(nodes)];
    const unreferencedClassNames = filterUnreferencedClassNames(classNames, hashes);

    let result = print(val);
    result = stripClassNames(result, unreferencedClassNames);
    result = stripClassNames(result, hashes);

    nodes.forEach(cache.delete, cache);
    return result;
  },
};
