import { useEffect, useRef } from 'react';
import maplibregl, { Map as MaplibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export type Point = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  [key: string]: any;
};

type MapLibrePointsMapProps<T extends Point> = {
  points: T[];
  mapHeight?: string;
  initialZoom?: number;
  markerColor?: string;
  pointsLabel?: string;
  renderPopupContent?: (point: T) => string;
  onMarkerClick?: (point: T) => void;
  fitBoundsOptions?: maplibregl.FitBoundsOptions;
  useUserLocation?: boolean;
};

function MapLibrePointsMap<T extends Point>({
  points,
  mapHeight = '500px',
  initialZoom = 5,
  // markerColor = 'bg-red-500',
  // pointsLabel = 'puntos',
  // renderPopupContent,
  // onMarkerClick,
  // fitBoundsOptions = { padding: 50, maxZoom: 10 },
  // useUserLocation = true,
}: MapLibrePointsMapProps<T>) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  // const [currentPoints, setCurrentPoints] = useState<T[]>(points);

  const mapStyle: string | maplibregl.StyleSpecification = {
    version: 8 as const,
    sources: {
      carto: {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution: '© <a href="https://carto.com/">CARTO</a>',
      },
    },
    layers: [
      {
        id: 'carto-voyager',
        type: 'raster',
        source: 'carto',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const newMarkerIds = new Set(points.map((point) => point.id));
    markersRef.current.forEach((marker, id) => {
      if (!newMarkerIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    points.forEach((point) => {
      const existingMarker = markersRef.current.get(point.id);

      if (existingMarker) {
        existingMarker.setLngLat([point.lng, point.lat]);
      } else {
        const markerContainer = document.createElement('div');
        markerContainer.className = 'relative flex items-center justify-center';

        const pulseEl = document.createElement('div');
        pulseEl.className =
          'absolute w-12 h-12 bg-teal-400 rounded-full opacity-30 animate-ping';

        const markerEl = document.createElement('div');
        markerEl.className =
          'w-6 h-6 bg-teal-500 rounded-full border-2 border-white shadow-md relative z-10';

        markerContainer.appendChild(pulseEl);
        markerContainer.appendChild(markerEl);

        const popup = new maplibregl.Popup({
          closeButton: false,
          className: 'shadow-lg',
          offset: 25,
        }).setHTML(`
          <div class="font-bold">${point.name}</div>
          <div class="text-xs">Lat: ${point.lat.toFixed(6)}</div>
          <div class="text-xs">Lng: ${point.lng.toFixed(6)}</div>
        `);

        const marker = new maplibregl.Marker({
          element: markerContainer,
          anchor: 'center',
        })
          .setLngLat([point.lng, point.lat])
          .setPopup(popup)
          .addTo(mapRef.current!);

        markerEl.addEventListener('click', () => {
          popup.addTo(mapRef.current!);
        });

        markersRef.current.set(point.id, marker);
      }
    });

    if (points.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((point) => {
        bounds.extend([point.lng, point.lat]);
      });
      mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 3 });
    }
  }, [points]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      zoom: initialZoom,
      center: [0, 0],
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: true,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl());

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div className='relative w-full'>
      <div
        ref={mapContainerRef}
        className='w-full rounded-lg overflow-hidden shadow-md'
        style={{ height: mapHeight }}
      />
    </div>
  );
}

export default MapLibrePointsMap;
