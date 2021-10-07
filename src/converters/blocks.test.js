import { elementFromString } from '../helpers/tests.js';
import { videoBlock, imageBlock } from './blocks.js';

describe('videoBlock processing', () => {
  test('Internal video', () => {
    const elem = elementFromString(
      '<video src="/video/pass-countdown.ogg" width="170" height="85" controls><p>If you are reading this, it is because your browser does not support the HTML5 video element.</p></video>',
    );
    const result = videoBlock(elem);
    expect(result['@type']).toBe('video');
    expect(result['url']).toBe('/video/pass-countdown.ogg');
  });

  test('External video', () => {
    const elem = elementFromString(
      '<video src="https://plone.org/video.mp4" width="170" height="85" />',
    );
    const result = videoBlock(elem);
    expect(result['@type']).toBe('video');
    expect(result['url']).toBe('https://plone.org/video.mp4');
  });

  test('External video (Youtube)', () => {
    const elem = elementFromString(
      '<video src="https://youtu.be/jn4zGVJq9m0" width="170" height="85" />',
    );
    const result = videoBlock(elem);
    expect(result['@type']).toBe('video');
    expect(result['url']).toBe('https://youtu.be/jn4zGVJq9m0');
  });
});

describe('imageBlock processing', () => {
  test('Image without scale information', () => {
    const elem = elementFromString(
      '<img src="https://plone.org/news/item/@@images/44ae2493-53fb-4221-98dc-98fa38d6851a.jpeg" title="A Picture" alt="Picture of a person" class="image-right">',
    );
    const result = imageBlock(elem);
    expect(result['@type']).toBe('image');
    expect(result['src']).toBe(
      'https://plone.org/news/item/@@images/44ae2493-53fb-4221-98dc-98fa38d6851a.jpeg',
    );
    expect(result['title']).toBe('A Picture');
    expect(result['alt']).toBe('Picture of a person');
    expect(result['size']).toBe('m');
    expect(result['align']).toBe('right');
  });
  test('Image with scale information', () => {
    const elem = elementFromString(
      '<img src="https://plone.org/news/item/@@images/image/thumb" title="A Picture" alt="Picture of a person" class="image-right">',
    );
    const result = imageBlock(elem);
    expect(result['@type']).toBe('image');
    expect(result['src']).toBe(
      'https://plone.org/news/item/@@images/image/thumb',
    );
    expect(result['size']).toBe('s');
    expect(result['align']).toBe('right');
  });
});
