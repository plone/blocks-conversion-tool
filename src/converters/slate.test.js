import { elementFromString } from '../helpers/tests.js';
import { slateTableBlock, slateTextBlock } from './slate.js';

describe('slateTextBlock processing a paragraph', () => {
  const elem = elementFromString('<p>Hello world!</p>');

  test('will have @type as slate', () => {
    const result = slateTextBlock(elem);
    expect(result['@type']).toBe('slate');
  });

  test('will extract the text from the element', () => {
    const result = slateTextBlock(elem);
    expect(result.plaintext).toBe('Hello world!');
  });

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('p');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a pre block', () => {
  const elem = elementFromString('<pre>import this</pre>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('code');
    expect(valueElement['children'][0]['text']).toBe('import this');
  });
});

describe('slateTextBlock processing a br', () => {
  const elem = elementFromString('<br>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    expect(result.plaintext).toBe('');
    expect(result.value[0]).toMatch(/\n/);
  });
});

describe('slateTextBlock processing a code block', () => {
  const elem = elementFromString('<code>import this</code>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('code');
    expect(valueElement['children'][0]['text']).toBe('import this');
  });
});

describe('slateTextBlock processing a blockquote block', () => {
  const elem = elementFromString(
    '<blockquote cite="https://www.huxley.net/bnw/four.html"><p>Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.</p></blockquote>',
  );

  test('will extract the text from the element', () => {
    const result = slateTextBlock(elem);
    expect(result.plaintext).toBe(
      'Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.',
    );
  });

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('quote');
    const nestedValueElement = valueElement.children[0];
    expect(nestedValueElement['type']).toBe('p');
    expect(nestedValueElement['children'][0]['text']).toContain(
      'Words can be like X-ray',
    );
  });
});

describe('slateTextBlock processing a span', () => {
  const elem = elementFromString('<span>Hello world!</span>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('span');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a H1', () => {
  const elem = elementFromString('<h1>Hello world!</h1>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('h1');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a h2', () => {
  const elem = elementFromString('<h2>Hello world!</h2>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('h2');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a b', () => {
  const elem = elementFromString('<b>Hello world!</b>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('strong');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a strong', () => {
  const elem = elementFromString('<strong>Hello world!</strong>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('strong');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a strike', () => {
  const elem = elementFromString('<s>Hello world!</s>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('s');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a italic with i tag', () => {
  const elem = elementFromString('<i>Hello world!</i>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('em');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a italic with em tag', () => {
  const elem = elementFromString('<em>Hello world!</em>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('em');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing an ordered list', () => {
  const elem = elementFromString('<ol><li>Item 1</li><li>Item 2</li></ol>');

  test('will extract the text from the element', () => {
    const result = slateTextBlock(elem);
    expect(result.plaintext).toBe('Item 1Item 2');
  });

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('ol');
    const firstChildElement = valueElement.children[0];
    expect(firstChildElement['type']).toBe('li');
    expect(firstChildElement['children'][0]['text']).toBe('Item 1');
    const secondChildElement = valueElement.children[1];
    expect(secondChildElement['type']).toBe('li');
    expect(secondChildElement['children'][0]['text']).toBe('Item 2');
  });
});

describe('slateTextBlock processing an unordered list', () => {
  const elem = elementFromString('<ul><li>Item 1</li><li>Item 2</li></ul>');

  test('will extract the text from the element', () => {
    const result = slateTextBlock(elem);
    expect(result.plaintext).toBe('Item 1Item 2');
  });

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('ul');
    const firstChildElement = valueElement.children[0];
    expect(firstChildElement['type']).toBe('li');
    expect(firstChildElement['children'][0]['text']).toBe('Item 1');
    const secondChildElement = valueElement.children[1];
    expect(secondChildElement['type']).toBe('li');
    expect(secondChildElement['children'][0]['text']).toBe('Item 2');
  });
});

describe('slateTextBlock processing a sub', () => {
  const elem = elementFromString('<sub>2</sub>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('sub');
    expect(valueElement['children'][0]['text']).toBe('2');
  });
});

describe('slateTextBlock processing a sup', () => {
  const elem = elementFromString('<sup>2</sup>');

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('sup');
    expect(valueElement['children'][0]['text']).toBe('2');
  });
});

describe('slateTextBlock processing a link', () => {
  const elem = elementFromString(
    '<a href="https://plone.org/" title="Plone website" target="_blank">Welcome to Plone!</a>',
  );

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('a');
    expect(valueElement['url']).toBe('https://plone.org/');
    expect(valueElement['title']).toBe('Plone website');
    expect(valueElement['target']).toBe('_blank');
    expect(valueElement['children'][0]['text']).toBe('Welcome to Plone!');
  });
});

describe('slateTableBlock processing a simple table', () => {
  const elem = elementFromString('<table><tr><td>A value</td></tr></table>');

  test('will have @type as slateTable', () => {
    const result = slateTableBlock(elem);
    expect(result['@type']).toBe('slateTable');
  });

  test('will have table settings', () => {
    const result = slateTableBlock(elem);
    expect(result.table.basic).toBeFalsy();
    expect(result.table.celled).toBeTruthy();
    expect(result.table.compact).toBeFalsy();
    expect(result.table.fixed).toBeTruthy();
    expect(result.table.inverted).toBeFalsy();
    expect(result.table.striped).toBeFalsy();
  });

  test('will have 1 row with 1 cell', () => {
    const result = slateTableBlock(elem);
    const rows = result.table.rows;
    expect(rows).toHaveLength(1);
    expect(rows[0].cells).toHaveLength(1);
    expect(rows[0].cells[0].type).toBe('data');
    expect(rows[0].cells[0].value).toHaveLength(1);
    const value = rows[0].cells[0].value[0];
    expect(value['type']).toBe('p');
    expect(value['children'][0]['text']).toBe('A value');
  });
});
