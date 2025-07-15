import { useEffect, useRef } from 'preact/hooks';
import maplibregl, {
  type Map as MaplibreMap,
  type GeoJSONSource,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { themeSignal } from '@/components/compose/button/signal.theme';
import { useSignal } from '@preact/signals';
import { RoutePoint } from '@/services/general/tracking';
import './utils/style.css';

interface Props {
  width?: string;
  height?: string;
  route: RoutePoint[];
}

export const MapPath = ({ width = '100%', height = '500px', route }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const statusMap = useSignal(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const getMapStyle = () => {
    return themeSignal.value
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(),
      center: route[0]?.coords ?? [-73.9712, 40.7851],
      zoom: 14,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
      statusMap.value = true;

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {}, // 👈 Esto soluciona tu error TS
          geometry: {
            type: 'LineString',
            coordinates: route.map((p) => p.coords),
          },
        },
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ff6600',
          'line-width': 4,
        },
      });

      // Agregar marcadores de acciones
      route.forEach((point) => {
        if (point.action) {
          const popup = new maplibregl.Popup({ offset: 25 }).setText(
            point.action
          );
          const marker = new maplibregl.Marker({ color: '#007aff' })
            .setLngLat(point.coords)
            .setPopup(popup)
            .addTo(map);
          markersRef.current.push(marker);
        }
      });
    });

    return () => {
      statusMap.value = false;
      map.remove();
      markersRef.current.forEach((m) => m.remove());
    };
  }, []);

  // Actualizar ruta y marcadores al cambiar `route`
  useEffect(() => {
    if (!mapRef.current || !statusMap.value) return;

    const source = mapRef.current.getSource('route') as GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {}, // 👈 siempre incluir
        geometry: {
          type: 'LineString',
          coordinates: route.map((p) => p.coords),
        },
      });
      mapRef.current.panTo(route[0].coords);
    }

    // Eliminar marcadores anteriores
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Crear nuevos marcadores
    route.forEach((point) => {
      if (point.action) {
        const popup = new maplibregl.Popup({ offset: 25 }).setText(
          point.action
        );
        const marker = new maplibregl.Marker({ color: '#007aff' })
          .setLngLat(point.coords)
          .setPopup(popup)
          .addTo(mapRef.current!);
        markersRef.current.push(marker);
      }
    });
  }, [route]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width, height }}
      className='rounded-lg overflow-hidden shadow-md'
    />
  );
};
