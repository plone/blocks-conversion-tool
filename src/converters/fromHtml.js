import jsdom from 'jsdom';
import { iframeBlock, imageBlock, videoBlock } from './blocks.js';
import { draftTableBlock, draftTextBlock } from './draftjs.js';
import { slateTableBlock, slateTextBlock } from './slate.js';

const { JSDOM } = jsdom;
const DOMParser = new JSDOM().window.DOMParser;
const parser = new DOMParser();

global.document = new JSDOM('...').window.document;

const blockElements = ['DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'];

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

const convertFromHTML = (input, defaultTextBlock) => {
  const document = parser.parseFromString(input, 'text/html');
  const result = [];
  const firstChild = document.body.firstElementChild;
  let elements = document.body.children;
  if (elements.length === 1 && firstChild.tagName === 'DIV') {
    elements = document.body.firstElementChild.children;
  }

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
