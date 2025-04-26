import type React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl, { type Map as MaplibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { toast } from 'react-toastify';
import { IMapProps, MapPoint } from './interface';
import { themeSignal } from '@/components/compose/button/signal.theme';

export const MapLibrePointsMap = ({
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
  clickPoint = () => {},
  radius,
  disablePointSelection = false,
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
  const [editCoords, setEditCoords] = useState<{ lat: string; lng: string }>({
    lat: '',
    lng: '',
  });
  // const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [activePopup, setActivePopup] = useState<maplibregl.Popup | null>(null);
  const [isMarkerClick, setIsMarkerClick] = useState<boolean>(false);

  // Map style configuration
  /*
  const mapStyle: maplibregl.StyleSpecification = {
    version: 8,
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
  */

  const getMapStyle = () => {
    return themeSignal.value
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  };
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(),
      center: [center.lng, center.lat],
      zoom: 12,
    });

    const map = mapRef.current;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
    map.on('click', handleMapClick);

    return () => {
      cleanupMap();
    };
  }, []);

  // Update map style when theme changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getMapStyle());
  }, [themeSignal.value]);

  // Load initial points
  useEffect(() => {
    if (pointsRef && pointsRef.length > 0) {
      const highestId = Math.max(
        ...pointsRef.map((point: MapPoint) => point.id),
        0
      );
      nextIdRef.current = highestId + 1;
      setPoints(pointsRef);
    } else {
      setPoints([]);
    }
  }, [pointsRef]);

  // Update markers and send points to parent
  useEffect(() => {
    updateMarkers();
    sendPoints(points);
  }, [points]);

  // Update circle when radius changes
  useEffect(() => {
    updateRadiusCircle();
  }, [radius, center]);

  // Clean up map resources
  const cleanupMap = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (activePopup) {
      activePopup.remove();
    }

    if (mapRef.current) {
      mapRef.current.off('click', handleMapClick);
      mapRef.current.remove();
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

    if (disablePointSelection) {
      return;
    }

    const { lng, lat } = e.lngLat;
    setMarkerOnMap(lat, lng);
  };

  // Add a marker to the map
  const setMarkerOnMap = (lat: number, lng: number) => {
    if (condition) {
      toast.error(`${errorCondition}`, { position: 'top-right' });
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
        toast.error(`${errorRadialPoint}`, { position: 'top-right' });
        return;
      }
    }

    setPoints((prevPoints) => [...prevPoints, newPoint]);
  };

  // Create marker element with number
  const createMarkerElement = (point: MapPoint, index: number) => {
    const el = document.createElement('div');
    el.className = 'marker-container';
    el.setAttribute('data-id', point.id.toString());
    el.setAttribute('data-index', (index + 1).toString());

    el.innerHTML = `
    <div style="
      position: relative;
      width: 24px;
      height: 38px;
      cursor: pointer;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="38" viewBox="0 0 24 38">
        <path fill="${radialPoint && point.id === radialPoint.id ? '#2563EB' : '#EA4335'}" 
              d="M12 0C5.4 0 0 5.4 0 12c0 6.5 12 25 12 25s12-18.5 12-25c0-6.6-5.4-12-12-12z" />
        <circle fill="#FFFFFF" cx="12" cy="12" r="9" />
        <text 
          fill="${radialPoint && point.id === radialPoint.id ? '#2563EB' : '#EA4335'}" 
          x="${(index + 1) >= 10 ? 5 : 10}" 
          y="12.5" 
          fontFamily="Arial, sans-serif" 
          fontSize="10" 
          fontWeight="bold" 
          textAnchor="middle" 
          dy=".3em"
        >${index + 1}</text>
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
    // setActiveMarker(null);
  }, [activePopup]);

  // Update all markers on the map
  const updateMarkers = () => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    points.forEach((point, index) => {
      const markerEl = createMarkerElement(point, index);
      const isRadialPoint = radialPoint && point.id === radialPoint.id;

      const marker = new maplibregl.Marker({
        element: markerEl,
        draggable: draggable && !isRadialPoint,
      })
        .setLngLat([point.position.lng, point.position.lat])
        .addTo(mapRef.current!);

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
    if (!mapRef.current) return;

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
      toast.error('Punto del lugar no se debe mover', {
        position: 'top-right',
      });
      updateMarkers();
      return;
    }

    if (radialPoint) {
      const testPoint = { position: { lat, lng } };
      const pointValidation = haversineDistance(radialPoint, testPoint);
      if (pointValidation) {
        toast.error(`${errorRadialPoint}`, { position: 'top-right' });
        updateMarkers();
        return;
      }
    }

    setPoints((prevPoints) =>
      prevPoints.map((point) =>
        point.id === id ? { ...point, position: { lat, lng } } : point
      )
    );
  };

  // Handle marker click
  const handleMarkerClick = (id: number) => {
    const point = points.find((p) => p.id === id);
    if (!point || !mapRef.current) return;

    // setActiveMarker(id);
    setEditCoords({
      lat: point.position.lat.toString(),
      lng: point.position.lng.toString(),
    });
    clickPoint?.(point);

    const popupNode = document.createElement('div');
    popupNode.className =
      'bg-white rounded-md shadow-sm overflow-hidden w-full p-2';
    popupNode.innerHTML = `
      <div>
        <div class="flex flex-col mb-2">
          <label class="text-sm mb-1">Latitude</label>
          <input id="edit-lat" type="text" value="${point.position.lat}" class="w-full text-sm p-1 border rounded" />
          
          <label class="text-sm mb-1 mt-2">Longitude</label>
          <input id="edit-lng" type="text" value="${point.position.lng}" class="w-full text-sm p-1 border rounded" />
        </div>
        
        <div class="flex justify-between mt-2">
          <button id="btn-delete" class="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded">
            Delete
          </button>
          <button id="btn-edit" class="bg-primary hover:bg-primary-dark text-white text-xs py-1 px-2 rounded">
            Update
          </button>
        </div>
      </div>
    `;

    const popup = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: [0, -30],
      maxWidth: '240px',
    })
      .setLngLat([point.position.lng, point.position.lat])
      .setDOMContent(popupNode)
      .addTo(mapRef.current);

    setActivePopup(popup);

    const editLatInput = popupNode.querySelector(
      '#edit-lat'
    ) as HTMLInputElement;
    const editLngInput = popupNode.querySelector(
      '#edit-lng'
    ) as HTMLInputElement;
    const deleteButton = popupNode.querySelector('#btn-delete');
    const editButton = popupNode.querySelector('#btn-edit');

    editLatInput.addEventListener('input', (e) => {
      setEditCoords((prev) => ({
        ...prev,
        lat: (e.target as HTMLInputElement).value,
      }));
    });

    editLngInput.addEventListener('input', (e) => {
      setEditCoords((prev) => ({
        ...prev,
        lng: (e.target as HTMLInputElement).value,
      }));
    });

    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        removeMarkerById(id);
        popup.remove();
      });
    }

    if (editButton) {
      editButton.addEventListener('click', () => {
        editMarkerById(id);
        popup.remove();
      });
    }

    popup.on('close', () => {
      // setActiveMarker(null);
      setActivePopup(null);
    });
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
      toast.error('Por favor ingrese coordenadas válidas', {
        position: 'top-right',
      });
    }
  };

  // Remove marker by ID
  const removeMarkerById = (id: number): void => {
    const pointExists = points.some((p) => p.id === id);

    if (!pointExists) {
      toast.error('No se pudo encontrar el punto para eliminar', {
        position: 'top-right',
      });
      return;
    }

    setPoints((prevPoints) => {
      const newPoints = prevPoints.filter((p) => p.id !== id);
      toast.success('Punto eliminado correctamente', { position: 'top-right' });
      return newPoints;
    });

    closeActivePopup();
  };

  // Edit marker coordinates by ID
  const editMarkerById = (id: number): void => {
    const newLat = Number.parseFloat(editCoords.lat);
    const newLng = Number.parseFloat(editCoords.lng);

    if (isNaN(newLat) || isNaN(newLng)) {
      toast.error('Por favor ingrese coordenadas válidas', {
        position: 'top-right',
      });
      return;
    }

    setPoints((prevPoints) =>
      prevPoints.map((point) =>
        point.id === id
          ? { ...point, position: { lat: newLat, lng: newLng } }
          : point
      )
    );

    closeActivePopup();
    toast.success('Punto actualizado correctamente', { position: 'top-right' });
  };

  return (
    <>
      {allowManualPoint && (
        <div className='flex flex-row items-end justify-between gap-x-2 py-1'>
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

          <Button
            id='btn-add'
            name='btn-add'
            type='button'
            onClick={addManualPoint}
            label='Añadir'
            className='rounded-md bg-primary text-white px-4 py-2 my-1'
          />
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

export default MapLibrePointsMap;
