import { stateFromHTML } from 'draft-js-import-html';
import pkg from 'draft-js';
const { convertToRaw, EditorState } = pkg;

const FromHTMLCustomBlockFn = (element) => {
  const customBlock = {};
  if (element.dataset.depth) {
    customBlock.data = { depth: element.dataset.depth };
  }
  if (element.className === 'callout') {
    customBlock.type = 'callout';
  }
  if (Object.keys(customBlock).length > 0) {
    return customBlock;
  }
  return null;
};

const draftTableBlock = (elem) => {
  const html = elem.outerHTML;
  const block = {};
  let value = '';
  block['@type'] = 'html';
  // Import tables as standard HTML content
  value = html.replace('<table>', '<table class="ui celled table">');
  value = value.replace(
    '<table class="align--justify">',
    '<table class="ui celled table">',
  );
  value = value.replace(
    '<table class="Table">',
    '<table class="ui celled table">',
  );
  block.html = value;
  return block;
};

const draftTextBlock = (elem) => {
  const block = {};
  block['@type'] = 'text';
  const contentState = stateFromHTML(elem.outerHTML, {
    customBlockFn: FromHTMLCustomBlockFn,
  });
  const editorState = EditorState.createWithContent(contentState);
  block.text = convertToRaw(editorState.getCurrentContent());
  return block;
};

export { draftTableBlock, draftTextBlock };
