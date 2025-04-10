/**
 * Automatically ensures a list of waypoints are fully connected in both directions.
 * It adds missing links using default or provided distances.
 */
export function autoRepairCorridorChain(graph, corridor, defaultDistance = 100) {
    let repairs = 0;
  
    for (let i = 0; i < corridor.length - 1; i++) {
      const a = corridor[i];
      const b = corridor[i + 1];
  
      // Initialize empty objects if nodes are missing
      if (!graph[a]) graph[a] = {};
      if (!graph[b]) graph[b] = {};
  
      // Check forward and backward links
      const forward = graph[a][b];
      const backward = graph[b][a];
  
      // Repair forward link
      if (!forward) {
        graph[a][b] = defaultDistance;
        console.log(`🔧 Repaired missing forward link: ${a} → ${b}`);
        repairs++;
      }
  
      // Repair backward link
      if (!backward) {
        graph[b][a] = defaultDistance;
        console.log(`🔧 Repaired missing backward link: ${b} → ${a}`);
        repairs++;
      }
    }
  
    console.log(`✅ Corridor chain repair complete. ${repairs} links patched.`);
}
  