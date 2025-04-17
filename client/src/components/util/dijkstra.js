export function dijkstra(graph, start, end) {
    const distances = {};
    const prev = {};
    const queue = new Set(Object.keys(graph));
  
    Object.keys(graph).forEach(node => {
      distances[node] = Infinity;
      prev[node] = null;
    });
    distances[start] = 0;
  
    while (queue.size > 0) {
      const current = [...queue].reduce((a, b) =>
        distances[a] < distances[b] ? a : b
      );
      queue.delete(current);
  
      if (current === end) break;
  
      for (const neighbor in graph[current]) {
        const alt = distances[current] + graph[current][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          prev[neighbor] = current;
        }
      }
    }
  
    // ✅ If end was never reached, return empty
    if (prev[end] === null && start !== end) {
      console.warn(`🚫 No path found from ${start} to ${end}`);
      return [];
    }
  
    // ✅ Reconstruct path
    const path = [];
    for (let at = end; at !== null; at = prev[at]) {
      path.unshift(at);
    }
  
    console.log("Dijkstra path:", path);
    return path;
  }
  

export function getConstrainedPath(graph, entryWP, endWP, constraints = []) {
    if (!entryWP || !endWP) {
      console.warn("🚫 Invalid entry or end waypoint:", entryWP, endWP);
      return [];
    }
  
    // Deep clone to avoid mutating the original graph
    const clonedGraph = JSON.parse(JSON.stringify(graph));
  
    // Apply constraints by removing edges in both directions
    constraints.forEach(([from, to]) => {
      if (clonedGraph[from]?.[to]) delete clonedGraph[from][to];
      if (clonedGraph[to]?.[from]) delete clonedGraph[to][from];
    });
  
    // Safety check: is entryWP still connected?
    if (!clonedGraph[entryWP] || Object.keys(clonedGraph[entryWP]).length === 0) {
      console.warn(`❌ entryWP (${entryWP}) has no neighbors after constraint filtering.`);
      return [endWP]; // fallback to destination only
    }
  
    const path = dijkstra(clonedGraph, entryWP, endWP);
    if (!path || path.length === 0) {
      console.warn("🛑 Dijkstra failed to find a path from", entryWP, "to", endWP);
      return [endWP];
    }
  
    return path;
}