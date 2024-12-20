import { jsx } from 'slate-hyperscript';
import { Text } from 'slate';
import { elementsWithConverters } from './blocks.js';
import {
  groupInlineNodes,
  isWhitespace,
  isGlobalInline,
} from '../helpers/dom.js';

const getId = () => Math.floor(Math.random() * Math.pow(2, 24)).toString(32);

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;
const COMMENT = 8;

// UTILS
const deserializeChildren = (parent) =>
  Array.from(parent.childNodes)
    .map((el) => deserialize(el))
    .flat()
    .filter((x) => x);

const isInline = (n) =>
  typeof n === 'string' ||
  Text.isText(n) ||
  isGlobalInline(n.type) ||
  isGlobalInline(n?.nodeName?.toLowerCase());

function normalizeBlockNodes(children) {
  return groupInlineNodes(children, {
    isInline,
    createParent: (child) => jsx('element', { type: 'span' }, [child]),
    appendChild: (parent, child) => parent.children.push(child),
  });
}

// DESERIALIZERS
const simpleLinkDeserializer = (el) => {
  let parent = el;

  let children = deserializeChildren(parent);
  if (!children.length) children = [''];

  const attrs = {
    type: 'link',
    data: {
      url: el.getAttribute('href'),
      title: el.getAttribute('title'),
      target: el.getAttribute('target'),
    },
  };
  let block = jsx('element', attrs, children);
  if (el.getAttribute('class')) {
    block.styleName = el.getAttribute('class');
  }
  return block;
};

const bTagDeserializer = (el) => {
  // Google Docs does weird things with <b> tag
  return (el.getAttribute('id') || '').indexOf('docs-internal-guid') > -1
    ? deserializeChildren(el)
    : jsx('element', { type: 'strong' }, deserializeChildren(el));
};

const spanTagDeserializer = (el) => {
  const style = (el.getAttribute('style') || '').replace(/\s/g, '');
  const className = el.getAttribute('class');
  let children = el.childNodes;
  if (children.length === 1) {
    const child = children[0];
    if (
      // handle formatting from OpenOffice
      child.nodeType === TEXT_NODE &&
      child.textContent === '\n'
    ) {
      return jsx('text', {}, ' ');
    } else if (elementsWithConverters.hasOwnProperty(child.tagName)) {
      // If we have a child element that has its own converter, use it
      return elementsWithConverters[child.tagName](child);
    } else if (style.indexOf('font-weight:bold') > -1) {
      // Handle TinyMCE' bold formatting
      return jsx('element', { type: 'strong' }, child.textContent);
    } else if (style.indexOf('font-style:italic') > -1) {
      // Handle TinyMCE' italic formatting
      return jsx('element', { type: 'em' }, child.textContent);
    }
  }

  children = deserializeChildren(el);
  if (children.length > 0) {
    if (style.indexOf('vertical-align:sub') > -1) {
      // Handle Google Docs' <sub> formatting
      children = jsx('element', { type: 'sub' }, children);
    } else if (style.indexOf('vertical-align:sup') > -1) {
      // Handle Google Docs' <sup> formatting
      children = jsx('element', { type: 'sup' }, children);
    }
    const data = jsx('fragment', {}, children);
    if (className === 'text-larger') {
      data[0]['style-text-larger'] = true;
    }
    return data;
  }
};

const blockTagDeserializer = (tagname) => (el) => {
  let children = deserializeChildren(el);
  // Check if we already have a block information
  if (children.length == 1 && children[0].hasOwnProperty('@type')) {
    return children[0];
  }
  children = jsx('fragment', {}, children);

  if (
    ['td', 'th'].includes(tagname) &&
    children.length > 0 &&
    typeof children[0] === 'string'
  ) {
    const div = jsx('element', { type: 'div' }, []);
    div.children[0].text = children[0];
    children = [div];
  }

  const hasBlockChild = children.filter((n) => !isInline(n)).length > 0;
  if (hasBlockChild) {
    // ignore whitespace and group inline elements in block context
    children = children.filter((x) => x.text !== ' ');
    children = normalizeBlockNodes(children);
  }

  // normalizes block elements so that they're never empty
  // Avoids a hard crash from the Slate editor
  const hasValidChildren = children.length && children.find((c) => !!c);
  if (!isInline(el) && !hasValidChildren) {
    children = [{ text: '' }];
  }

  if (tagname === 'p' && el.className === 'callout')
    return jsx('element', { type: 'callout' }, children);
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
  let children = el.childNodes;
  if (children.length === 1) {
    const child = children[0];
    if (
      // handle formatting from OpenOffice
      child.nodeType === TEXT_NODE &&
      child.textContent === '\n'
    ) {
      return jsx('text', {}, ' ');
    } else if (elementsWithConverters.hasOwnProperty(child.tagName)) {
      // If we have a child element that has its own converter, use it
      return elementsWithConverters[child.tagName](child);
    }
  }
  children = Array.from(children)
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
      // normalize whitespace between 2 tags to a single space
      return ' ';
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

  if (isInline(el) && el.textContent === '') {
    return '';
  } else if (htmlTagsToSlate[nodeName]) {
    return htmlTagsToSlate[nodeName](el);
  }

  return deserializeChildren(el); // fallback deserializer
};

const createCell = (type, value) => {
  return {
    key: getId(),
    type: type,
    value: jsx('fragment', {}, jsx('element', { type: 'div' }, value)),
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
  let hideHeaders = false;
  let isFirstRow = true;
  // recursive search for reconstructing table
  for (const table of children) {
    for (const tchild of table.children) {
      if (tchild.tagName === 'TR') {
        if (isFirstRow) {
          isFirstRow = false;
          if (
            tchild.children.length > 0 &&
            tchild.children[0].tagName !== 'TH'
          ) {
            /* if first cell is not a TH, we assume we have a table without header.
               so we add an empty header row and hide it via `hideHeaders`.
               (otherwise the first row would appear as header what might no be expected)
            */
            let emptyHeaderCells = [];
            for (let i = 0; i < tchild.children.length; i++)
              emptyHeaderCells.push(createCell('header', ['']));
            rows.push({ key: getId(), cells: emptyHeaderCells });
            hideHeaders = true;
          }
        }
        const cells = [];
        for (const cell of tchild.children) {
          const cellType = cell.tagName === 'TD' ? 'data' : 'header';
          let cellValue = deserializeChildren(cell);
          if (!cellValue.length) cellValue = [''];
          cells.push(createCell(cellType, cellValue));
        }
        rows.push({ key: getId(), cells });
      }
    }
  }
  block.table = createTable(rows);
  if (hideHeaders) block.table['hideHeaders'] = true;

  const classes = elem.className.split(' ');
  if (
    classes.length > 0 &&
    classes.includes('ui') &&
    classes.includes('table')
  ) {
    // if table element has the classes "ui" and "table" we assume
    // further settings-relevant classes were set (or not set) explicitly,
    // so we set settings based on those classes, instead of using the defaults
    const toCheck = ['basic', 'celled', 'compact', 'fixed', 'striped'];
    for (const c of toCheck) {
      block.table[c] = classes.includes(c);
    }
  }

  return block;
};

const slateTextBlock = (elem) => {
  const block = {};
  let value = deserialize(elem);
  if (typeof value === 'object' && value.hasOwnProperty('@type')) {
    // Return block information if it was processed somewhere else
    // in the codebase
    if (['image', 'html', 'video'].includes(value['@type'])) {
      return value;
    }
  } else if (!Array.isArray(value)) {
    value = [value];
  }
  value = jsx('fragment', {}, value);
  block['@type'] = 'slate';
  block.value = value;
  block.plaintext = elem.textContent;
  return block;
};

export { slateTextBlock, slateTableBlock };
