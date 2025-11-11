import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl, { type Map as MaplibreMap } from 'maplibre-gl';
import { IMapProps, MapPoint } from './utils/interface';
import 'maplibre-gl/dist/maplibre-gl.css';
import './utils/style.css';
import { useTranslation } from 'react-i18next';

export const MapLibreShowPoints = ({
  pointsRef = [],
  center = { lat: 4.670355108326989, lng: -74.08689346772478 },
  width = '100%',
  height = '500px',
  radius,
  radialPoint = null,
  adminUser = false,
}: IMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null);
  const { t } = useTranslation();

  const getMapStyle = () =>
    'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) {
      cleanupMap();
    }
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(),
      center: [center.lng, center.lat],
      // zoom: 12,
    });
    const map = mapRef.current;
    map.on('load', () => {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
      setIsMapReady(true);
      getUserLocation();
    });
    return () => {
      cleanupMap();
      setIsMapReady(false);
    };
  }, [center.lat, center.lng]);

  const getUserLocation = useCallback(async () => {
    if (!adminUser) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          id: -1,
          name: t('maps.admin_name'),
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      () => {
        setUserLocation(null);
      }
    );
  }, [adminUser]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;
    if (pointsRef && pointsRef.length > 0) {
      setPoints(JSON.parse(JSON.stringify(pointsRef)));
    } else {
      setPoints([]);
    }
  }, [pointsRef, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;
    updateMarkers();
    const allPoints = [...points];
    if (userLocation) {
      allPoints.push(userLocation);
    }
    if (allPoints.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      allPoints.forEach((point) =>
        bounds.extend([point.position.lng, point.position.lat])
      );
      if (radialPoint) {
        bounds.extend([radialPoint.position.lng, radialPoint.position.lat]);
      }
      // mapRef.current.fitBounds(bounds, {
      //   padding: 50,
      //   // maxZoom: 12,
      //   duration: 1000,
      // });
    } else {
      mapRef.current.setCenter([center.lng, center.lat]);
      // mapRef.current.setZoom(12);
    }
  }, [points, isMapReady, userLocation]);

  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
    updateRadiusCircle();
  }, [radius, center]);

  const cleanupMap = useCallback(() => {
    if (markersRef.current) {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    }
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, []);

  const createMarkerElement = (point: MapPoint, index: number) => {
    const el = document.createElement('div');
    el.className = 'marker-container';
    el.setAttribute('data-id', point?.id?.toString() || '');
    el.setAttribute('data-index', (index + 1).toString());
    const isUserLocation = point.id === -1;
    const markerColor = isUserLocation
      ? '#10B981'
      : radialPoint && point?.id === radialPoint?.id
        ? '#2563EB'
        : '#EA4335';

    const pointData = point as any;
    const pointName = pointData?.name || (isUserLocation ? t('maps.admin_name') : t('maps.pointName') + `${index + 1}`);
    const shiftId = pointData?.shift;
    const serviceName = pointData?.service;
    const contractName = pointData?.contract;
    let tooltipContent = `<div style="font-weight: bold; margin-bottom: 2px;">${pointName}</div>`;

    if (shiftId && shiftId !== '') {
      tooltipContent += `<div style="font-size: 10px; opacity: 0.9;">${t('h_shift')}: ${shiftId}</div>`;
    }

    if (serviceName && serviceName !== '') {
      tooltipContent += `<div style="font-size: 10px; opacity: 0.9;">${t('h_service')}: ${serviceName}</div>`;
    }

    if (contractName && contractName !== '') {
      tooltipContent += `<div style="font-size: 10px; opacity: 0.9;">${t('h_contract')}: ${contractName}</div>`;
    }

    el.innerHTML = `
      <div style="position: relative; width: 24px; height: 38px; cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="38" viewBox="0 0 24 38">
          <path fill="${markerColor}" d="M12 0C5.4 0 0 5.4 0 12c0 6.5 12 25 12 25s12-18.5 12-25c0-6.6-5.4-12-12-12z" />
          <circle fill="#FFFFFF" cx="12" cy="12" r="9" />
          <text fill="${markerColor}" x="${isUserLocation ? 8 : index + 1 >= 10 ? 5 : 10}" y="12.5" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" dy=".3em">${isUserLocation ? 'U' : index + 1}</text>
        </svg>
        <div class="tooltip" style="
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%) translateY(-100%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${tooltipContent}</div>
      </div>
    `;

    const tooltipEl = el.querySelector('.tooltip') as HTMLElement;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (tooltipEl) {
        tooltipEl.style.opacity = tooltipEl.style.opacity === '1' ? '0' : '1';
      }
    });

    el.addEventListener('mouseenter', () => {
      if (tooltipEl) {
        tooltipEl.style.opacity = '1';
      }
    });

    el.addEventListener('mouseleave', () => {
      if (tooltipEl) {
        tooltipEl.style.opacity = '0';
      }
    });

    return el;
  };

  const updateMarkers = () => {
    if (!mapRef.current || !isMapReady) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    const allPoints = [...points];
    if (userLocation) {
      allPoints.push(userLocation);
    }
    allPoints.forEach((point, index) => {
      if (
        !point ||
        !point.position ||
        typeof point.position.lat !== 'number' ||
        typeof point.position.lng !== 'number'
      )
        return;
      const markerEl = createMarkerElement(point, index);
      const marker = new maplibregl.Marker({
        element: markerEl,
        draggable: false,
      }).setLngLat([point.position.lng, point.position.lat]);
      if (mapRef.current) {
        marker.addTo(mapRef.current);
      }
      markersRef.current.push(marker);
    });
    updateRadiusCircle();
  };

  const createCircleGeoJSON = (
    center: { lat: number; lng: number },
    radiusInMeters: number
  ) => {
    const points = 64;
    const coords: number[][] = [];
    const lat = center.lat;
    const lng = center.lng;
    for (let i = 0; i <= points; i++) {
      const angle = (i * 360) / points;
      const radians = (angle * Math.PI) / 180;
      const latOffset = (radiusInMeters / 111320) * Math.cos(radians);
      const lngOffset =
        (radiusInMeters / (111320 * Math.cos((lat * Math.PI) / 180))) *
        Math.sin(radians);
      coords.push([lng + lngOffset, lat + latOffset]);
    }
    return {
      type: 'Feature' as const,
      geometry: { type: 'Polygon' as const, coordinates: [coords] },
      properties: {},
    };
  };

  const updateRadiusCircle = () => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
    if (radius && radius > 0 && center) {
      const circleData = createCircleGeoJSON(center, radius);
      if (mapRef.current.getSource('radius-circle')) {
        (
          mapRef.current.getSource('radius-circle') as maplibregl.GeoJSONSource
        ).setData(circleData);
      } else {
        mapRef.current.addSource('radius-circle', {
          type: 'geojson',
          data: circleData,
        });
        mapRef.current.addLayer({
          id: 'radius-circle-fill',
          type: 'fill',
          source: 'radius-circle',
          paint: { 'fill-color': '#FF0000', 'fill-opacity': 0.2 },
        });
        mapRef.current.addLayer({
          id: 'radius-circle-line',
          type: 'line',
          source: 'radius-circle',
          paint: {
            'line-color': '#FF0000',
            'line-opacity': 0.8,
            'line-width': 2,
          },
        });
      }
    } else {
      if (mapRef.current.getSource('radius-circle')) {
        if (mapRef.current.getLayer('radius-circle-fill')) {
          mapRef.current.removeLayer('radius-circle-fill');
        }
        if (mapRef.current.getLayer('radius-circle-line')) {
          mapRef.current.removeLayer('radius-circle-line');
        }
        mapRef.current.removeSource('radius-circle');
      }
    }
  };

  return (
    <div
      ref={mapContainerRef}
      style={{ width, height }}
      className='rounded-lg overflow-hidden shadow-md'
    />
  );
};

export default MapLibreShowPoints;
