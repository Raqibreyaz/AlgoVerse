import { drawGraph } from "./utils.js";
import { Queue } from "./queue.js";

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

export class Graph {
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
