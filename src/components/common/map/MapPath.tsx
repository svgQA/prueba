import { useEffect, useRef } from 'preact/hooks';
import maplibregl, { type Map as MaplibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { themeSignal } from '@/components/compose/button/signal.theme';
import './style.css';
import { useSignal } from '@preact/signals';

interface Props {
  width: string;
  height: string;
}
export const MapPath = ({ width = '100%', height = '500px' }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const statusMap = useSignal<boolean>(false);

  const getMapStyle = () => {
    return themeSignal.value
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(),
      center: [-74.08689346772478, 4.670355108326989],
      zoom: 3,
    });

    const map = mapRef.current;

    // Wait for the map to be fully loaded
    map.on('load', () => {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
      statusMap.value = true;
    });

    return () => (statusMap.value = false);
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width, height }}
      className='rounded-lg overflow-hidden shadow-md'
    />
  );
};
