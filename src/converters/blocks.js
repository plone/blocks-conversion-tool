const getYTVideoId = (url) => {
  let id = '';
  url = url
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    id = url[2].split(/[^0-9a-z_-]/i);
    id = id[0];
  }
  return id;
};

const imageBlock = (elem) => {
  const block = {
    '@type': 'image',
    alt: elem.alt,
    title: elem.title,
  };
  const src = elem.src;
  let scales = null;
  if (src.indexOf('@@images/image') !== -1) {
    scales = src.match(/@@images\/image\/(.*)/);
  } else if (src.indexOf('/image_') !== -1) {
    scales = src.match(/image_(.*)/);
  }
  if (elem.dataset.href != null) {
    block.href = elem.dataset.href;
  }
  if (elem.className.indexOf('image-left') !== -1) {
    block.align = 'left';
    block.size = 'm';
  } else if (elem.className.indexOf('image-right') !== -1) {
    block.align = 'right';
    block.size = 'm';
  } else if (elem.className.indexOf('image-inline') !== -1) {
    block.align = 'center';
    block.size = 'l';
  } else {
    block.align = 'center';
    block.size = 'l';
  }

  if (scales !== null) {
    const scale = scales[1];
    switch (scale) {
      case 'large':
      case 'image_large':
        block.size = 'l';
        break;
      case 'thumb':
      case 'image_thumb':
      case 'tile':
      case 'image_tile':
        block.size = 's';
        break;
      default:
        block.size = 'm';
        break;
    }
  }
  block.url = src;
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
  const src = elem.src;
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

export { iframeBlock, imageBlock, videoBlock };
