import converFromDraftJS from './fromDraftjs.js';

describe('convertFromDraftJS parsing draftjs', () => {
  const draftjs = {
    'blocks': [
      {
        'key': 'eeqet', 'text': "Italic text: row 1\xa0", 'type': 'unstyled', 'depth': 0, 'inlineStyleRanges': [
          {
            'offset': 0, 'length': 12, 'style': 'ITALIC'
          }
        ], 'entityRanges': [], 'data': {}
      },
      {
        'key': 'a21jg', 'text': "Bold text: row 1\xa0row 2.", 'type': 'unstyled', 'depth': 0, 'inlineStyleRanges': [
          {
            'offset': 0, 'length': 10, 'style': 'BOLD'
          }
        ], 'entityRanges': [], 'data': {}
      }
    ], 'entityMap': {}
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return an array of blocks', () => {
      expect(result).toBe("<p><em>Italic text:</em> row 1\xa0</p><p><strong>Bold text:</strong> row 1\xa0row 2.</p>");
    });
  });
});

describe('convertFromDraftJS parsing draftjs headings', () => {
  const draftjs = {
    'blocks': [
      {
        "key": "1eesh",
        "text": "heading 1",
        "type": "header-one",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
      },
      {
        "key": "2eesh",
        "text": "heading 2",
        "type": "header-two",
        "depth": 0,
        "inlineStyleRanges": [{
          'offset': 0, 'length': 4, 'style': 'ITALIC'
        }],
        "entityRanges": [],
        "data": {}
      },
      {
        "key": "3eesh",
        "text": "heading 3",
        "type": "header-three",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
      },
      {
        "key": "4eesh",
        "text": "heading 4",
        "type": "header-four",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
      },
    ], 'entityMap': {}
  };
  describe('with html converter', () => {
    const result = converFromDraftJS(draftjs);

    test('will return an array of blocks', () => {
      expect(result).toBe("<h1>heading 1</h1><h2><em>head</em>ing 2</h2><h3>heading 3</h3><h4>heading 4</h4>");
    });
  });
});
