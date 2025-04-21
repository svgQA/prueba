import { useEffect, useRef, useState } from 'react';
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
  minZoom?: number;
  maxZoom?: number;
  renderPopupContent?: (point: T) => string;
  onMarkerClick?: (point: T) => void;
  fitBoundsOptions?: maplibregl.FitBoundsOptions;
  singlePointZoomLevel?: number;
  defaultCenter?: [number, number];
  autoFitBounds?: boolean;
  fitButtonLabel?: string;
};

function MapLibrePointsMap<T extends Point>({
  points,
  mapHeight = '500px',
  initialZoom = 6,
  minZoom = 3,
  maxZoom = 18,
  renderPopupContent,
  onMarkerClick,
  fitBoundsOptions = { padding: 50, maxZoom: 14 },
  singlePointZoomLevel = 10,
  defaultCenter = [-74.5, 4.0],
  autoFitBounds = false,
}: MapLibrePointsMapProps<T>) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [prevPointsLength, setPrevPointsLength] = useState<number>(
    points.length
  );
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [userModifiedView, setUserModifiedView] = useState<boolean>(false);
  const [lastFitBounds, setLastFitBounds] = useState<{
    zoom: number;
    center: [number, number];
  }>({
    zoom: initialZoom,
    center: defaultCenter,
  });
  const prevPointsRef = useRef<T[]>([]);
  const [hasPointsOutsideView, setHasPointsOutsideView] =
    useState<boolean>(false);

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

  const resetMapToDefault = (map: MaplibreMap) => {
    map.flyTo({
      center: defaultCenter,
      zoom: initialZoom,
      duration: 1000,
    });
    setUserModifiedView(false);
  };

  const fitMapToPoints = (map: MaplibreMap, pointsToFit: T[]) => {
    if (pointsToFit.length === 0) return;

    if (pointsToFit.length === 1) {
      const point = pointsToFit[0];
      map.flyTo({
        center: [point.lng, point.lat],
        zoom: singlePointZoomLevel,
        ...fitBoundsOptions,
      });

      setLastFitBounds({
        zoom: singlePointZoomLevel,
        center: [point.lng, point.lat],
      });
    } else if (pointsToFit.length === 2) {
      const bounds = new maplibregl.LngLatBounds();
      pointsToFit.forEach((point) => {
        bounds.extend([point.lng, point.lat]);
      });

      const twoPadding = Math.max(
        150,
        ((fitBoundsOptions?.padding as number) || 50) * 2
      );
      const twoPointOptions = {
        ...fitBoundsOptions,
        padding: twoPadding,
        maxZoom: Math.min(11, fitBoundsOptions?.maxZoom || 14),
      };

      map.fitBounds(bounds, twoPointOptions);

      setTimeout(() => {
        if (map) {
          setLastFitBounds({
            zoom: map.getZoom(),
            center: [map.getCenter().lng, map.getCenter().lat],
          });
        }
      }, 300);
    } else {
      const bounds = new maplibregl.LngLatBounds();
      pointsToFit.forEach((point) => {
        bounds.extend([point.lng, point.lat]);
      });
      map.fitBounds(bounds, fitBoundsOptions);

      setTimeout(() => {
        if (map) {
          setLastFitBounds({
            zoom: map.getZoom(),
            center: [map.getCenter().lng, map.getCenter().lat],
          });
        }
      }, 300);
    }

    setUserModifiedView(false);
  };

  const isInFittedView = (map: MaplibreMap): boolean => {
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();

    const zoomTolerance = 0.1;
    const centerTolerance = 0.01;

    const zoomMatches =
      Math.abs(currentZoom - lastFitBounds.zoom) <= zoomTolerance;
    const centerMatches =
      Math.abs(currentCenter.lng - lastFitBounds.center[0]) <=
        centerTolerance &&
      Math.abs(currentCenter.lat - lastFitBounds.center[1]) <= centerTolerance;

    return zoomMatches && centerMatches;
  };

  const hasPointDisconnected = (
    currentPoints: T[],
    previousPoints: T[]
  ): boolean => {
    if (currentPoints.length < previousPoints.length) {
      const currentIds = new Set(currentPoints.map((p) => p.id));
      return previousPoints.some((prevPoint) => !currentIds.has(prevPoint.id));
    }
    return false;
  };

  const createMarkerElement = (index: number) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="
        position: relative;
        width: 24px;
        height: 38px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="38" viewBox="0 0 24 38">
          <path fill="#EA4335" d="M12 0C5.4 0 0 5.4 0 12c0 6.5 12 25 12 25s12-18.5 12-25c0-6.6-5.4-12-12-12z" />
          <circle fill="#FFFFFF" cx="12" cy="12" r="8" />
          <text 
            fill="#EA4335" 
            x="12" 
            y="16" 
            font-family="Arial, sans-serif" 
            font-size="11" 
            font-weight="bold" 
            text-anchor="middle"
          >${index + 1}</text>
        </svg>
      </div>
    `;
    return el;
  };

  const handleFitBounds = () => {
    if (mapRef.current && points.length > 0) {
      fitMapToPoints(mapRef.current, points);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const pointsAdded = points.length > prevPointsLength;
    const pointDisconnected = hasPointDisconnected(
      points,
      prevPointsRef.current
    );

    const checkAllPointsOutsideView = () => {
      if (!mapRef.current || points.length === 0) {
        setHasPointsOutsideView(false);
        return;
      }

      const currentBounds = mapRef.current.getBounds();
      const anyPointOutside = points.some((point) => {
        return !currentBounds.contains([point.lng, point.lat]);
      });

      setHasPointsOutsideView(anyPointOutside);
    };

    const shouldUpdateView =
      initialLoad ||
      autoFitBounds ||
      (pointsAdded && !userModifiedView) ||
      pointDisconnected;

    if (prevPointsLength > 0 && points.length === 0) {
      resetMapToDefault(mapRef.current);
    } else if (points.length > 0) {
      points.forEach((point, index) => {
        const markerEl = createMarkerElement(index);

        const popupContent = renderPopupContent
          ? renderPopupContent(point)
          : `
            <div style="font-weight: bold;">${point.name}</div>
            <div style="font-size: 12px;">Lat: ${point.lat.toFixed(6)}</div>
            <div style="font-size: 12px;">Lng: ${point.lng.toFixed(6)}</div>
          `;

        const popup = new maplibregl.Popup({
          closeButton: false,
          offset: [0, -20],
          className: 'map-popup-custom',
        }).setHTML(popupContent);

        if (mapRef.current) {
          const marker = new maplibregl.Marker({
            element: markerEl,
          })
            .setLngLat([point.lng, point.lat])
            .addTo(mapRef.current);

          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation();
            if (onMarkerClick) {
              onMarkerClick(point);
            }

            if (mapRef.current) {
              popup.setLngLat([point.lng, point.lat]).addTo(mapRef.current);
            }
          });

          markersRef.current.set(point.id, marker);
        }
      });

      if (shouldUpdateView) {
        setTimeout(() => {
          if (mapRef.current) {
            fitMapToPoints(mapRef.current, points);

            if (initialLoad) {
              setInitialLoad(false);
            }
          }
        }, 100);
      } else {
        checkAllPointsOutsideView();
      }
    }

    if (mapRef.current) {
      mapRef.current.on('moveend', checkAllPointsOutsideView);
      mapRef.current.on('zoomend', checkAllPointsOutsideView);
    }

    setPrevPointsLength(points.length);
    prevPointsRef.current = [...points];

    return () => {
      if (mapRef.current) {
        mapRef.current.off('moveend', checkAllPointsOutsideView);
        mapRef.current.off('zoomend', checkAllPointsOutsideView);
      }
    };
  }, [
    points,
    renderPopupContent,
    onMarkerClick,
    fitBoundsOptions,
    singlePointZoomLevel,
    initialZoom,
    defaultCenter,
    autoFitBounds,
    initialLoad,
    userModifiedView,
  ]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      zoom: initialZoom,
      center: defaultCenter,
      minZoom: minZoom,
      maxZoom: maxZoom,
    });

    if (mapRef.current) {
      const userInteractionEvents = [
        'dragend',
        'zoomend',
        'pitchend',
        'rotateend',
      ];

      userInteractionEvents.forEach((event) => {
        mapRef.current!.on(event, () => {
          if (mapRef.current && !isInFittedView(mapRef.current)) {
            setUserModifiedView(true);
          }
        });
      });
    }

    mapRef.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      })
    );

    mapRef.current.on('load', () => {
      if (points.length > 0 && mapRef.current) {
        fitMapToPoints(mapRef.current, points);
        setInitialLoad(false);
      }
    });

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
        className='w-full rounded-lg overflow-hidden'
        style={{ height: mapHeight }}
      >
        {points.length > 0 && hasPointsOutsideView && (
          <button
            className='absolute top-2.5 left-2.5 z-10 border border-red-500 bg-red-50 text-red-700 hover:bg-red-100 rounded px-3 py-2 shadow-md font-sans text-sm cursor-pointer transition-colors flex items-center gap-1.5'
            onClick={handleFitBounds}
            title='Ajustar mapa para mostrar todos los puntos'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-4 h-4'
            >
              <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
            </svg>
            ¡Hay puntos fuera de la vista!
          </button>
        )}
      </div>
    </div>
  );
}

export default MapLibrePointsMap;
