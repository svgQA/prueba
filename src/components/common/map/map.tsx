import { type FunctionComponent } from 'preact';
import { type IMapProps } from './interface';
import {
  GoogleMap,
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
}) => {
  const [_, setMap] = React.useState(null);
  const [points, setPoint] = React.useState<{ id: number; position: any }[]>(
    []
  );
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    sendPoints(points);
  }, points);

  useEffect(() => {
    setPoint(pointsRef);
  }, pointsRef);

  const containerStyle = {
    width: width ?? '1100px',
    height: height ?? '350px',
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA3gRFb6tnTOMmU3gZWaGu85gVPQ9DTpS8',
  });

  const onLoad = React.useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
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

  const handleMapClick = (event: any) => {
    if (condition) {
      toast.error(`${errorCondition}`, {
        position: 'top-right',
      });

      return;
    }

    if (pointsAmount === 1) {
      setPoint([]);
    }

    const lat: number = event.latLng.lat();
    const lng: number = event.latLng.lng();

    const marker = {
      id: points.length + 1,
      position: {
        lat: lat,
        lng: lng,
      },
    };

    if (radialPoint) {
      const pointValidation = haversineDistance(radialPoint, marker);

      if (pointValidation) {
        toast.error(`${errorRadialPoint}`, {
          position: 'top-right',
        });

        return;
      }
    }

    setPoint((prevMarkers) => [...prevMarkers, marker]);
  };

  const handleMarkerDragEnd = (event: any, id: number) => {
    const lat: number = event.latLng.lat();
    const lng: number = event.latLng.lng();
    const pointsRef = JSON.parse(JSON.stringify(points));

    if (id === radialPoint.id) {
      setPoint([]);
      setPoint(pointsRef);

      toast.error('Punto del lugar no se debe mover', {
        position: 'top-right',
      });

      return;
    }

    const marker = {
      id: points.length + 1,
      position: {
        lat: lat,
        lng: lng,
      },
    };

    const pointValidation = haversineDistance(radialPoint, marker);

    if (pointValidation) {
      toast.error(`${errorRadialPoint}`, {
        position: 'top-right',
      });

      setPoint([]);
      setPoint(pointsRef);

      return;
    }

    setPoint([]);

    for (let item of pointsRef) {
      if (item.id === id) {
        item.position = {
          lat: lat,
          lng: lng,
        };
      }
    }

    setPoint(pointsRef);
  };

  const center = {
    lat: 4.670355108326989,
    lng: -74.08689346772478,
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };

  const handleMarkerClick = (id: any) => {
    const marker = points.find((item: any) => item.id === id);
    clickPoint?.(marker);
    setActiveMarker(id);
  };

  const getTitleLabel = (id: number): string => {
    const title = '';
    if (radialPoint && id === radialPoint.id) {
      return 'Lugar de referencia';
    }

    return title;
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
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
              position={{ lat: marker.position.lat, lng: marker.position.lng }}
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
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
};
