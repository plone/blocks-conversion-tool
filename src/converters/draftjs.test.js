import { elementFromString } from '../helpers/dom.js';
import { draftTableBlock, draftTextBlock } from './draftjs.js';

describe('draftTextBlock processing a paragraph', () => {
  const elem = elementFromString('<p>Hello world!</p>');

  test('will have @type as text', () => {
    const result = draftTextBlock(elem);
    expect(result['@type']).toBe('text');
  });

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing a pre block', () => {
  const elem = elementFromString('<pre>import this</pre>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('import this');
    expect(firstBlock['type']).toBe('code-block');
    expect(firstBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing a br', () => {
  const elem = elementFromString('<br>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing a code block', () => {
  const elem = elementFromString('<code>import this</code>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('import this');
    // Is this an issue?
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing a blockquote block', () => {
  const elem = elementFromString(
    '<blockquote cite="https://www.huxley.net/bnw/four.html"><p>Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.</p></blockquote>',
  );

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toContain('Words can be like X-ray');
    expect(firstBlock['type']).toBe('blockquote');
    expect(firstBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing a span', () => {
  const elem = elementFromString('<span>Hello world!</span>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing a H1', () => {
  const elem = elementFromString('<h1>Hello world!</h1>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('header-one');
    expect(firstBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing a H2', () => {
  const elem = elementFromString('<h2>Hello world!</h2>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('header-two');
    expect(firstBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing a b', () => {
  const elem = elementFromString('<b>Hello world!</b>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
    const inlineStyleRanges = firstBlock.inlineStyleRanges;
    expect(inlineStyleRanges).toHaveLength(1);
    expect(inlineStyleRanges[0]['style']).toBe('BOLD');
    expect(inlineStyleRanges[0]['offset']).toBe(0);
  });
});

describe('draftTextBlock processing a strong', () => {
  const elem = elementFromString('<strong>Hello world!</strong>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
    const inlineStyleRanges = firstBlock.inlineStyleRanges;
    expect(inlineStyleRanges).toHaveLength(1);
    expect(inlineStyleRanges[0]['style']).toBe('BOLD');
    expect(inlineStyleRanges[0]['offset']).toBe(0);
  });
});

describe('draftTextBlock processing a italic with i tag', () => {
  const elem = elementFromString('<i>Hello world!</i>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
    const inlineStyleRanges = firstBlock.inlineStyleRanges;
    expect(inlineStyleRanges).toHaveLength(1);
    expect(inlineStyleRanges[0]['style']).toBe('ITALIC');
    expect(inlineStyleRanges[0]['offset']).toBe(0);
  });
});

describe('draftTextBlock processing a italic with em tag', () => {
  const elem = elementFromString('<em>Hello world!</em>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
    const inlineStyleRanges = firstBlock.inlineStyleRanges;
    expect(inlineStyleRanges).toHaveLength(1);
    expect(inlineStyleRanges[0]['style']).toBe('ITALIC');
    expect(inlineStyleRanges[0]['offset']).toBe(0);
  });
});

describe('draftTextBlock processing a strike', () => {
  const elem = elementFromString('<s>Hello world!</s>');

  test('will have a nested structure in the value', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Hello world!');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
    const inlineStyleRanges = firstBlock.inlineStyleRanges;
    expect(inlineStyleRanges).toHaveLength(1);
    expect(inlineStyleRanges[0]['style']).toBe('STRIKETHROUGH');
    expect(inlineStyleRanges[0]['offset']).toBe(0);
  });
});

describe('draftTextBlock processing a sub', () => {
  const elem = elementFromString('<sub>2</sub>');

  test('will extract the text, but the style is not implemented ', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('2');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
    const inlineStyleRanges = firstBlock.inlineStyleRanges;
    expect(inlineStyleRanges).toHaveLength(0);
  });
});

describe('draftTextBlock processing a sup', () => {
  const elem = elementFromString('<sup>2</sup>');

  test('will extract the text, but the style is not implemented ', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('2');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
    const inlineStyleRanges = firstBlock.inlineStyleRanges;
    expect(inlineStyleRanges).toHaveLength(0);
  });
});

describe('draftTextBlock processing a link', () => {
  const elem = elementFromString(
    '<a href="https://plone.org/" title="Plone website" target="_blank">Welcome to Plone!</a>',
  );

  test('will extract the text inside the link', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(1);
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Welcome to Plone!');
    expect(firstBlock['type']).toBe('unstyled');
    expect(firstBlock['depth']).toBe(0);
  });

  test('will mark the entities in the text', () => {
    const result = draftTextBlock(elem);
    const entityRanges = result.text.blocks[0].entityRanges;
    expect(entityRanges).toHaveLength(1);
    expect(entityRanges[0]['key']).toBe(0);
    expect(entityRanges[0]['offset']).toBe(0);
  });

  test('will store the link metadata', () => {
    const result = draftTextBlock(elem);
    const entityMap = result.text.entityMap;
    const firstEntity = entityMap[0];
    expect(firstEntity['type']).toBe('LINK');
    expect(firstEntity['mutability']).toBe('MUTABLE');
    const linkData = firstEntity.data;
    expect(linkData.target).toBe('_blank');
    expect(linkData.title).toBe('Plone website');
    expect(linkData.url).toBe('https://plone.org/');
  });
});

describe('draftTextBlock processing an unordered list', () => {
  const elem = elementFromString('<ul><li>Item 1</li><li>Item 2</li></ul>');

  test('will have each list item as its own block', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(2);
  });

  test('will have first list item', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Item 1');
    expect(firstBlock['type']).toBe('unordered-list-item');
    expect(firstBlock['depth']).toBe(0);
  });

  test('will have second list item', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    const secondBlock = valueElement.blocks[1];
    expect(secondBlock['text']).toBe('Item 2');
    expect(secondBlock['type']).toBe('unordered-list-item');
    expect(secondBlock['depth']).toBe(0);
  });
});

describe('draftTextBlock processing an ordered list', () => {
  const elem = elementFromString('<ol><li>Item 1</li><li>Item 2</li></ol>');

  test('will have each list item as its own block', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    expect(valueElement.blocks).toHaveLength(2);
  });

  test('will have first list item', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    const firstBlock = valueElement.blocks[0];
    expect(firstBlock['text']).toBe('Item 1');
    expect(firstBlock['type']).toBe('ordered-list-item');
    expect(firstBlock['depth']).toBe(0);
  });

  test('will have second list item', () => {
    const result = draftTextBlock(elem);
    const valueElement = result.text;
    const secondBlock = valueElement.blocks[1];
    expect(secondBlock['text']).toBe('Item 2');
    expect(secondBlock['type']).toBe('ordered-list-item');
    expect(secondBlock['depth']).toBe(0);
  });
});

describe('draftTableBlock processing a simple table', () => {
  const elem = elementFromString('<table><tr><td>A value</td></tr></table>');

  test('will have @type as html', () => {
    const result = draftTableBlock(elem);
    expect(result['@type']).toBe('html');
  });

  test('will have the parsed table element as html', () => {
    const result = draftTableBlock(elem);
    expect(result.html).toContain('<table class="ui celled table">');
    expect(result.html).toContain('<tbody>');
    expect(result.html).toContain('<tr><td>A value</td></tr>');
    expect(result.html).toContain('</tbody>');
    expect(result.html).toContain('</table>');
  });
});
