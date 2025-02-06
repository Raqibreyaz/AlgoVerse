import { drawTree } from "./utils.js";

export class PriorityQueue {
  #array;
  #length;
  isMinHeap;
  constructor(isMinHeap = true) {
    this.#array = new Array();
    this.#length = 0;
    this.isMinHeap = isMinHeap;
  }
  #swap(index1, index2) {
    const temp = this.#array[index1];
    this.#array[index1] = this.#array[index2];
    this.#array[index2] = temp;
  }
  #heapify(index) {
    // when you reached root then stop
    if (index <= 0) return;

    const parentIndex = Math.floor((index - 1) / 2);
    // for min heapify child < parent
    const minHeapify =
      this.isMinHeap && this.#array[index] < this.#array[parentIndex];
    // for maxHepaify child > parent
    const maxHeapify =
      !this.isMinHeap && this.#array[index] > this.#array[parentIndex];

    //   when heapify is required then heapify it
    if (minHeapify || maxHeapify) {
      this.#swap(index, parentIndex);
      this.#heapify(parentIndex);
    }
  }
  topElement() {
    if (this.#length > 0) return this.#array[0];
  }
  size() {
    return this.#length;
  }
  push(data) {
    if (this.#length >= this.#array.length) {
      this.#array.push(data);
    } else {
      this.#array[this.#length] = data;
    }

    this.#heapify(this.#length);
    this.#length++;
  }
  pop() {
    const popRootElement = (index = 0) => {
      // go back when no nodes present
      if (index >= this.#length) return;

      const index1 = index * 2 + 1;
      const index2 = index * 2 + 2;

      // swap with the last node when leaf node found
      if (index1 >= this.#length) {
        this.#length--;
        this.#array[index] = this.#array[this.#length];
        return;
      }

      // here it means not leaf node

      const child1 = this.#array[index1];
      const child2 = index2 < this.#length ? this.#array[index2] : null;

      // take the max from the children
      const maxi = (child2 && (child1 > child2 ? child1 : child2)) || child1;

      // take the minimum from the children
      const mini = (child2 && (child1 < child2 ? child1 : child2)) || child1;

      // when minHeap then give mini else give maxi
      this.#array[index] = this.isMinHeap ? mini : maxi;

      // when child1 is selected then pop in left part else in right part
      this.#array[index] === child1
        ? popRootElement(index1)
        : popRootElement(index2);
    };
    popRootElement();
  }
  show() {
    drawTree(this.#array);
  }
}
