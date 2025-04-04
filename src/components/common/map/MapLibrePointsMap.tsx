import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
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
  markerColor = 'bg-red-500',
  pointsLabel = 'puntos',
  renderPopupContent,
  onMarkerClick,
  fitBoundsOptions = { padding: 50, maxZoom: 10 },
  useUserLocation = true,
}: MapLibrePointsMapProps<T>) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const tooltipsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevPointsRef = useRef<T[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

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

  // Get user's location
  useEffect(() => {
    if (!useUserLocation || points.length > 0) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
    }
  }, [useUserLocation, points.length]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let center: [number, number] = [0, 0];

    if (points.length > 0) {
      center = [points[0].lng, points[0].lat];
    } else if (userLocation) {
      center = userLocation;
    }

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      zoom: initialZoom,
      center: center,
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: true,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl());

    // Add user location marker if available and no points
    if (userLocation && points.length === 0) {
      // Create user location marker
      const userMarkerEl = document.createElement('div');
      userMarkerEl.className =
        'w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center';

      // Add pulsing effect
      const pulseEl = document.createElement('div');
      pulseEl.className =
        'absolute w-12 h-12 bg-blue-400 rounded-full opacity-30 animate-ping';

      const markerContainer = document.createElement('div');
      markerContainer.className = 'relative flex items-center justify-center';
      markerContainer.appendChild(pulseEl);
      markerContainer.appendChild(userMarkerEl);

      new maplibregl.Marker({
        element: markerContainer,
        anchor: 'center',
      })
        .setLngLat(userLocation)
        .addTo(mapRef.current);

      // Add popup for user location
      const popup = new maplibregl.Popup({
        closeButton: false,
        className: 'shadow-lg',
      }).setHTML(`
        <div class="font-bold">Tu ubicación</div>
        <div class="text-xs">Lat: ${userLocation[1].toFixed(6)}</div>
        <div class="text-xs">Lng: ${userLocation[0].toFixed(6)}</div>
      `);

      userMarkerEl.addEventListener('click', () => {
        popup.setLngLat(userLocation).addTo(mapRef.current!);
      });
    }

    return () => {
      // Clean up markers
      markersRef.current.forEach((marker) => marker.remove());

      // Remove map
      mapRef.current?.remove();
      markersRef.current.clear();
      tooltipsRef.current.clear();
    };
  }, [initialZoom, points, userLocation]);

  // Check if point positions have changed
  const havePositionsChanged = (
    prevPoints: T[],
    currentPoints: T[]
  ): boolean => {
    if (prevPoints.length !== currentPoints.length) return true;

    for (let i = 0; i < currentPoints.length; i++) {
      const current = currentPoints[i];
      const prev = prevPoints.find((p) => p.id === current.id);
      if (!prev) return true;
      if (prev.lat !== current.lat || prev.lng !== current.lng) return true;
    }

    return false;
  };

  // Default popup content renderer
  const defaultRenderPopupContent = (point: T) => `
    <div class="font-bold">${point.name}</div>
    <div class="text-xs">Lat: ${point.lat.toFixed(6)}</div>
    <div class="text-xs">Lng: ${point.lng.toFixed(6)}</div>
  `;

  useEffect(() => {
    if (!mapRef.current) return;
    if (points.length === 0) return;

    const positionsChanged = havePositionsChanged(
      prevPointsRef.current,
      points
    );
    prevPointsRef.current = [...points];
    if (!positionsChanged) return;
    const currentPointIds = new Set(points.map((point) => point.id));

    markersRef.current.forEach((marker, pointId) => {
      if (!currentPointIds.has(pointId)) {
        marker.remove();
        markersRef.current.delete(pointId);

        if (tooltipsRef.current.has(pointId)) {
          tooltipsRef.current.delete(pointId);
        }
      }
    });

    points.forEach((point) => {
      const existingMarker = markersRef.current.get(point.id);
      const popupContent = renderPopupContent
        ? renderPopupContent(point)
        : defaultRenderPopupContent(point);

      if (existingMarker) {
        existingMarker.setLngLat([point.lng, point.lat]);
      } else {
        // Create marker container
        const markerContainer = document.createElement('div');
        markerContainer.className = 'relative flex flex-col items-center';

        // Create tooltip element (hidden by default)
        const tooltip = document.createElement('div');
        tooltip.className =
          'absolute bottom-full mb-1 px-2 py-1 bg-white text-black text-xs font-medium rounded shadow-md whitespace-nowrap opacity-0 transition-opacity duration-200 pointer-events-none';
        tooltip.textContent = point.name;
        tooltipsRef.current.set(point.id, tooltip);

        // Create marker element (Google Maps style pin)
        const markerEl = document.createElement('div');
        markerEl.title = point.name;
        markerEl.className = `w-6 h-6 ${markerColor} rounded-full shadow-md border-2 border-white flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer`;

        // Add tooltip and marker to container
        markerContainer.appendChild(tooltip);
        markerContainer.appendChild(markerEl);

        // Create popup (Google Maps style)
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: false,
          className: 'shadow-lg',
        }).setHTML(popupContent);

        // Create marker
        const marker = new maplibregl.Marker({
          element: markerContainer,
          draggable: false,
          anchor: 'center',
        })
          .setLngLat([point.lng, point.lat])
          .setPopup(popup)
          .addTo(mapRef.current!);

        // Show tooltip on hover
        markerEl.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1';
        });

        // Hide tooltip on mouse leave
        markerEl.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
        });

        // Handle click
        markerEl.addEventListener('click', () => {
          popup.addTo(mapRef.current!);
          if (onMarkerClick) onMarkerClick(point);
        });

        markersRef.current.set(point.id, marker);
      }
    });

    if (
      markersRef.current.size === points.length &&
      points.length > 0 &&
      markersRef.current.size <= 5
    ) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((point) => {
        bounds.extend([point.lng, point.lat]);
      });

      mapRef.current.fitBounds(bounds, fitBoundsOptions);
    }
  }, [
    points,
    markerColor,
    renderPopupContent,
    onMarkerClick,
    fitBoundsOptions,
  ]);

  return (
    <div className='relative w-full'>
      <div
        ref={mapContainerRef}
        className='w-full rounded-lg overflow-hidden shadow-md'
        style={{ height: mapHeight }}
      />
      <div className='absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded shadow-sm text-xs font-medium text-gray-700 flex items-center gap-1.5'>
        <span className='inline-block w-2 h-2 rounded-full bg-red-500'></span>
        {points.length} {pointsLabel} activos
        {locationError && points.length === 0 && (
          <span className='ml-2 text-red-500'>Error de ubicación</span>
        )}
      </div>
    </div>
  );
}

export default MapLibrePointsMap;
