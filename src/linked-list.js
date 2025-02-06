import { drawLinkedList } from "./utils.js";

export class ListNode {
  data;
  next;
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

export class LinkedList {
  #head;
  #tail;
  #length;

  constructor() {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
  }
  //   pushing at last, O(1)
  push(data) {
    const node = new ListNode(data);
    if (this.#head === null) this.#head = this.#tail = node;
    else {
      this.#tail.next = node;
      this.#tail = node;
    }
    this.#length++;
    return this.#tail;
  }
  //   push at front, O(1)
  shift(data) {
    const node = new ListNode(data);
    node.next = this.#head;
    this.#head = node;

    // if tail is pointing at null then point it to the node
    if (!this.#tail) this.#tail = node;

    this.#length++;
    return this.#head;
  }
  //   removing from last, O(N)
  pop() {
    // when there are no nodes
    if (this.#tail === null) {
      return;
    }
    // when there is only one node then point #head and #tail to null
    else if (this.#head === this.#tail) {
      this.#head = this.#tail = null;
    } else {
      // find the second last node and point #tail to it
      let temp = this.#head;
      while (temp.next != this.#tail) {
        temp = temp.next;
      }
      this.#tail = temp;
      // remove the pointer to last node to delete it
      this.#tail.next = null;
    }
    this.#length--;
    return this.#tail;
  }
  //   removing from front, O(1)
  unshift() {
    if (this.#head === null) return;

    const temp = this.#head;
    // point the #head to next node
    this.#head = this.#head.next;

    if (!this.#head) this.#tail = null;

    // remove the link
    temp.next = null;
    this.#length--;
    return this.#head;
  }
  show() {
    drawLinkedList(this.giveAsArray());
  }

  //   will return the list as array
  giveAsArray() {
    const array = new Array();
    let temp = this.#head;
    while (temp != null) {
      array.push(temp.data);
      temp = temp.next;
    }
    return array;
  }
  size() {
    return this.#length;
  }
  frontElement() {
    return this.#head.data;
  }
  backElement() {
    return this.#tail.data;
  }
}
