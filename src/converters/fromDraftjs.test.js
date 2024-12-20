import converFromDraftJS from './fromDraftjs.js';

describe('convertFromDraftJS parsing draftjs', () => {
  const draftjs = {
    blocks: [
      {
        key: 'eeqet',
        text: 'Italic text: row 1\xa0',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 12,
            style: 'ITALIC',
          },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: 'a21jg',
        text: 'Bold text: row 1\xa0row 2.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 10,
            style: 'BOLD',
          },
        ],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return an array of blocks', () => {
      expect(result).toBe(
        '<p><em>Italic text:</em> row 1\xa0</p><p><strong>Bold text:</strong> row 1\xa0row 2.</p>',
      );
    });
  });
});

describe('convertFromDraftJS parsing draftjs headings', () => {
  const draftjs = {
    blocks: [
      {
        key: '1eesh',
        text: 'heading 1',
        type: 'header-one',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: '2eesh',
        text: 'heading 2',
        type: 'header-two',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 4,
            style: 'ITALIC',
          },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: '3eesh',
        text: 'heading 3',
        type: 'header-three',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: '4eesh',
        text: 'heading 4',
        type: 'header-four',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return an array of blocks', () => {
      expect(result).toBe(
        '<h1>heading 1</h1><h2><em>head</em>ing 2</h2><h3>heading 3</h3><h4>heading 4</h4>',
      );
    });
  });
});

describe('convertFromDraftJS parsing draftjs callout', () => {
  const draftjs = {
    blocks: [
      {
        key: '15ghc',
        text: 'Callout text with bold',
        type: 'callout',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 22,
            style: 'BOLD',
          },
        ],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return a <blockquote> tag', () => {
      expect(result).toBe(
        '<blockquote><p><strong>Callout text with bold</strong></p></blockquote>',
      );
    });
  });
});

describe('convertFromDraftJS parsing draftjs link with button', () => {
  const draftjs = {
    blocks: [
      {
        key: '52ck5',
        text: 'xxx',
        type: 'buttons',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [
          {
            offset: 0,
            length: 3,
            key: 0,
          },
        ],
        data: {},
      },
    ],
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          url: 'https://www.plone.org',
          dataElement: '',
        },
      },
    },
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return a <a> tag with some css classes', () => {
      expect(result).toBe(
        '<p><a key="0" href="https://www.plone.org" data-element="" class="btn btn-primary inline-link">xxx</a></p>',
      );
    });
  });
});

describe('convertFromDraftJS parsing draftjs text larger', () => {
  const draftjs = {
    blocks: [
      {
        key: 'ejhvs',
        text: 'large',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 5,
            style: 'TEXT_LARGER',
          },
        ],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return a tag with css class fixed', () => {
      expect(result).toBe('<p><span class="text-larger">large</span></p>');
    });
  });
});

describe('convertFromDraftJS parsing draftjs link with data-element', () => {
  const draftjs = {
    blocks: [
      {
        key: '8habq',
        text: 'link',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [
          {
            offset: 0,
            length: 4,
            key: 0,
          },
        ],
        data: {},
      },
    ],
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          url: 'http://www.google.it',
          dataElement: 'faq',
        },
      },
    },
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return a tag with css class fixed', () => {
      expect(result).toBe(
        '<p><a key="0" href="http://www.google.it" data-element="faq">link</a></p>',
      );
    });
  });
});

describe('convertFromDraftJS parsing draftjs simple unordered list', () => {
  const draftjs = {
    blocks: [
      {
        key: 'ocnj',
        text: 'aaa',
        type: 'unordered-list-item',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: 'b3af',
        text: 'bbb',
        type: 'unordered-list-item',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return an ul', () => {
      expect(result).toBe('<ul><li key=0>aaa</li> <li key=1>bbb</li></ul>');
    });
  });
});

describe('convertFromDraftJS parsing draftjs complex unordered list', () => {
  const draftjs = {
    blocks: [
      {
        key: '8l7dd',
        text: 'aaa',
        type: 'unordered-list-item',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 3,
            style: 'BOLD',
          },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: '772ns',
        text: 'bbb',
        type: 'unordered-list-item',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [
          {
            offset: 0,
            length: 3,
            key: 0,
          },
        ],
        data: {},
      },
    ],
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          url: 'http://www.plone.org',
          dataElement: '',
        },
      },
    },
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return an ul', () => {
      expect(result).toBe(
        '<ul><li key=0><strong>aaa</strong></li> <li key=1><a key="0" href="http://www.plone.org" data-element="">bbb</a></li></ul>',
      );
    });
  });
});

describe('convertFromDraftJS parsing draftjs simple ordered list', () => {
  const draftjs = {
    blocks: [
      {
        key: 'ocnj',
        text: 'aaa',
        type: 'ordered-list-item',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: 'b3af',
        text: 'bbb',
        type: 'ordered-list-item',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return an ul', () => {
      expect(result).toBe('<ol><li key=0>aaa</li> <li key=1>bbb</li></ol>');
    });
  });
});

describe('convertFromDraftJS parsing draftjs complex ordered list', () => {
  const draftjs = {
    blocks: [
      {
        key: '8l7dd',
        text: 'aaa',
        type: 'ordered-list-item',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 3,
            style: 'BOLD',
          },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: '772ns',
        text: 'bbb',
        type: 'ordered-list-item',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [
          {
            offset: 0,
            length: 3,
            key: 0,
          },
        ],
        data: {},
      },
    ],
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          url: 'http://www.plone.org',
          dataElement: '',
        },
      },
    },
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return an ul', () => {
      expect(result).toBe(
        '<ol><li key=0><strong>aaa</strong></li> <li key=1><a key="0" href="http://www.plone.org" data-element="">bbb</a></li></ol>',
      );
    });
  });
});

describe('convertFromDraftJS parsing draftjs blockquote', () => {
  const draftjs = {
    blocks: [
      {
        data: {},
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: 'aqfh8',
        text: 'text',
        type: 'blockquote',
      },
    ],
    entityMap: {},
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);
    test('will return a blockquote tag', () => {
      expect(result).toBe('<blockquote class="blockquote">text</blockquote>');
    });
  });
});

// describe('prova', () => {
//   const draftjs = {
//     blocks: [
//       {
//         data: {},
//         depth: 0,
//         entityRanges: [
//           {
//             key: 0,
//             length: 5,
//             offset: 18,
//           },
//         ],
//         inlineStyleRanges: [
//           {
//             length: 5,
//             offset: 6,
//             style: 'BOLD',
//           },
//           {
//             length: 5,
//             offset: 12,
//             style: 'TEXT_LARGER',
//           },
//         ],
//         key: 'i5b8',
//         text: 'Testo testo testo testo ',
//         type: 'unstyled',
//       },
//     ],
//     entityMap: {
//       0: {
//         data: {
//           dataElement: '',
//           url: 'http://www.google.it',
//         },
//         mutability: 'MUTABLE',
//         type: 'LINK',
//       },
//     },
//   };
//   describe('with html converter', () => {
//     const result = converFromDraftJS(draftjs);
//     test('will return something', () => {
//       expect(result).toBe('');
//     });
//   });
// });
