import { Graph } from "./src/graph.js";
import { LinkedList } from "./src/linked-list.js";
import { PriorityQueue } from "./src/priority-queue.js";

const ll = new LinkedList()

ll.push(10);
ll.push(11);
ll.push(23);
ll.push(4);
ll.push(3);
ll.push(12);
ll.push(15);

ll.show()

const pq = new PriorityQueue(false)

pq.push(10)
pq.push(11)
pq.push(23)
pq.push(4)
pq.push(3)
pq.push(12);
pq.push(15);
pq.push(29);
pq.push(41);

pq.show()

const edges = [
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 3],
  [1, 5],
  [2, 3],
  [2, 0],
  [3, 1],
  [3, 2],
  [3, 4],
  [3, 5],
  [4, 3],
  [4, 5],
  [5, 4],
  [5, 1],
  [5, 3],
];

const graph = new Graph(edges);

graph.show();

console.log(graph.graph)

import {Stack} from './src/stack.js'

const stack = new Stack()

stack.push(10)
stack.push(10)
stack.push(10)
stack.push(20);
stack.push(20);
stack.push(20);
stack.push(20);
stack.push(20);
stack.push(30);
stack.push(30);

stack.show()

import { Queue } from "./src/queue.js";

const queue = new Queue();

queue.push(15);
queue.push(14);
queue.push(14);
queue.push(13);
queue.push(100);

queue.show();
