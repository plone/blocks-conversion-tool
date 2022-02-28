import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const DOMParser = new JSDOM().window.DOMParser;
const parser = new DOMParser();

const elementFromString = (value) => {
  const elem = parser.parseFromString(value, 'text/html').body
    .firstElementChild;
  return elem;
};

export { elementFromString };
