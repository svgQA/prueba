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
// import { bearingBetween, smoothBearing, stepTowardsAngle } from './utils/view';
import { Button } from '../button/button';
// import { createPersonMarker } from './utils/sprite';
// import { bearingBetween } from './utils/view';

interface Props {
  width?: string;
  height?: string;
  route: RoutePoint[];
}

export const MapPath = ({ width = '400px', height = '80vh', route }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const statusMap = useSignal(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const animRef = useRef<{ stop: () => void } | null>(null);

  const stopRoutePlayback = () => {
    animRef.current?.stop();
  };

  const startRoutePlayback = (speedMs = 600) => {
    if (!mapRef.current || route.length < 2) return;

    const map = mapRef.current;
    let i = 1;
    let trail: number[][] = [route[0].coords];

    const currentMarker = new maplibregl.Marker({ color: '#1f78b4' })
      .setLngLat(route[0].coords)
      .addTo(map);
    // const { marker: personMarker, el: personEl } = createPersonMarker(route[0].coords);
    // personMarker.addTo(map);

    // aseguramos pitch fijo “axial”
    // const PITCH = 65; // más alto = más perspectiva
    // const ZOOM = 25; // ajusta al gusto

    const ensureTrail = () => {
      const src = map.getSource('route-trail') as GeoJSONSource | undefined;
      const data = {
        type: 'Feature' as const,
        properties: {},
        geometry: { type: 'LineString' as const, coordinates: trail },
      };
      if (!src) {
        map.addSource('route-trail', { type: 'geojson', data });
        map.addLayer({
          id: 'route-trail-line',
          type: 'line',
          source: 'route-trail',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#1f78b4',
            'line-width': 20,
            'line-opacity': 0.9,
          },
        });
      } else {
        src.setData(data);
      }
    };

    // Nueva función para mostrar puntos de la ruta
    const ensureRoutePoints = () => {
      const pointsSrc = map.getSource('route-points') as
        | GeoJSONSource
        | undefined;
      const pointsData = {
        type: 'FeatureCollection' as const,
        features: trail.map((coord, index) => {
          const routePoint = route[index];
          return {
            type: 'Feature' as const,
            properties: {
              coordinates: coord,
              // index: index,
              action: routePoint?.action,
              lat: coord[1],
              lng: coord[0],
              posicion: index,
              ...(routePoint?.info || {}),
            },
            geometry: {
              type: 'Point' as const,
              coordinates: coord,
            },
          };
        }),
      };

      if (!pointsSrc) {
        map.addSource('route-points', { type: 'geojson', data: pointsData });
        map.addLayer({
          id: 'route-points-layer',
          type: 'circle',
          source: 'route-points',
          paint: {
            'circle-radius': 6, // Aumentado de 4 a 6 para hacer más fácil el clic
            'circle-color': '#ffffff',
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 2,
            'circle-opacity': 0.9,
          },
        });

        // Agregar evento de clic en los puntos - Corregido el tipo
        map.on('click', 'route-points-layer', (e: any) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const geometry = feature.geometry as {
              type: 'Point';
              coordinates: number[];
            };
            const coordinates = geometry.coordinates.slice();
            const {
              lat,
              lng,
              action,
              // index,
              coordinates: _,
              ...info
            } = feature.properties;

            // Asegurar que el popup aparezca en la coordenada correcta
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Generar HTML dinámico para todas las propiedades de info
            const infoHTML =
              info && typeof info === 'object' && Object.keys(info).length > 0
                ? Object.entries(info)
                    .map(
                      ([key, value]) =>
                        `<div><strong>${key}:</strong> ${value}</div>`
                    )
                    .join('')
                : '';

            new maplibregl.Popup({ closeOnClick: true, closeButton: true })
              .setLngLat(coordinates as [number, number])
              .setHTML(
                `
                <div style="padding: 8px; font-family: system-ui, sans-serif;">
                  <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Punto 
                  ${
                    //index + 1
                    action
                  }
                  </h4>
                  <div style="font-size: 12px; line-height: 1.4;">
                    <div><strong>Latitud:</strong> ${lat.toFixed(6)}</div>
                    <div><strong>Longitud:</strong> ${lng.toFixed(6)}</div>
                    ${infoHTML}
                  </div>
                </div>
              `
              )
              .addTo(map);
          } else {
            console.log('No features found in click event');
          }
        });

        // Cambiar cursor cuando se pasa por encima de los puntos - Corregido el tipo
        map.on('mouseenter' as any, 'route-points-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave' as any, 'route-points-layer', () => {
          map.getCanvas().style.cursor = '';
        });
      } else {
        pointsSrc.setData(pointsData);
      }
    };

    ensureTrail();
    ensureRoutePoints();

    let stopped = false;
    const tick = () => {
      if (stopped) return;
      if (i >= route.length) return; // fin

      // const prev = trail[trail.length - 1];
      const next = route[i].coords;
      trail = [...trail, next];
      ensureTrail();
      ensureRoutePoints();

      // mover marcador
      currentMarker.setLngLat(next);
      // personMarker.setLngLat(next);

      /*
      const brg = bearingBetween(prev, next);

      map.easeTo({
        center: next,
        zoom: ZOOM,
        pitch: PITCH,
        bearing: brg,
        duration: speedMs, // controla la “velocidad”
        easing: (t) => t, // lineal; puedes usar easeOutCubic si quieres
        offset: [0, 100], // empuja el centro un poco hacia abajo para “ver” más hacia adelante
      });
      */

      /*
      const targetBrg = bearingBetween(prev, next);
      const prevBrg = map.getBearing();
      const smoothed = stepTowardsAngle(prevBrg, targetBrg, 8); // p.ej. máx 8° por paso
      const smoothed = smoothBearing(prevBrg, targetBrg, 0.15);
      map.easeTo({ bearing: smoothed });
      */

      // const brg = bearingBetween(prev, next);
      // personEl.style.transform = `rotate(${brg}deg)`;

      i += 1;
      setTimeout(tick, speedMs);
    };

    tick();

    animRef.current = {
      stop: () => {
        stopped = true;
        currentMarker.remove();

        // Limpiar eventos y capas de puntos al parar
        if (map.getLayer('route-points-layer')) {
          map.removeLayer('route-points-layer');
        }
        if (map.getSource('route-points')) {
          map.removeSource('route-points');
        }
        // Limpiar capa de línea al parar
        if (map.getLayer('route-trail-line')) {
          map.removeLayer('route-trail-line');
        }
        if (map.getSource('route-trail')) {
          map.removeSource('route-trail');
        }
      },
    };
  };

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

      map.addControl(
        new maplibregl.FullscreenControl({
          container: mapContainerRef.current!,
        }),
        'top-right'
      );

      const onFsChange = () => map.resize();
      document.addEventListener('fullscreenchange', onFsChange);

      /*
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
      */

      map.once('remove', () => {
        document.removeEventListener('fullscreenchange', onFsChange);
      });

      // Agregar marcadores de acciones
      /*
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
      */

      startRoutePlayback(500);
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
    <div className='w-10/12'>
      <div
        ref={mapContainerRef}
        style={{ width, height }}
        className='rounded-lg overflow-hidden shadow-md'
      />
      <div className='flex flex-row gap-3 w-full py-2 justify-center'>
        <Button
          name='btn:map-play'
          icon='043'
          onClick={() => startRoutePlayback(400)}
        ></Button>
        <Button
          name='btn:map-stop'
          icon='047'
          onClick={stopRoutePlayback}
        ></Button>
      </div>
    </div>
  );
};
