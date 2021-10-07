import jsdom from 'jsdom';
import { iframeBlock, imageBlock, videoBlock } from './blocks.js';
import { draftTableBlock, draftTextBlock } from './draftjs.js';
import { slateTableBlock, slateTextBlock } from './slate.js';

const { JSDOM } = jsdom;
const DOMParser = new JSDOM().window.DOMParser;
const parser = new DOMParser();

global.document = new JSDOM('...').window.document;

const convertFromHTML = (input, defaultTextBlock) => {
  const document = parser.parseFromString(input, 'text/html');
  let textBlock = slateTextBlock;
  let tableBlock = slateTableBlock;
  if (defaultTextBlock === 'draftjs') {
    tableBlock = draftTableBlock;
    textBlock = draftTextBlock;
  }
  const result = [];
  let elements = document.body.children;
  const firstChild = document.body.firstElementChild;

  if (elements.length === 1 && firstChild.tagName === 'DIV') {
    elements = document.body.firstElementChild.children;
  }

  for (const el of elements) {
    let raw = {};
    const child = el.firstElementChild;
    if (el.nodeName === 'P') {
      if (child != null) {
        switch (child.tagName) {
          case 'IMG':
            raw = imageBlock(child);
            break;
          case 'VIDEO':
            raw = videoBlock(child);
            break;
          case 'TABLE':
            raw = tableBlock(child);
            break;
          case 'IFRAME':
            raw = iframeBlock(child);
            break;
          default:
            raw = textBlock(el);
            break;
        }
      } else {
        raw = textBlock(el);
      }
    } else {
      switch (el.tagName) {
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
    }
    result.push(raw);
  }
  return result;
};

export default convertFromHTML;
