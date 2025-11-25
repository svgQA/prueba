function svgToImage(svg: string, scale = 1): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    const svg64 = btoa(unescape(encodeURIComponent(svg)));
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = `data:image/svg+xml;base64,${svg64}`;
    (img as any).pixelRatio = scale;
  });
}

export async function ensureFootIcon(map: maplibregl.Map) {
  if ((map as any)._hasFootIcon) return;
  const img = await svgToImage(FOOT_SVG);
  if (!map.hasImage('footprint')) {
    map.addImage('footprint', img as any, { pixelRatio: 2 });
  }
  (map as any)._hasFootIcon = true;
}

/*
export function createPersonMarker(initial: [number, number]) {
  const el = document.createElement('div');
  el.style.width = '36px';
  el.style.height = '36px';
  el.style.transformOrigin = '50% 50%';
  el.style.willChange = 'transform';
  el.innerHTML = PERSON_SVG;
  const marker = new maplibregl.Marker({
    element: el,
    anchor: 'center',
  }).setLngLat(initial);
  return { marker, el };
}
*/

export function ensureFootprintsLayer(map: maplibregl.Map) {
  if (!map.getSource('footprints')) {
    map.addSource('footprints', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
    map.addLayer({
      id: 'footprints-layer',
      type: 'symbol',
      source: 'footprints',
      layout: {
        'icon-image': 'footprint',
        'icon-size': 0.6,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
      paint: { 'icon-opacity': 0.9 },
    });
  }
}

export function pushFootprint(map: maplibregl.Map, coord: number[]) {
  const src = map.getSource('footprints') as maplibregl.GeoJSONSource;
  const fc = (src._data ?? (src as any)._data) as any;
  // | GeoJSON.FeatureCollection
  // | undefined;
  const data = fc ?? { type: 'FeatureCollection', features: [] };
  data.features = [
    ...data.features,
    {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: coord },
    },
  ];
  src.setData(data as any);
}
