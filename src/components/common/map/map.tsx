import { type FunctionComponent } from 'preact';
import { type IMapProps } from './interface';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React from 'preact/compat';

export const Map: FunctionComponent<IMapProps> = () => {
  const [map, setMap] = React.useState(null)
  
  const containerStyle = {
    width: '1100px',
    height: '350px',
  }
  
  const center = {
    lat: -3.745,
    lng: -38.523,
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA3gRFb6tnTOMmU3gZWaGu85gVPQ9DTpS8',
  })

  const onLoad = React.useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <></>
    </GoogleMap>
  ) : (
    <></>
  )
};
