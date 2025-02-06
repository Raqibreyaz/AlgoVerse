import { drawStack } from "./utils.js";

export class Stack {
  #top;
  #array;
  constructor(size = 0) {
    this.#top = -1;
    this.#array = new Array(size);
  }

  size() {
    return this.#top + 1;
  }

  push(element) {
    this.#top++;
    if (this.#array.length <= this.#top) this.#array.push(element);
    else this.#array[this.#top] = element;
  }

  pop() {
    if (this.#top !== -1) {
      const popped = this.#array[this.#top];
      this.#array[this.#top--] = null;
      return popped;
    }
  }

  topElement() {
    if (this.#top < this.#array.length) return this.#array[this.#top];
  }

  show() {
    drawStack(this.#array);
  }
}
