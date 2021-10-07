const scaleFromUrl = (url) => {
  let scale = null;
  let scales = null;
  if (url.indexOf('@@images/image') !== -1) {
    scales = url.match(/@@images\/image\/(.*)/);
  } else if (url.indexOf('/image_') !== -1) {
    scales = url.match(/image_(.*)/);
  } else if (url.match(/\/image$/)) {
    scales = [null, 'original'];
  }
  if (scales !== null) {
    scale = scales[1];
    scale = scale.replace(/image_/, '');
  }
  return scale;
};

const alignFromClassName = (className) => {
  var align = 'center';
  if (className.indexOf('image-left') !== -1) {
    align = 'left';
  } else if (className.indexOf('image-right') !== -1) {
    align = 'right';
  } else if (className.indexOf('image-inline') !== -1) {
    align = 'center';
  }
  return align;
};

export { scaleFromUrl, alignFromClassName };
