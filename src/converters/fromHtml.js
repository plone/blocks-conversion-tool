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

const TEXT_NODE = 3;
const COMMENT = 8;

const elementsWithConverters = ['IMG', 'VIDEO', 'TABLE', 'IFRAME'];
const elementsShouldHaveText = [
  'B',
  'BLOCKQUOTE',
  'BODY',
  'CODE',
  'DEL',
  'DIV',
  'EM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'I',
  'P',
  'PRE',
  'S',
  'SPAN',
  'STRONG',
  'SUB',
  'SUP',
  'U',
];

const shouldKeepWrapper = (el) => {
  if (elementsShouldHaveText.includes(el.tagName)) {
    const textContent = el.textContent.trim();
    return textContent ? true : false;
  }
  return true;
};

const blockFromElement = (el, defaultTextBlock, href) => {
  let textBlock = slateTextBlock;
  let tableBlock = slateTableBlock;
  if (defaultTextBlock === 'draftjs') {
    tableBlock = draftTableBlock;
    textBlock = draftTextBlock;
  }
  let raw = {};
  switch (el.tagName) {
    case 'IMG':
      raw = imageBlock(el, href);
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
        (node.nodeType === TEXT_NODE && isWhitespace(node.textContent))
      ),
  );
};

const isInline = (n) =>
  n.nodeType === TEXT_NODE || isGlobalInline(n.tagName.toLowerCase());

const extractElementsWithConverters = (el, defaultTextBlock, href) => {
  const result = [];
  if (el.tagName === 'TABLE') {
    for (const child of el.childNodes) {
      const tmpResult = extractElementsWithConverters(
        child,
        defaultTextBlock,
        href,
      );
      if (tmpResult.length > 0) {
        result.push(...tmpResult);
      }
    }
    result.push(blockFromElement(el, defaultTextBlock, href));
  } else if (elementsWithConverters.includes(el.tagName)) {
    result.push(blockFromElement(el, defaultTextBlock, href));
  } else {
    const children = el.childNodes;
    if (el.tagName === 'A') {
      href = el.getAttribute('href');
    }
    for (const child of children) {
      if (elementsWithConverters.includes(child.tagName)) {
        el.removeChild(child);
        result.push(blockFromElement(child, defaultTextBlock, href));
      } else {
        const tmpResult = extractElementsWithConverters(
          child,
          defaultTextBlock,
          href,
        );
        if (tmpResult.length > 0) {
          result.push(...tmpResult);
        }
      }
    }
  }

  return result;
};

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
    const href = el.getAttribute('href');
    let keepWrapper = shouldKeepWrapper(el);
    for (const child of children) {
      // With children nodes, we keep the wrapper only
      // if at least one child is not  in elementsWithConverters
      keepWrapper = keepWrapper || false;
      const tmpResult = extractElementsWithConverters(
        child,
        defaultTextBlock,
        href,
      );
      if (tmpResult) {
        result.push(...tmpResult);
      }
    }
    if (keepWrapper) {
      result.push(blockFromElement(el, defaultTextBlock));
    }
  }
  return result;
};

export default convertFromHTML;
