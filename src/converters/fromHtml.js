import jsdom from 'jsdom';
import { iframeBlock, imageBlock, videoBlock } from './blocks.js';
import { draftTableBlock, draftTextBlock } from './draftjs.js';
import { slateTableBlock, slateTextBlock } from './slate.js';
import {
  groupInlineNodes,
  isWhitespace,
  isGlobalInline,
} from '../helpers/dom.js';

const { JSDOM } = jsdom;
const DOMParser = new JSDOM().window.DOMParser;
const parser = new DOMParser();

global.document = new JSDOM('...').window.document;

const TEXT = 3;
const COMMENT = 8;

const elementsWithConverters = ['IMG', 'VIDEO', 'TABLE', 'IFRAME'];

const blockFromElement = (el, defaultTextBlock) => {
  let textBlock = slateTextBlock;
  let tableBlock = slateTableBlock;
  if (defaultTextBlock === 'draftjs') {
    tableBlock = draftTableBlock;
    textBlock = draftTextBlock;
  }
  let raw = {};
  switch (el.tagName) {
    case 'IMG':
      raw = imageBlock(el);
      break;
    case 'VIDEO':
      raw = videoBlock(el);
      break;
    case 'TABLE':
      raw = tableBlock(el);
      break;
    case 'IFRAME':
      raw = iframeBlock(el);
      break;
    default:
      raw = textBlock(el);
      break;
  }
  return raw;
};

const skipCommentsAndWhitespace = (elements) => {
  return Array.from(elements).filter(
    (node) =>
      !(
        node.nodeType === COMMENT ||
        (node.nodeType === TEXT && isWhitespace(node.textContent))
      ),
  );
};

const isInline = (n) =>
  n.nodeType === TEXT || isGlobalInline(n.tagName.toLowerCase());

const convertFromHTML = (input, defaultTextBlock) => {
  const document = parser.parseFromString(input, 'text/html');
  const result = [];
  let elements = skipCommentsAndWhitespace(document.body.childNodes);

  // If there is a single div at the top level, ignore it
  if (elements.length === 1 && elements[0].tagName === 'DIV') {
    elements = skipCommentsAndWhitespace(
      document.body.firstElementChild.childNodes,
    );
  }

  // group top-level text and inline elements inside a paragraph
  // so they don't become separate blocks
  elements = groupInlineNodes(elements, {
    isInline,
    createParent: (child) => {
      const parent = document.createElement('P');
      parent.appendChild(child);
      return parent;
    },
    appendChild: (parent, child) => parent.appendChild(child),
  });

  // convert to blocks
  for (const el of elements) {
    const children = el.childNodes;
    for (const child of children) {
      if (elementsWithConverters.includes(child.tagName)) {
        el.removeChild(child);
        result.push(blockFromElement(child, defaultTextBlock));
      }
    }
    result.push(blockFromElement(el, defaultTextBlock));
  }
  return result;
};

export default convertFromHTML;
