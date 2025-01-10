// This here is where I can mock up anything I need for testing

const storage = new Map();

const localStorageMock = {
  getItem: (k) => storage.get(k),
  setItem: (k, v) => storage.set(k, v),
  clear: () => storage.clear()
};
const mathJaxMock = {
  Hub: {
    Queue: () => {}
  }
}
global.localStorage = localStorageMock;
global.window = {MathJax: mathJaxMock};
