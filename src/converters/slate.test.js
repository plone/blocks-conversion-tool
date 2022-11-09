import { elementFromString } from '../helpers/dom.js';
import { slateTableBlock, slateTextBlock } from './slate.js';

describe('slateTextBlock processing a paragraph', () => {
  describe('with a simple text', () => {
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

  describe('with a nested structure of elements', () => {
    const elem = elementFromString(
      '<p><strong>Arrival by car:</strong> A 1 Autobahn network (East and West) easily accessible from all directions (toll sticker - compulsory „Vignette“ - required on all motorways!) to St. Pölten then take the  <span class="renderable-component">L5122 till Neidling </span></p>',
    );

    test('will have @type as slate', () => {
      const result = slateTextBlock(elem);
      expect(result['@type']).toBe('slate');
    });

    test('will extract the text from the element', () => {
      const result = slateTextBlock(elem);
      expect(result.plaintext).toBe(
        'Arrival by car: A 1 Autobahn network (East and West) easily accessible from all directions (toll sticker - compulsory „Vignette“ - required on all motorways!) to St. Pölten then take the  L5122 till Neidling ',
      );
    });

    test('will have a nested structure in the value with 2 elements', () => {
      const result = slateTextBlock(elem);
      const valueElement = result.value[0];
      expect(valueElement['type']).toBe('p');
      expect(valueElement.children).toHaveLength(2);
    });

    test('will have a nested structure, and the first element of the value will be a p', () => {
      const result = slateTextBlock(elem);
      const valueElement = result.value[0].children[0];
      expect(valueElement['type']).toBe('span');
      expect(valueElement.children).toHaveLength(2);
      expect(valueElement.children[0]['type']).toBe('strong');
      expect(valueElement.children[0]['children'][0]['text']).toBe(
        'Arrival by car:',
      );
      expect(valueElement.children[1]['text']).toContain(
        '1 Autobahn network (East and West) easily accessible',
      );
    });

    test('will have a nested structure, and the first element of the value will be a span', () => {
      const result = slateTextBlock(elem);
      const valueElement = result.value[0].children[1];
      expect(valueElement['type']).toBe('span');
      expect(valueElement.children).toHaveLength(1);
      expect(valueElement.children[0]['text']).toBe('L5122 till Neidling ');
    });
  });

  describe('with a nested structure of elements including links', () => {
    const elem = elementFromString(
      '<p><strong>Follow Plone and Plone Conference on Twitter <a href="https://twitter.com/plone" title="Plone Twitter">@plone</a> and <a href="https://twitter.com/ploneconf" title="Twitter">@ploneconf</a> and hastag #ploneconf2021</strong></p>',
    );

    test('will have @type as slate', () => {
      const result = slateTextBlock(elem);
      expect(result['@type']).toBe('slate');
    });

    test('will have only a paragraph as child', () => {
      const result = slateTextBlock(elem);
      expect(result.value).toHaveLength(1);
      expect(result.value[0]['type']).toBe('p');
    });

    test('will have one sub element inside the paragraph', () => {
      const result = slateTextBlock(elem);
      const valueElementChildren = result.value[0]['children'];
      expect(valueElementChildren).toHaveLength(1);
      expect(valueElementChildren[0]['type']).toBe('strong');
    });

    test('will have nested elements inside strong', () => {
      const result = slateTextBlock(elem);
      const valueElementChildren = result.value[0]['children'][0]['children'];
      expect(valueElementChildren).toHaveLength(5);
      expect(valueElementChildren[0]['text']).toBe(
        'Follow Plone and Plone Conference on Twitter ',
      );
      expect(valueElementChildren[1]['type']).toBe('link');
      expect(valueElementChildren[2]['text']).toBe(' and ');
      expect(valueElementChildren[3]['type']).toBe('link');
      expect(valueElementChildren[4]['text']).toBe(
        ' and hastag #ploneconf2021',
      );
    });
  });
});

describe('slateTextBlock processing a simple pre block', () => {
  const elem = elementFromString(
    '<pre>Plone Foundation: https://plone.org/</pre>',
  );

  test('will have a nested structure in the value', () => {
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('pre');
    expect(valueElement['children'][0]['text']).toBe(
      'Plone Foundation: https://plone.org/',
    );
  });
});

describe('slateTextBlock processing a pre block with nested code element', () => {
  const elem = elementFromString('<pre><code>import this</code></pre>');

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
    expect(valueElement['type']).toBe('blockquote');
    const nestedValueElement = valueElement.children[0];
    expect(nestedValueElement['type']).toBe('p');
    expect(nestedValueElement['children'][0]['text']).toContain(
      'Words can be like X-ray',
    );
  });
});

describe('slateTextBlock processing a span', () => {
  test('with a text value', () => {
    const elem = elementFromString('<span>Hello world!</span>');
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('span');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });

  test('with an empty text value', () => {
    const elem = elementFromString('<span>\n</span>');
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['text']).toBe(' ');
  });

  test('with other inline elements', () => {
    const elem = elementFromString(
      '<span>Hello <strong>world</strong>!</span>',
    );
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('span');
    expect(valueElement['children'][0]['text']).toBe('Hello ');
    expect(valueElement['children'][1]['type']).toBe('strong');
    expect(valueElement['children'][1]['children'][0]['text']).toBe('world');
    expect(valueElement['children'][2]['text']).toBe('!');
  });

  test('with google docs style for sup', () => {
    const elem = elementFromString(
      '<span style="vertical-align:sup">Hello world!</span>',
    );
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('span');
    const supElement = valueElement.children[0];
    expect(supElement['type']).toBe('sup');
    expect(supElement['children'][0]['text']).toBe('Hello world!');
  });

  test('with google docs style for sub', () => {
    const elem = elementFromString(
      '<span style="vertical-align:sub">Hello world!</span>',
    );
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('span');
    const supElement = valueElement.children[0];
    expect(supElement['type']).toBe('sub');
    expect(supElement['children'][0]['text']).toBe('Hello world!');
  });
});

describe('slateTextBlock processing a div', () => {
  test('with a text value', () => {
    const elem = elementFromString('<div>Hello world!</div>');
    const result = slateTextBlock(elem);
    expect(result.value).toHaveLength(1);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('p');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });

  test('with a nested paragraph value', () => {
    const elem = elementFromString('<div><p>Hello world!</p></div>');
    const result = slateTextBlock(elem);
    expect(result.value).toHaveLength(1);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('p');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });

  describe('with nested paragraphs', () => {
    const elem = elementFromString('<div><p>Hello</p> <p>world!</p></div>');
    const result = slateTextBlock(elem);

    test('will have 3 elements', () => {
      expect(result.value).toHaveLength(3);
    });

    test('will have a paragraph as first element', () => {
      const valueElement = result.value[0];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toBe('Hello');
    });

    test('will have a paragraph as second element', () => {
      const valueElement = result.value[1];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toBe(' ');
    });

    test('will have a paragraph as third element', () => {
      const valueElement = result.value[2];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toBe('world!');
    });
  });

  describe('with nested div', () => {
    const elem = elementFromString('<div><div>Hello world!</div></div>');
    const result = slateTextBlock(elem);

    test('will have 1 elements', () => {
      expect(result.value).toHaveLength(1);
    });

    test('will have a paragraph as first element', () => {
      const valueElement = result.value[0];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toBe('Hello world!');
    });
  });

  describe('with nested div and nested paragraphs', () => {
    const elem = elementFromString(
      '<div><div><p>Hello</p> <p>world!</p></div></div>',
    );
    const result = slateTextBlock(elem);

    test('will have 3 elements', () => {
      expect(result.value).toHaveLength(3);
    });

    test('will have a paragraph as first element', () => {
      const valueElement = result.value[0];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toBe('Hello');
    });

    test('will have a paragraph as second element', () => {
      const valueElement = result.value[1];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toBe(' ');
    });

    test('will have a paragraph as third element', () => {
      const valueElement = result.value[2];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toBe('world!');
    });
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
  test('will have a nested structure in the value', () => {
    const elem = elementFromString('<h2>Hello world!</h2>');
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('h2');
    expect(valueElement['children'][0]['text']).toBe('Hello world!');
  });

  test('will ignore img element in the structure', () => {
    const elem = elementFromString(
      '<h2 id="chrissy"><img src="https://plone.org/foundation/meetings/membership/2019-membership-meeting/nominations/img4_08594.jpg/@@images/7a07f0e5-0fd7-4366-a32d-6b033c8dfce7.jpeg" title="Chrissy Wainwright 2019" alt="Chrissy Wainwright 2019" class="image-right">Chrissy Wainwright</h2>',
    );
    const result = slateTextBlock(elem);
    const valueElement = result.value[0];
    expect(valueElement['type']).toBe('h2');
    expect(valueElement['children'][0]['text']).toBe('Chrissy Wainwright');
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
    expect(valueElement['type']).toBe('link');
    expect(valueElement['data']['url']).toBe('https://plone.org/');
    expect(valueElement['data']['title']).toBe('Plone website');
    expect(valueElement['data']['target']).toBe('_blank');
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
    expect(rows[0].key).toBeDefined();
    expect(rows[0].cells).toHaveLength(1);
    expect(rows[0].cells[0].key).toBeDefined();
    expect(rows[0].cells[0].type).toBe('data');
    expect(rows[0].cells[0].value).toHaveLength(1);
    const value = rows[0].cells[0].value[0];
    expect(value['type']).toBe('p');
    expect(value['children'][0]['text']).toBe('A value');
  });
});

describe('slateTableBlock processing a table with whitespace', () => {
  const elem = elementFromString(
    '<table><tr><td>A value<br>&nbsp;</td></tr></table>',
  );

  test('will remove the whitespace', () => {
    const result = slateTableBlock(elem);
    const rows = result.table.rows;
    expect(rows).toHaveLength(1);
    const cells = rows[0].cells;
    expect(cells).toHaveLength(1);
    const cell = cells[0];
    expect(cell.value).toEqual([
      { type: 'p', children: [{ text: 'A value' }] },
      { type: 'p', children: [{ text: '\n' }] },
    ]);
  });
});

describe('slateTableBlock processing a table with a link', () => {
  const elem = elementFromString(
    '<table><tr><td><a href="https://plone.org">Plone</a></td></tr></table>',
  );

  test('will have @type as slateTable', () => {
    const result = slateTableBlock(elem);
    expect(result['@type']).toBe('slateTable');
  });

  test('will have 1 row with 1 cell with link value', () => {
    const result = slateTableBlock(elem);
    const rows = result.table.rows;
    expect(rows).toHaveLength(1);
    expect(rows[0].cells).toHaveLength(1);
    expect(rows[0].cells[0].type).toBe('data');
    expect(rows[0].cells[0].value).toHaveLength(1);
    const value = rows[0].cells[0].value[0];
    expect(value['type']).toBe('link');
    expect(value['data']['url']).toBe('https://plone.org');
    expect(value['children'][0]['text']).toBe('Plone');
  });
});

describe('slateTableBlock processing a table with a link', () => {
  const elem = elementFromString(
    '<table><tr><td>Plone <a href="https://plone.org">site</a></td></tr></table>',
  );

  test('will have @type as slateTable', () => {
    const result = slateTableBlock(elem);
    expect(result['@type']).toBe('slateTable');
  });

  test('will have 1 row with 1 cell with 2 children values', () => {
    const result = slateTableBlock(elem);
    const rows = result.table.rows;
    expect(rows).toHaveLength(1);
    expect(rows[0].cells).toHaveLength(1);
    expect(rows[0].cells[0].type).toBe('data');
    expect(rows[0].cells[0].value).toHaveLength(2);
  });

  test('first value is a text', () => {
    const result = slateTableBlock(elem);
    const rows = result.table.rows;
    let value = rows[0].cells[0].value[0];
    expect(value['type']).toBe('p');
    expect(value['children'][0]['text']).toBe('Plone ');
  });

  test('second value is the link', () => {
    const result = slateTableBlock(elem);
    const rows = result.table.rows;
    let value = rows[0].cells[0].value[1];
    expect(value['type']).toBe('link');
    expect(value['data']['url']).toBe('https://plone.org');
    expect(value['children'][0]['text']).toBe('site');
  });

  describe('slateTextBlock processing a hr tag', () => {
    const elem = elementFromString('<hr>');

    test('will have @type as slate', () => {
      const result = slateTextBlock(elem);
      expect(result['@type']).toBe('slate');
    });

    test('will have an empty string for plaintext', () => {
      const result = slateTextBlock(elem);
      expect(result.plaintext).toBe('');
    });

    test('will have a nested structure in the value', () => {
      const result = slateTextBlock(elem);
      const valueElement = result.value[0];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toBe('');
    });
  });
});
