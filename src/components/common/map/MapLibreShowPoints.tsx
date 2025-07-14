import type React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import maplibregl, { type Map as MaplibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { themeSignal } from '@/components/compose/button/signal.theme';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IMapProps, MapPoint } from './utils/interface';
import './utils/style.css';
import { getLocation, getLocationMap } from './components/map.location';

export const MapLibreShowPoints = ({
  pointsAmount = 100,
  allowManualPoint = false,
  sendPoints,
  pointsRef = [],
  center = {
    lat: 4.670355108326989,
    lng: -74.08689346772478,
  },
  condition = false,
  errorCondition = '',
  radialPoint = null,
  errorRadialPoint = '',
  draggable = true,
  width = '100%',
  height = '500px',
  clickPoint = () => { },
  radius,
  disablePointSelection = false,
  adminUser = false,
}: IMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const nextIdRef = useRef<number>(1);
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [coords, setCoords] = useState<{ lat: string; lng: string }>({
    lat: '',
    lng: '',
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [activePopup, setActivePopup] = useState<maplibregl.Popup | null>(null);
  const [isMarkerClick, setIsMarkerClick] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const { t } = useTranslation();
  const lastSentPointsRef = useRef<string>(JSON.stringify([]));

  const getMapStyle = () => {
    return themeSignal.value
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any existing map instance
    if (mapRef.current) {
      cleanupMap();
    }

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(),
      center: [center.lng, center.lat],
      zoom: 12,
    });

    const map = mapRef.current;

    map.on('load', () => {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
      map.on('click', handleMapClick);
      setIsMapReady(true);
      getUserLocation();
    });

    return () => {
      cleanupMap();
      setIsMapReady(false);
    };
  }, [center.lat, center.lng]);

  // Handle points updates
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    if (pointsRef && pointsRef.length > 0) {
      // Comparar si ya están los mismos puntos antes de reemplazar
      const currentIds = points.map((p) => p.id).sort();
      const refIds = pointsRef.map((p: any) => p.id).sort();
      const isSame = JSON.stringify(currentIds) === JSON.stringify(refIds);
      if (isSame) return;

      const highestId = Math.max(...pointsRef.map((point: any) => point.id), 0);
      nextIdRef.current = highestId + 1;

      const newPoints = JSON.parse(JSON.stringify(pointsRef));
      setPoints(newPoints);
    } else if (pointsRef && pointsRef.length === 0) {
      setPoints([]);
    }
  }, [pointsRef, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    updateMarkers();
    const filteredPoints = points.filter((p) => p.id !== -1);
    const filteredPointsStr = JSON.stringify(filteredPoints);
    if (lastSentPointsRef.current !== filteredPointsStr) {
      sendPoints(filteredPoints);
      lastSentPointsRef.current = filteredPointsStr;
    }

    // Ajustar el zoom SIEMPRE en base a los puntos
    if (points.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((point) => bounds.extend([point.position.lng, point.position.lat]));

      if (radialPoint) {
        bounds.extend([radialPoint.position.lng, radialPoint.position.lat]);
      }

      if (userLocation) {
        bounds.extend([userLocation.position.lng, userLocation.position.lat]);
      }

      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12, //15
        duration: 1000,
      });
    } else {
      mapRef.current.setCenter([center.lng, center.lat]);
      mapRef.current.setZoom(12);
    }
  }, [points, isMapReady]);

  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
    updateRadiusCircle();
  }, [radius, center]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getMapStyle());

    mapRef.current.on('style.load', () => {
      if (pointsRef && pointsRef.length > 0) {
        const newPoints = JSON.parse(JSON.stringify(pointsRef));
        setPoints(newPoints);
        updateMarkers();
      }
    });
  }, [themeSignal.value]);

  const cleanupMap = useCallback(() => {
    if (markersRef.current) {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    }

    if (activePopup) {
      activePopup.remove();
    }

    if (mapRef.current) {
      mapRef.current.off('click', handleMapClick);
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, [activePopup]);

  // Calculate distance between two points (Haversine formula)
  const haversineDistance = (point1: any, point2: any) => {
    const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const earthRadius = 6371000;
    const lat1Rad = degreesToRadians(point1.position.lat);
    const lat2Rad = degreesToRadians(point2.position.lat);
    const latDiffRad = degreesToRadians(
      point2.position.lat - point1.position.lat
    );
    const lngDiffRad = degreesToRadians(
      point2.position.lng - point1.position.lng
    );
    const a =
      Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(lngDiffRad / 2) *
      Math.sin(lngDiffRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance > 1000;
  };

  // Handle map click event
  const handleMapClick = (e: maplibregl.MapMouseEvent) => {
    if (isMarkerClick) {
      setIsMarkerClick(false);
      return;
    }

    if (disablePointSelection) return;
    const { lng, lat } = e.lngLat;
    setMarkerOnMap(lat, lng);
  };

  // Add a marker to the map
  const setMarkerOnMap = (lat: number, lng: number) => {
    if (condition) {
      ToastManager.error(`${errorCondition}`);
      return;
    }

    if (pointsAmount === 1) setPoints([]);
    const newPoint: MapPoint = {
      id: nextIdRef.current++,
      position: { lat, lng },
    };

    if (radialPoint) {
      const pointValidation = haversineDistance(radialPoint, newPoint);
      if (pointValidation) {
        ToastManager.error(`${errorRadialPoint}`);
        return;
      }
    }

    setPoints((prevPoints) => [...prevPoints, newPoint]); 
  };

  // Create marker element with number
  const createMarkerElement = (point: MapPoint, index: number) => {
    const el = document.createElement('div');
    el.className = 'marker-container';
    el.setAttribute('data-id', point?.id?.toString() || '');
    el.setAttribute('data-index', (index + 1).toString());

    // Special styling for user location marker
    const isUserLocation = point.id === -1;
    const markerColor = isUserLocation
      ? '#10B981' // Green color for user location
      : radialPoint && point?.id === radialPoint?.id
        ? '#2563EB'
        : '#EA4335';

    el.innerHTML = `
    <div style="
      position: relative;
      width: 24px;
      height: 38px;
      cursor: pointer;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="38" viewBox="0 0 24 38">
        <path fill="${markerColor}"
              d="M12 0C5.4 0 0 5.4 0 12c0 6.5 12 25 12 25s12-18.5 12-25c0-6.6-5.4-12-12-12z" />
        <circle fill="#FFFFFF" cx="12" cy="12" r="9" />
        <text
          fill="${markerColor}"
          x="${isUserLocation ? 8 : index + 1 >= 10 ? 5 : 10}"
          y="12.5"
          fontFamily="Arial, sans-serif"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          dy=".3em"
        >${isUserLocation ? 'U' : index + 1}</text>
      </svg>
    </div>
  `;
    return el;
  };

  // Close active popup
  const closeActivePopup = useCallback(() => {
    if (activePopup) {
      activePopup.remove();
      setActivePopup(null);
    }
    setIsMarkerClick(false);
    // setActiveMarker(null);
  }, [activePopup]);

  // Update all markers on the map
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
      ) {
        return;
      }

      const markerEl = createMarkerElement(point, index);
      const isRadialPoint = radialPoint && point?.id === radialPoint?.id;

      const marker = new maplibregl.Marker({
        element: markerEl,
        draggable: draggable && !isRadialPoint,
      }).setLngLat([point.position.lng, point.position.lat]);

      if (mapRef.current) {
        marker.addTo(mapRef.current);
      }

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        handleMarkerDragEnd(point.id, lngLat.lat, lngLat.lng);
      });

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        setIsMarkerClick(true);
        closeActivePopup();
        setTimeout(() => {
          handleMarkerClick(point.id);
        }, 10);
      });

      markersRef.current.push(marker);
    });

    updateRadiusCircle();
  };

  // Create GeoJSON for circle
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
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coords],
      },
      properties: {},
    };
  };

  // Update radius circle on map
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
          paint: {
            'fill-color': '#FF0000',
            'fill-opacity': 0.2,
          },
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
      // Remove circle if no radius specified
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

  // Handle marker drag end
  const handleMarkerDragEnd = (id: number, lat: number, lng: number) => {
    if (radialPoint?.id === id) {
      ToastManager.error(t('maps.connect.error_point_move'));
      updateMarkers();
      return;
    }

    if (radialPoint) {
      const testPoint = { position: { lat, lng } };
      const pointValidation = haversineDistance(radialPoint, testPoint);
      if (pointValidation) {
        ToastManager.error(`${errorRadialPoint}`);
        updateMarkers();
        return;
      }
    }

    if (id === -1) {
      setUserLocation((prev) => ({
        ...prev!,
        position: { lat, lng },
      }));
    } else {
      // Para puntos normales
      setPoints((prevPoints) =>
        prevPoints.map((point) =>
          point.id === id ? { ...point, position: { lat, lng } } : point
        )
      );
    }
  };

  // Handle marker click
  const handleMarkerClick = (id: number) => {
    const point = id === -1 ? userLocation : points.find((p) => p.id === id);
    if (!point || !mapRef.current) return;

    clickPoint?.(point);
  };

  // Handle input change for manual coordinates
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'lat' | 'lng'
  ) => {
    const value = e.currentTarget.value;
    setCoords((prev) => ({ ...prev, [type]: value }));
  };

  // Add point manually from coordinates
  const addManualPoint = () => {
    const lat = Number.parseFloat(coords.lat);
    const lng = Number.parseFloat(coords.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkerOnMap(lat, lng);
      setCoords({ lat: '', lng: '' });
    } else {
      ToastManager.error(t('maps.connect.error_point'));
    }
  };

  const getUserLocation = useCallback(async () => {
    if (!adminUser) {
      return;
    }

    const exactCoordinates = await getLocationMap();

    const newUserPoint: MapPoint = {
      id: -1,
      position: exactCoordinates,
    };
    setUserLocation(newUserPoint);

    if (mapRef.current) {
      updateMarkers();
      mapRef.current.flyTo({
        center: [exactCoordinates.lng, exactCoordinates.lat],
        zoom: 18,
        essential: true,
      });
    }
  }, [adminUser]);

  useEffect(() => {
    if (!adminUser) return;

    let mounted = true;

    const checkAndMonitorPermissions = async () => {
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });
      if (!mounted) return;

      const handlePermissionChange = (e: Event) => {
        if (!mounted) return;

        const target = e.target as PermissionStatus;
        const newState = target.state;

        if (newState === 'granted') {
          ToastManager.success(t('maps.connect.success'));
          getUserLocation();
        } else if (newState === 'denied') {
          ToastManager.error(t('maps.connect.error_permission'));
          setUserLocation(null);
        }
      };

      permission.addEventListener('change', handlePermissionChange);

      // Initial check for granted permission
      if (permission.state === 'granted') {
        ToastManager.success(t('maps.connect.success'));
        getUserLocation();
      }

      return () => {
        permission.removeEventListener('change', handlePermissionChange);
      };
    };

    checkAndMonitorPermissions();

    return () => {
      mounted = false;
    };
  }, [adminUser, getUserLocation, t]);

  // Clean up watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Add useEffect to update markers when userLocation changes
  useEffect(() => {
    if (isMapReady && userLocation && adminUser) {
      updateMarkers();
    }
  }, [userLocation, isMapReady, adminUser]);

  return (
    <>
      {allowManualPoint && (
        <div className='flex flex-row gap-2 items-center justify-center w-full pb-1'>
          <div className='flex flex-row items-end justify-between gap-x-2 py-1 w-full'>
            <Input
              name='latitude'
              placeholder='6.246631'
              label='Latitud'
              type='number'
              value={coords.lat}
              onChange={(e) => handleInputChange(e, 'lat')}
            />

            <Input
              name='longitude'
              placeholder='-75.581775'
              label='Longitud'
              type='number'
              value={coords.lng}
              onChange={(e) => handleInputChange(e, 'lng')}
            />
          </div>
          <div className='pt-5'>
            <Button
              id='btn-add'
              name='btn-add'
              type='button'
              onClick={addManualPoint}
              label='Añadir'
              icon='039'
            />
          </div>
        </div>
      )}
      <div
        ref={mapContainerRef}
        style={{ width, height }}
        className='rounded-lg overflow-hidden shadow-md'
      />
    </>
  );
};

export default MapLibreShowPoints;
