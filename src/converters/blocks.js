import { alignFromClassName, scaleFromUrl } from '../helpers/image.js';
import { getYTVideoId } from '../helpers/video.js';
import { slateTextBlock } from './slate.js';

const imageBlock = (elem, href) => {
  // strip /@@images/image if present
  const url = elem.src.split('/@@images')[0];

  const block = {
    '@type': 'image',
    url,
    alt: elem.alt,
    title: elem.title,
  };

  if (href) {
    const title = href.split('://')[1];
    block.href = [
      {
        '@id': href,
        title: title,
      },
    ];
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

  // pass through data attributes to block data
  for (const [k, v] of Object.entries(elem.dataset)) {
    block[k] = v;
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

const calloutBlock = (elem) => {
  const convertedChild = slateTextBlock(elem).value[0].children;
  let value = convertedChild.map((x) => {
    if (!x.type) {
      return { type: 'p', children: [x] };
    }
    return x;
  });

  const block = {
    '@type': 'callout_block',
    style: 'base',
    icon: 'it-info-circle',
    title: '',
    text: value,
    color: 'default',
  };
  return block;
};

const elementsWithConverters = {
  IMG: imageBlock,
  VIDEO: videoBlock,
  IFRAME: iframeBlock,
  Q: calloutBlock,
};

export {
  calloutBlock,
  iframeBlock,
  imageBlock,
  videoBlock,
  getYTVideoId,
  elementsWithConverters,
};
