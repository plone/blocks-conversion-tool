import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const DOMParser = new JSDOM().window.DOMParser;
const parser = new DOMParser();

const elementFromString = (value) => {
  const elem = parser.parseFromString(value, 'text/html').body.firstChild;
  return elem;
};

const isWhitespace = (c) => {
  return typeof c === 'string' && c.replace(/[\t\n\r ]/g, '').length === 0;
};

const groupInlineNodes = (inNodes, { isInline, createParent, appendChild }) => {
  // Process a list of DOM nodes.
  // Return a new list of nodes where each sequence of non-block nodes
  // (text and inline elements) have been wrapped in a new block node.
  const nodes = [];
  let inlineNodes = null;

  inNodes.forEach((node) => {
    if (!isInline(node)) {
      inlineNodes = null;
      nodes.push(node);
    } else {
      if (!inlineNodes) {
        inlineNodes = createParent(node);
        nodes.push(inlineNodes);
      } else {
        appendChild(inlineNodes, node);
      }
    }
  });
  return nodes;
};

const inlineElements = [
  'b',
  'br',
  'code',
  'em',
  'i',
  'link',
  's',
  'strong',
  'sub',
  'sup',
  'u',
];

const isGlobalInline = (tagName) => inlineElements.includes(tagName);

export { elementFromString, isWhitespace, isGlobalInline, groupInlineNodes };
