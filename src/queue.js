import { drawQueue } from "./utils.js";
import { LinkedList, ListNode } from "./linked-list.js";

export class Queue {
  #length;
  #front;
  #back;
  constructor() {
    // create a linked list
    const ll = new LinkedList();

    // initially front and back will point to null and length is 0
    this.#front = null;
    this.#back = null;
    this.#length = 0;

    // will push the data at back of queue, update length
    this.push = (data) => {
      this.#length++;
      this.#back = ll.push(data);
      if (!this.#front) this.#front = this.#back;
    };

    // will remove the front element from the queue and update length
    this.pop = () => {
      this.#length--;
      this.#front = ll.unshift();
      // when queue become empty then both front and back will point to same null
      if (!this.#front) this.#back = this.#front;
    };

    // will give the queue as an array
    this.giveAsArray = () => ll.giveAsArray();
  }
  topElement() {
    return this.#front.data;
  }
  bottomElement() {
    return this.#back.data;
  }
  show() {
    drawQueue(this.giveAsArray());
  }
  size() {
    return this.#length;
  }
}
