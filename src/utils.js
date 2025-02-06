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

export { drawLinkedList, drawGraph, drawQueue, drawStack, drawTree };
