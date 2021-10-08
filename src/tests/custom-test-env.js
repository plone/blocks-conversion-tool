import NodeEnvironment from 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

// A custom environment to set the TextEncoder that is required by our tests.
class CustomTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      this.global.TextDecoder = TextDecoder;
    }
  }
}

export default CustomTestEnvironment;
