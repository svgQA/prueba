export function bearingBetween([lng1, lat1]: number[], [lng2, lat2]: number[]) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  let θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360; // 0..360
}

const norm360 = (a: number) => ((a % 360) + 360) % 360;
const shortestDelta = (from: number, to: number) => {
  let d = norm360(to) - norm360(from);
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
};

export const stepTowardsAngle = (
  from: number,
  to: number,
  maxStepDeg: number
) => {
  const d = shortestDelta(from, to);
  if (Math.abs(d) <= maxStepDeg) return norm360(to);
  return norm360(from + Math.sign(d) * maxStepDeg);
};

export const smoothBearing = (from: number, to: number, alpha = 0.18) => {
  const d = shortestDelta(from, to);
  return norm360(from + d * alpha);
};
