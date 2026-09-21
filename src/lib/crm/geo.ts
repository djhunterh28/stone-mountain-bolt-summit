export type Coord = { lat: number; lng: number };

export type RouteStop = Coord & { id: number; name: string };

const EARTH_MI = 3958.7613;
/** NYC grid / one-ways vs a bird line. */
export const ROAD_FACTOR = 1.28;

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

export function haversineMiles(a: Coord, b: Coord): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_MI * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function roadMiles(a: Coord, b: Coord): number {
  return Math.round(haversineMiles(a, b) * ROAD_FACTOR * 10) / 10;
}

export function driveMinutes(miles: number, kind: "truck" | "van" | "car" = "truck"): number {
  const mph = kind === "truck" ? 16 : kind === "van" ? 18 : 20;
  return Math.max(8, Math.round((miles / mph) * 60));
}

export type RouteLeg = { from: RouteStop; to: RouteStop; miles: number };

export type OptimizedRoute = {
  order: RouteStop[];
  legs: RouteLeg[];
  miles: number;
};

function dist(a: Coord, b: Coord) {
  return roadMiles(a, b);
}

function twoOpt(order: RouteStop[]) {
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < order.length - 2; i++) {
      for (let k = i + 1; k < order.length - 1; k++) {
        const a = order[i - 1];
        const b = order[i];
        const c = order[k];
        const d = order[k + 1];
        if (dist(a, c) + dist(b, d) + 0.05 < dist(a, b) + dist(c, d)) {
          const reversed = order.slice(i, k + 1).reverse();
          order.splice(i, k - i + 1, ...reversed);
          improved = true;
        }
      }
    }
  }
}

function pathOf(order: RouteStop[]): OptimizedRoute {
  const legs: RouteLeg[] = [];
  let miles = 0;
  for (let i = 0; i < order.length - 1; i++) {
    const m = dist(order[i], order[i + 1]);
    miles += m;
    legs.push({ from: order[i], to: order[i + 1], miles: m });
  }
  return { order, legs, miles: Math.round(miles * 10) / 10 };
}

/** Nearest-neighbor + 2-opt loop that starts and ends at `shop`. */
export function optimizeLoop(shop: RouteStop, stops: RouteStop[]): OptimizedRoute {
  if (stops.length === 0) return { order: [shop], legs: [], miles: 0 };
  const remaining = [...stops];
  const order: RouteStop[] = [shop];
  let cur = shop;
  while (remaining.length) {
    remaining.sort((a, b) => dist(cur, a) - dist(cur, b));
    const next = remaining.shift();
    if (!next) break;
    order.push(next);
    cur = next;
  }
  order.push(shop);
  twoOpt(order);
  return pathOf(order);
}

export function naiveLoop(shop: RouteStop, stops: RouteStop[]): OptimizedRoute {
  return pathOf([shop, ...stops, shop]);
}
