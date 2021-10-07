import { getYTVideoId } from './video.js';

describe('getYTVideoId returns video id from url', () => {
  test('share url', () => {
    expect(getYTVideoId('https://youtu.be/jn4zGVJq9m0')).toBe('jn4zGVJq9m0');
  });
  test('embed url', () => {
    expect(getYTVideoId('https://www.youtube.com/embed/jn4zGVJq9m0')).toBe(
      'jn4zGVJq9m0',
    );
  });
});
