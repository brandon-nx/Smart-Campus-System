// util/createPath.js
import { dijkstra, getConstrainedPath } from "./dijkstra";

// Helper to find the correct lift exit point on third floor
function findExitLift(lift2, locations) {
  return Object.keys(locations).find(
    k =>
      k.toLowerCase().includes("lift-lobby") &&
      locations[k].floor === "third" &&
      k.toLowerCase().includes(lift2.toLowerCase().includes("left") ? "left" : "right")
  );
}

export function generatePath({ startLoc, endLoc, graph, locations }) {
  const startWP = getNearestWaypoint(startLoc, locations);
  const endWP = getNearestWaypoint(endLoc, locations);
  if (!startWP || !endWP) return [];

  if (startLoc.floor !== endLoc.floor) {
    const lift2 = findNearestLift(startLoc, "second", locations);
    const lift3 = findExitLift(lift2, locations);
    const pathToLift = dijkstra(graph, startWP, lift2);
    const entryWP = Object.keys(graph[lift3]).find(k => k.startsWith("wp-"));

    const constraints = [
      ["lift-lobby (Level 3 Left Wing)", "lift-lobby (Level 2 Left Wing)"],
      ["lift-lobby (Level 3 Right Wing)", "lift-lobby (Level 2 Right Wing)"],
      ["main-stair (Level 3 Right Wing)", "main-stair (Level 2 Right Wing)"]
    ];
    const pathFromLift = getConstrainedPath(graph, entryWP, endWP, constraints);

    if (!pathToLift.length || !pathFromLift.length) return [];

    return [startLoc.id, ...pathToLift, lift2, lift3, entryWP, ...pathFromLift, endLoc.id];
  }

  const sameFloorPath = dijkstra(graph, startWP, endWP);
  return [startLoc.id, ...sameFloorPath, endLoc.id];
}

// Nearest waypoint utility (floor-aware)
export function getNearestWaypoint(point, allLocations) {
  return Object.entries(allLocations).reduce((nearest, [id, loc]) => {
    if (loc.floor !== point.floor || !id.startsWith("wp-")) return nearest;
    const dx = loc.x - point.x;
    const dy = loc.y - point.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < nearest.minDist ? { id, minDist: dist } : nearest;
  }, { id: null, minDist: Infinity }).id;
}

function findNearestLift(point, floor, locations) {
  return Object.entries(locations).filter(([id, loc]) =>
    id.toLowerCase().includes("lift-lobby") && loc.floor === floor
  ).reduce((nearest, [id, loc]) => {
    const dx = loc.x - point.x;
    const dy = loc.y - point.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < nearest.minDist ? { id, minDist: dist } : nearest;
  }, { id: null, minDist: Infinity }).id;
}