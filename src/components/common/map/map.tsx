import { FunctionComponent } from 'preact';
import { IMapProps } from './interface';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import {
  GoogleMap,
  Polygon,
  Circle,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import React, { useState, useEffect } from 'preact/compat';
import { toast } from 'react-toastify';

export const Map: FunctionComponent<IMapProps> = ({
  pointsAmount,
  sendPoints,
  pointsRef,
  condition,
  errorCondition,
  radialPoint,
  errorRadialPoint,
  draggable,
  width,
  height,
  clickPoint,
  center = {
    lat: 4.670355108326989,
    lng: -74.08689346772478,
  },
  allowManualPoint,
  radius,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [points, setPoint] = useState<
    { id: number; position: google.maps.LatLngLiteral }[]
  >([]);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: string; lng: string }>({
    lat: '',
    lng: '',
  });
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(center);

  useEffect(() => {
    sendPoints(points);
  }, [points]);

  useEffect(() => {
    setPoint(pointsRef);
  }, [pointsRef]);

  const containerStyle = {
    width: width ?? '1100px',
    height: height ?? '350px',
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA3gRFb6tnTOMmU3gZWaGu85gVPQ9DTpS8',
  });

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    console.log(map);

    setMap(null);
  }, []);

  const haversineDistance = (markerReference: any, marker: any) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(markerReference.position.lat);
    const φ2 = toRad(marker.position.lat);
    const Δφ = toRad(marker.position.lat - markerReference.position.lat);
    const Δλ = toRad(marker.position.lng - markerReference.position.lng);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c > 1000;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'lat' | 'lng'
  ) => {
    const value = e.currentTarget.value;
    setCoords((prev) => ({ ...prev, [type]: value }));

    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      setMapCenter((prev) => ({ ...prev, [type]: newValue }));
    }
  };

  const addManualPoint = () => {
    const lat = parseFloat(coords.lat);
    const lng = parseFloat(coords.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkerOnMap(lat, lng);
    }
  };

  const setMarkerOnMap = (lat: number, lng: number) => {
    if (condition) {
      toast.error(`${errorCondition}`, { position: 'top-right' });
      return;
    }
    if (pointsAmount === 1) {
      setPoint([]);
      console.log('points.length', points);
      console.log('pointsAmount', pointsAmount);
    }

    const markerId = pointsAmount === 1 ? 1 : points.length + 1;

    const marker = { id: markerId, position: { lat, lng } };

    if (radialPoint) {
      const pointValidation = haversineDistance(radialPoint, marker);
      if (pointValidation) {
        toast.error(`${errorRadialPoint}`, { position: 'top-right' });
        return;
      }
    }

    setPoint((prevMarkers) => [...prevMarkers, marker]);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setMarkerOnMap(event.latLng.lat(), event.latLng.lng());
    }
  };

  const handleMarkerDragEnd = (
    event: google.maps.MapMouseEvent,
    id: number
  ) => {
    const lat = event.latLng?.lat() ?? 0;
    const lng = event.latLng?.lng() ?? 0;
    const pointsRef = JSON.parse(JSON.stringify(points));

    if (id === radialPoint?.id) {
      setPoint([]);
      setPoint(pointsRef);
      toast.error('Punto del lugar no se debe mover', {
        position: 'top-right',
      });
      return;
    }

    const marker = { id: points.length + 1, position: { lat, lng } };

    const pointValidation = haversineDistance(radialPoint, marker);

    if (pointValidation) {
      toast.error(`${errorRadialPoint}`, { position: 'top-right' });
      setPoint([]);
      setPoint(pointsRef);
      return;
    }

    setPoint([]);

    for (let item of pointsRef) {
      if (item.id === id) {
        item.position = { lat, lng };
      }
    }

    setPoint(pointsRef);
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };

  const handleMarkerClick = (id: number) => {
    const marker = points.find((item: any) => item.id === id);
    clickPoint?.(marker);
    setActiveMarker(id);
  };

  const removeMarkerById = (id: number): void => {
    const size = points.length;
    setPoint((prevPoints) =>
      prevPoints
        .filter((point) => point.id !== id)
        .map((val) => {
          return { ...val, id: validateOrder(val.id, size, id) };
        })
    );
  };

  const validateOrder = (number: number, size: number, id: number) => {
    if (id == size) return number;
    return number - 1 || 1;
  };

  const getTitleLabel = (id: number): string => {
    if (radialPoint && id === radialPoint.id) {
      return 'Lugar de referencia';
    }
    return `${id}`;
  };

  return isLoaded ? (
    <>
      {allowManualPoint && (
        <div className='grid grid-cols-5 gap-2'>
          <div className='col-span-2'>
            <Input
              name='latitude'
              placeholder='6.246631'
              label='Latitud'
              type='number'
              value={coords.lat}
              onChange={(e) => handleInputChange(e, 'lat')}
            />
          </div>
          <div className='col-span-2'>
            <Input
              name='longitude'
              placeholder='-75.581775'
              label='Longitud'
              type='number'
              value={coords.lng}
              onChange={(e) => handleInputChange(e, 'lng')}
            />
          </div>
          <div className='col-span-1 mt-auto'>
            <Button
              id='btn-add'
              name='btn-add'
              type='button'
              onClick={addManualPoint}
              label='Añadir'
              className='rounded-md bg-green-600 text-white px-4'
            />
          </div>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {points.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            draggable={!!draggable}
            onDragEnd={(event) => handleMarkerDragEnd(event, marker.id)}
            onClick={() => handleMarkerClick(marker.id)}
            label={getTitleLabel(marker.id)}
          >
            {activeMarker === marker.id && (
              <InfoWindow
                position={{
                  lat: marker.position.lat,
                  lng: marker.position.lng,
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <div>
                  <h1>Punto: {marker.id}</h1>
                  <p>
                    <strong>Lat:</strong> {marker.position.lat}
                  </p>
                  <p>
                    <strong>Lng:</strong> {marker.position.lng}
                  </p>
                  <Button
                    id='btn-delete-marker'
                    name='btn-delete-marker'
                    type='button'
                    onClick={() => {
                      removeMarkerById(marker.id);
                    }}
                    label='eliminar'
                    className='rounded-md bg-red-800 text-white px-4'
                  />
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}

        <Polygon
          paths={points.map((point) => point.position)}
          options={{
            fillColor: 'blue',
            fillOpacity: 0.2,
            strokeColor: 'blue',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />

        <Circle
          center={center}
          radius={radius}
          options={{
            fillColor: '#FF0000',
            fillOpacity: 0.2,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </>
  ) : null;
};
