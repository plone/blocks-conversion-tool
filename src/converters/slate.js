import { jsx } from 'slate-hyperscript';

const getId = () => Math.floor(Math.random() * Math.pow(2, 24)).toString(32);

const deserialize = (el) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  }

  let children = Array.from(el.childNodes).map(deserialize);

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  switch (el.nodeName) {
    case 'BR':
      return '\n';
    case 'PRE':
      return jsx('element', { type: 'code' }, children);
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'quote' }, children);
    case 'CODE':
      return jsx('element', { type: 'code' }, children);
    case 'SPAN':
      return jsx('element', { type: 'span' }, children);
    case 'H1':
      return jsx('element', { type: 'h1' }, children);
    case 'H2':
      return jsx('element', { type: 'h2' }, children);
    case 'B':
      return jsx('element', { type: 'strong' }, children);
    case 'OL':
      return jsx('element', { type: 'ol' }, children);
    case 'UL':
      return jsx('element', { type: 'ul' }, children);
    case 'LI':
      return jsx('element', { type: 'li' }, children);
    case 'A':
      return jsx(
        'element',
        {
          type: 'a',
          url: el.getAttribute('href'),
          title: el.getAttribute('title'),
        },
        children,
      );
    default:
      return jsx('element', { type: 'p' }, children);
  }
};

const createCell = (type, value) => ({
  key: getId(),
  type: type,
  value: value,
});

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
          const cellValue = Array.from(cell.childNodes).map(deserialize);
          cells.push(createCell(cellType, cellValue));
        }
        rows.push({ cells });
      }
    }
  }
  block.table = createTable(rows);
  return block;
};

const slateTextBlock = (elem) => {
  const block = {};
  block['@type'] = 'slate';
  block.value = [deserialize(elem)];
  block.plaintext = elem.textContent;
  return block;
};

export { slateTextBlock, slateTableBlock };
