/**
 * Ensures all connections in the graph are bidirectional.
 * If node A connects to B, this function will add B → A if it doesn't exist.
 */
export function repairGraphBidirectional(graph) {
    let fixCount = 0;
  
    for (const [from, neighbors] of Object.entries(graph)) {
      for (const [to, distance] of Object.entries(neighbors)) {
        if (!graph[to]) {
          console.warn(`⚠️ Node ${to} missing entirely — skipping`);
          continue;
        }
  
        if (graph[to][from] !== distance) {
          graph[to][from] = distance;
          fixCount++;
          console.log(`🔁 Fixed: ${to} → ${from} = ${distance}`);
        }
      }
    }
  
    console.log(`✅ Repair complete: ${fixCount} missing reverse links added`);
    return graph;
}
  