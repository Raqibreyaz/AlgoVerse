'use strict';

const svg = d3.select("#visualizer-svg");

const boxSize = 60;
const startY = screen.height * 0.8;

function updateSVGSize(width, height) {
  svg
    .attr("width", Math.max(width, 500))
    .attr("height", Math.max(height, window.innerHeight));
}

function drawLinkedList(array) {
  svg.selectAll("*").remove(); // Clear previous visualization

  const nodeSpacing = 80; // Space between nodes
  const startX = 50; // Initial position
  const totalNodes = array.length;
  const requiredWidth = totalNodes * nodeSpacing + startX;

  // Set the SVG container width dynamically
  svg
    .attr("width", Math.max(requiredWidth, 500)) // Ensure minimum width
    .attr("height", 250); // Keep height fixed

  for (let i = 0; i < array.length; i++) {
    const x = startX + i * nodeSpacing; // Calculate X position

    // Draw node (array element)
    svg
      .append("rect")
      .attr("x", x)
      .attr("y", 100)
      .attr("width", 50)
      .attr("height", 50)
      .style("fill", "lightblue")
      .style("stroke", "black");

    // Draw value inside the node
    svg
      .append("text")
      .attr("x", x + 25)
      .attr("y", 130)
      .attr("text-anchor", "middle")
      .text(array[i]);

    // Draw arrows between nodes
    if (i < array.length - 1) {
      svg
        .append("line")
        .attr("x1", x + 50)
        .attr("y1", 125)
        .attr("x2", x + nodeSpacing)
        .attr("y2", 125)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");

      // Define arrow marker
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 8)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .style("fill", "black");
    }
  }
}

function drawStack(dataset) {
  svg.selectAll("*").remove(); // Clear previous visualization
  updateSVGSize(
    200,
    Math.max(startY + 50, dataset.length * boxSize + 50, window.innerHeight)
  );
  const group = svg
    .selectAll("g")
    .data(dataset, (d, i) => i)
    .enter()
    .append("g");
  group
    .append("rect")
    .attr("width", 80)
    .attr("height", boxSize)
    .attr("x", 60)
    .attr("y", (d, i) => startY - i * boxSize)
    .attr("class", "box");
  group
    .append("text")
    .attr("x", 100)
    .attr("y", (d, i) => startY - i * boxSize + 30)
    .attr("class", "text")
    .text((d) => d);
}

function drawQueue(dataset) {
  svg.selectAll("*").remove();
  updateSVGSize(dataset.length * boxSize, 100);
  const group = svg
    .selectAll("g")
    .data(dataset, (d, i) => i)
    .enter()
    .append("g");
  group
    .append("rect")
    .attr("width", boxSize)
    .attr("height", 50)
    .attr("x", (d, i) => i * boxSize)
    .attr("y", 30)
    .attr("class", "box");
  group
    .append("text")
    .attr("x", (d, i) => i * boxSize + boxSize / 2)
    .attr("y", 60)
    .attr("class", "text")
    .text((d) => d);
}

function drawTree(dataset) {
  if (dataset.length === 0) return;

  function buildTree(arr) {
    if (arr.length === 0) return null;
    let nodes = arr.map((val, index) => ({ id: val, index, children: [] }));
    for (let i = 0; i < nodes.length; i++) {
      let leftIndex = 2 * i + 1;
      let rightIndex = 2 * i + 2;
      if (leftIndex < nodes.length) nodes[i].children.push(nodes[leftIndex]);
      if (rightIndex < nodes.length) nodes[i].children.push(nodes[rightIndex]);
    }
    return nodes[0];
  }

  const root = d3.hierarchy(buildTree(dataset));
  const treeLayout = d3.tree().size([600, 300]);
  treeLayout(root);
  updateSVGSize(700, 400);

  svg.selectAll("*").remove();
  svg
    .selectAll("line")
    .data(root.links())
    .enter()
    .append("line")
    .attr("x1", (d) => d.source.x + 100)
    .attr("y1", (d) => d.source.y + 50)
    .attr("x2", (d) => d.target.x + 100)
    .attr("y2", (d) => d.target.y + 50)
    .attr("class", "link");
  svg
    .selectAll("circle")
    .data(root.descendants())
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x + 100)
    .attr("cy", (d) => d.y + 50)
    .attr("r", 20)
    .attr("class", "node");
  svg
    .selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("x", (d) => d.x + 100)
    .attr("y", (d) => d.y + 55)
    .attr("class", "text")
    .text((d) => d.data.id);
}
function drawGraph(graph) {
  if (!graph || graph.nodes.length === 0 || graph.links.length === 0) return;

  const width = 800,
    height = 500;
  updateSVGSize(width, height); // Ensure this function exists

  svg.selectAll("*").remove(); // Clear previous drawings

  // Convert `source` & `target` from IDs to actual node references
  const nodes = graph.nodes;
  const links = graph.links.map((d) => ({
    source: nodes.find((n) => n.id === d.source),
    target: nodes.find((n) => n.id === d.target),
    weight: d.weight, // Store the weight value
  }));

  // Force simulation
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Draw edges (links)
  const link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "#999")
    .attr("stroke-width", 2);

  // Draw nodes
  const node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 20)
    .attr("fill", "#69b3a2")
    .call(
      d3.drag().on("start", dragStart).on("drag", dragged).on("end", dragEnd)
    );

  // Add node labels (IDs)
  const label = svg
    .selectAll(".text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .attr("dy", 5)
    .text((d) => d.id);

  // **NEW**: Add edge weight labels
  const weightLabel = svg
    .selectAll(".weight")
    .data(links)
    .enter()
    .append("text")
    .attr("class", "weight")
    .attr("text-anchor", "middle")
    .attr("fill", "red") // Red color for better visibility
    .attr("font-size", "17px")
    .text((d) => d.weight); // Display weight value

  // Update positions on simulation tick
  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    label.attr("x", (d) => d.x).attr("y", (d) => d.y);

    // **Update position of weight labels**
    weightLabel
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);
  });

  // Dragging functions
  function dragStart(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnd(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

class ListNode {
  data;
  next;
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
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

class PriorityQueue {
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

class Queue {
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
  top() {
    return this.#front.data;
  }
  bottom() {
    return this.#back.data;
  }
  show() {
    drawQueue(this.giveAsArray());
  }
  size() {
    return this.#length;
  }
}

class Stack {
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

class Edge {
  source;
  target;
  weight;
  constructor(src, target, wt = 1) {
    this.source = src + "";
    this.target = target + "";
    this.weight = wt ;
  }
}

class Graph {
  graph;
  constructor(edges) {
    // graph will be an object
    this.graph = {};
    const graph = {};
    // adding the edges to graph
    edges.forEach((edge) => {
      if (!graph[edge[0]]) {
        graph[edge[0]] = [];
      }
      graph[edge[0]].push(new Edge(edge[0], edge[1], edge[2] ?? 1));
    });
    this.graph = graph;
  }
  getNodes() {
    return Object.keys(this.graph);
  }
  getEdges() {
    const graph = this.graph;
    let edges = [];
    this.getNodes().forEach((node) => {
      edges = [...edges, ...graph[node]];
    });
    return edges;
  }
  DFS(src) {
    // when invalid source is given then simply go back
    if (!(src in this.graph)) return;

    const visited = {};
    const graph = this.graph;

    function helper(source) {
      // mark the source as visited
      visited[source] = true;

      console.log(source);

      //  run loop on every edge of the graph
      for (const edge of graph[source]) {
        if (visited[edge.target]) {
          continue;
        }
        helper(edge.target);
      }
      visited[source] = false;
    }
    helper(src);
  }
  BFS(src) {
    // when invalid source is given then simply go back
    if (!(src in this.graph)) return;

    const queue = new Queue();
    const visited = {};
    queue.push(src);
    visited[src] = true;
    while (queue.size() > 0) {
      const node = queue.top();
      console.log(node);
      for (const edge of this.graph[node]) {
        // only push that nbr which is not visited or pushed yet
        if (!visited[edge.target]) {
          queue.push(edge.target);
          visited[edge.target] = true;
        }
      }
      queue.pop();
    }
  }
  show() {
    const nodes = this.getNodes().map((node, index) => ({ id: node, index }));
    const edges = this.getEdges();
    drawGraph({ nodes, links: edges });
  }
}

exports.Graph = Graph;
exports.LinkedList = LinkedList;
exports.ListNode = ListNode;
exports.PriorityQueue = PriorityQueue;
exports.Queue = Queue;
exports.Stack = Stack;
exports.drawGraph = drawGraph;
exports.drawLinkedList = drawLinkedList;
exports.drawQueue = drawQueue;
exports.drawStack = drawStack;
exports.drawTree = drawTree;
