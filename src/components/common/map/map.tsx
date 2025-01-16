import { type FunctionComponent } from 'preact';
import { type IMapProps } from './interface';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import React from 'preact/compat';

export const Map: FunctionComponent<IMapProps> = ({
  addPlaceEvent,
  markers,
}) => {
  const [_, setMap] = React.useState(null);

  const containerStyle = {
    width: '1100px',
    height: '350px',
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

  const handleMapClick = (event: any) => {
    const lat: number = event.latLng.lat();
    const lng: number = event.latLng.lng();

    addPlaceEvent({ latitude: lat, longitude: lng });
  };

  const center = {
    lat: 4.670355108326989,
    lng: -74.08689346772478,
  };

  const getTitle = (marker: any): string => {
    return `Punto ${marker.id}, Latitud: ${marker.position.lat}, Longitud: ${marker.position.lng}`;
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
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={getTitle(marker)}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
};
