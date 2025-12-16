export function solveTSP(points) {
  if (points.length <= 2) return points;

  // Hackathon-safe greedy approach
  const visited = [points[0]];
  const unvisited = points.slice(1);

  while (unvisited.length) {
    const last = visited[visited.length - 1];

    unvisited.sort(
      (a, b) =>
        distance(last, a) - distance(last, b)
    );

    visited.push(unvisited.shift());
  }

  return visited;
}

function distance(a, b) {
  return Math.sqrt(
    Math.pow(a.lat - b.lat, 2) +
    Math.pow(a.lon - b.lon, 2)
  );
}
