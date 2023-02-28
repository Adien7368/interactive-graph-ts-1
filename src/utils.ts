function distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function distance_sq(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

export { distance, distance_sq };
