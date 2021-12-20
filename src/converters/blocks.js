import { alignFromClassName, scaleFromUrl } from '../helpers/image.js';
import { getYTVideoId } from '../helpers/video.js';

const imageBlock = (elem) => {
  const block = {
    '@type': 'image',
    url: elem.src,
    alt: elem.alt,
    title: elem.title,
  };

  if (elem.dataset.href != null) {
    block.href = elem.dataset.href;
  }

  switch (alignFromClassName(elem.className)) {
    case 'left':
      block.align = 'left';
      block.size = 'm';
      break;
    case 'right':
      block.align = 'right';
      block.size = 'm';
      break;
    case 'center':
      block.align = 'center';
      block.size = 'l';
      break;
  }

  const scale = scaleFromUrl(elem.src);
  if (scale !== null) {
    switch (scale) {
      case 'large':
        block.size = 'l';
        break;
      case 'thumb':
      case 'tile':
        block.size = 's';
        break;
      default:
        block.size = 'm';
        break;
    }
  }
  return block;
};

const iframeBlock = (elem) => {
  const youtubeId = getYTVideoId(elem.src);
  const block = {};
  if (youtubeId.length === 0) {
    block['@type'] = 'html';
    block.html = elem.outerHTML;
  } else {
    block['@type'] = 'video';
    block.url = `https://youtu.be/${youtubeId}`;
  }
  return block;
};

const videoBlock = (elem) => {
  let src = elem.src;
  if (src === '') {
    // If src is empty search for the first source element
    const child = elem.firstElementChild;
    if (child.tagName === 'SOURCE') {
      src = child.src;
    }
  }
  const youtubeId = getYTVideoId(src);
  const block = {
    '@type': 'video',
  };
  if (youtubeId.length === 0) {
    block.url = src;
  } else {
    block.url = `https://youtu.be/${youtubeId}`;
  }
  return block;
};

export { iframeBlock, imageBlock, videoBlock, getYTVideoId };
