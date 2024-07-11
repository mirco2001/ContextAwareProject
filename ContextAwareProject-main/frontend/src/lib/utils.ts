import { type ClassValue, clsx } from "clsx"
import { Map as MapOl } from "ol";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// funzione restituisce un colore C partendo da un valore V

// minimo             > V > massimo
// colore estremo min > C > colore estremo max
export const getColor = (score: number, min: number, max: number) => {
  const red = { r: 184, g: 42, b: 29 };
  const yellow = { r: 176, g: 176, b: 18 };
  const green = { r: 58, g: 140, b: 46 };

  if (max === min) return { r: 58, g: 140, b: 46 };

  let normalizedScore = (score - min) / (max - min);

  let r, g, b;
  if (normalizedScore < 0.5) {
    normalizedScore *= 2;
    r = Math.round(red.r + normalizedScore * (yellow.r - red.r));
    g = Math.round(red.g + normalizedScore * (yellow.g - red.g));
    b = Math.round(red.b + normalizedScore * (yellow.b - red.b));
  } else {
    normalizedScore = (normalizedScore - 0.5) * 2;
    r = Math.round(yellow.r + normalizedScore * (green.r - yellow.r));
    g = Math.round(yellow.g + normalizedScore * (green.g - yellow.g));
    b = Math.round(yellow.b + normalizedScore * (green.b - yellow.b));
  }
  return { r: r, g: g, b: b };
}

export function moveMapTo(position: Coordinate, zoom: number, map:MapOl|undefined, duration:number=1000) {
  if (!map)
      return;

  let point = new Point(fromLonLat(position));

  map.getView().fit(point, {
      padding: [100, 100, 100, 100],
      maxZoom: zoom,
      duration: duration
  });
}