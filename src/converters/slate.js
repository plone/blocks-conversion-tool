import { jsx } from 'slate-hyperscript';
import { Text } from 'slate';

const getId = () => Math.floor(Math.random() * Math.pow(2, 24)).toString(32);

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;
const COMMENT = 8;

// UTILS
const deserializeChildren = (parent) =>
  Array.from(parent.childNodes)
    .map((el) => {
      const result = deserialize(el);
      return result;
    })
    .flat();

const isWhitespace = (c) => {
  return (
    typeof c === 'string' &&
    c.replace(/\s/g, '').replace(/\t/g, '').replace(/\n/g, '').length === 0
  );
};

const createEmptyParagraph = () => jsx('element', { type: 'p' }, []);
const createDefaultBlock = (node) => jsx('element', { type: 'span' }, [node]);

function normalizeBlockNodes(children) {
  const nodes = [];
  let inlinesBlock = null;

  const isInline = (n) =>
    typeof n === 'string' || Text.isText(n) || isGlobalInline(n);

  children.forEach((node) => {
    if (!isInline(node)) {
      inlinesBlock = null;
      nodes.push(node);
    } else {
      node = typeof node === 'string' ? { text: node } : node;
      if (!inlinesBlock) {
        inlinesBlock = createDefaultBlock([node]);
        nodes.push(inlinesBlock);
      } else {
        inlinesBlock.children.push(node);
      }
    }
  });
  return nodes;
}

const inlineElements = [
  'link',
  'em',
  'i',
  'b',
  'strong',
  'u',
  's',
  'sub',
  'sup',
  'code',
];

const isGlobalInline = (node) => inlineElements.includes(node.type);

// DESERIALIZERS
const simpleLinkDeserializer = (el) => {
  let parent = el;

  let children = Array.from(parent.childNodes)
    .map((el) => deserialize(el))
    .flat();

  if (!children.length) children = [''];

  const attrs = {
    type: 'link',
    data: {
      url: el.getAttribute('href'),
      title: el.getAttribute('title'),
      target: el.getAttribute('target'),
    },
  };

  return jsx('element', attrs, children);
};

const bTagDeserializer = (el) => {
  // Google Docs does weird things with <b> tag
  return (el.getAttribute('id') || '').indexOf('docs-internal-guid') > -1
    ? deserializeChildren(el)
    : jsx('element', { type: 'strong' }, deserializeChildren(el));
};

const spanTagDeserializer = (el) => {
  const style = el.getAttribute('style') || '';
  let children = el.childNodes;
  if (
    // handle formatting from OpenOffice
    children.length === 1 &&
    children[0].nodeType === TEXT_NODE &&
    children[0].textContent === '\n'
  ) {
    return jsx('text', {}, ' ');
  }
  children = deserializeChildren(el);
  // whitespace is replaced by deserialize() with null;
  children = children.map((c) => (c === null ? ' ' : c));

  // Handle Google Docs' <sub> formatting
  if (style.replace(/\s/g, '').indexOf('vertical-align:sub') > -1) {
    children = jsx('element', { type: 'sub' }, children);
  } else if (style.replace(/\s/g, '').indexOf('vertical-align:sup') > -1) {
    children = jsx('element', { type: 'sup' }, children);
  }
  return jsx('element', { type: 'span' }, children);
};

const blockTagDeserializer = (tagname) => (el) => {
  let children = deserializeChildren(el).filter((n) => n !== null);

  if (
    ['td', 'th'].includes(tagname) &&
    children.length > 0 &&
    typeof children[0] === 'string'
  ) {
    // TODO: should here be handled the cases when there are more strings in
    // `children` or when there are besides strings other types of nodes too?
    const p = createEmptyParagraph();
    p.children[0].text = children[0];
    children = [p];
  }

  const isInline = (n) =>
    typeof n === 'string' || Text.isText(n) || isGlobalInline(n);
  const hasBlockChild = children.filter((n) => !isInline(n)).length > 0;

  if (hasBlockChild) {
    children = normalizeBlockNodes(children);
  }

  // normalizes block elements so that they're never empty
  // Avoids a hard crash from the Slate editor
  const hasValidChildren = children.length && children.find((c) => !!c);
  if (!isInline(el) && !hasValidChildren) {
    children = [{ text: '' }];
  }

  return jsx('element', { type: tagname }, children);
};

const codeTagDeserializer = (el) => {
  return jsx('element', { type: 'code' }, el.textContent);
};

const preTagDeserializer = (el) => {
  // Based on Slate example implementation. Replaces <pre> tags with <code>.
  // Comment: I don't know how good of an idea is this. I'd rather have two
  // separate formats: "preserve whitespace" and "code". This feels like a hack
  let parent = el;

  if (el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    parent = el.childNodes[0];
    return codeTagDeserializer(parent);
  }

  return blockTagDeserializer('pre')(parent);
};

const bodyTagDeserializer = (el) => {
  return jsx('fragment', {}, deserializeChildren(el));
};

const divTagDeserializer = (el) => {
  const children = Array.from(el.childNodes)
    .map((child) => {
      if (child.nodeType === TEXT_NODE) {
        let value = deserialize(child);
        if (value === null) {
          value = ' ';
        }
        return jsx('element', { type: 'p' }, value);
      } else if (child.nodeName === 'DIV') {
        return divTagDeserializer(child);
      } else {
        return jsx('fragment', {}, deserialize(child));
      }
    })
    .flat();
  return jsx('fragment', {}, children);
};

// TAG MAP DEFINITIONS
const htmlTagsToSlate = {
  B: bTagDeserializer,
  BODY: bodyTagDeserializer,
  CODE: codeTagDeserializer,
  DIV: divTagDeserializer,
  PRE: preTagDeserializer,
  SPAN: spanTagDeserializer,
  A: simpleLinkDeserializer,
  BLOCKQUOTE: blockTagDeserializer('blockquote'),
  DEL: blockTagDeserializer('s'),
  EM: blockTagDeserializer('em'),
  H1: blockTagDeserializer('h1'),
  H2: blockTagDeserializer('h2'),
  H3: blockTagDeserializer('h3'),
  H4: blockTagDeserializer('h4'),
  H5: blockTagDeserializer('h5'),
  H6: blockTagDeserializer('h6'),
  I: blockTagDeserializer('em'),
  P: blockTagDeserializer('p'),
  S: blockTagDeserializer('s'),
  STRONG: blockTagDeserializer('strong'),
  SUB: blockTagDeserializer('sub'),
  SUP: blockTagDeserializer('sup'),
  U: blockTagDeserializer('u'),
  // Lists
  OL: blockTagDeserializer('ol'),
  UL: blockTagDeserializer('ul'),
  LI: blockTagDeserializer('li'),
  // Definition List
  DL: blockTagDeserializer('dl'),
  DT: blockTagDeserializer('dt'),
  DD: blockTagDeserializer('dd'),
  // We do not have a HR option in slate, so we return
  // an empty paragraph
  HR: blockTagDeserializer('p'),
};

const deserialize = (el) => {
  if (el.nodeType === COMMENT) {
    return null;
  } else if (el.nodeType === TEXT_NODE) {
    // instead of === '\n' we use isWhitespace for when deserializing tables
    // from Calc and other similar cases
    if (isWhitespace(el.textContent)) {
      // if it's empty text between 2 tags, it should be ignored
      return null;
    }
    return el.textContent
      .replace(/\n$/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\t/g, '');
  } else if (el.nodeType !== ELEMENT_NODE) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;

  if (htmlTagsToSlate[nodeName]) {
    return htmlTagsToSlate[nodeName](el);
  }

  return deserializeChildren(el); // fallback deserializer
};

const createCell = (type, rawValue) => {
  const value = rawValue.map(function (el) {
    if (typeof el === 'string') {
      return jsx('element', { type: 'p' }, el);
    } else {
      return el;
    }
  });
  return {
    key: getId(),
    type: type,
    value: value,
  };
};

const createTable = (rows) => ({
  basic: false,
  celled: true,
  compact: false,
  fixed: true,
  inverted: false,
  rows: rows,
  striped: false,
});

const slateTableBlock = (elem) => {
  const block = {};
  block['@type'] = 'slateTable';
  const children = elem.children;
  const rows = [];
  // recursive search for reconstructing table
  for (const table of children) {
    for (const tchild of table.children) {
      if (tchild.tagName === 'TR') {
        const cells = [];
        for (const cell of tchild.children) {
          const cellType = cell.tagName === 'TD' ? 'data' : 'header';
          const cellValue = Array.from(cell.childNodes)
            .map(deserialize)
            .filter((x) => x);
          cells.push(createCell(cellType, cellValue));
        }
        rows.push({ key: getId(), cells });
      }
    }
  }
  block.table = createTable(rows);
  return block;
};

const slateTextBlock = (elem) => {
  const block = {};
  let value = deserialize(elem);
  if (!Array.isArray(value)) {
    value = [value];
  }
  block['@type'] = 'slate';
  block.value = value;
  block.plaintext = elem.textContent;
  return block;
};

export { slateTextBlock, slateTableBlock };
