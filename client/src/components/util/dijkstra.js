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

    const path = [];
    for (let at = end; at; at = prev[at]) path.unshift(at);
    return path;
}
  