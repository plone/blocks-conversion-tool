import { alignFromClassName, scaleFromUrl } from './image.js';

describe('alignFromClassName should return align value', () => {
  test('image-right returns right', () => {
    expect(alignFromClassName('image-right')).toBe('right');
  });
  test('image-left returns left', () => {
    expect(alignFromClassName('image-left')).toBe('left');
  });
  test('image-inline returns left', () => {
    expect(alignFromClassName('image-inline')).toBe('center');
  });
  test('other value returns center', () => {
    expect(alignFromClassName('lazyLoad')).toBe('center');
  });
});

describe('scaleFromUrl should parse url and return the scale', () => {
  test('New style scale should return null', () => {
    expect(
      scaleFromUrl(
        'https://plone.org/news/item/@@images/f392049f-b5ba-4bdc-94c1-525a1314e87f.jpeg',
      ),
    ).toBe(null);
  });

  test('Old style scale should return the scale name', () => {
    expect(
      scaleFromUrl('https://plone.org/news/item/@@images/image/thumb'),
    ).toBe('thumb');
  });

  test('Old style scale should return the scale name', () => {
    expect(scaleFromUrl('https://plone.org/news/item/image_thumb')).toBe(
      'thumb',
    );
  });

  test('Access to the image field should return scale name as original', () => {
    expect(scaleFromUrl('https://plone.org/news/item/image')).toBe('original');
  });

  test('Relative paths should not be an issue', () => {
    expect(scaleFromUrl('news/item/image_thumb')).toBe('thumb');
  });
});
