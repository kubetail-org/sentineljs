import { expect } from '@esm-bundle/chai';
import sentinel from '../src/sentinel.js';

describe('SentinelJS', () => {
  let testEl;

  beforeEach(() => {
    sentinel.reset();
    testEl = document.createElement('div');
    testEl.className = 'test-div';
    document.body.appendChild(testEl);
  });

  afterEach(() => {
    testEl.remove();
    sentinel.reset();
  });

  it('detects new nodes (async)', async () => {
    return new Promise(resolve => {
      sentinel.on('.test-div', (el) => {
        expect(el).to.equal(testEl);
        resolve();
      });
      
      // Trigger animation by re-inserting
      testEl.remove();
      document.body.appendChild(testEl);
    });
  });
});