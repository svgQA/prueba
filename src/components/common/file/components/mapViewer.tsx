import { MapPoint } from '../../map/utils/interface';
import MapLibrePointsMap from '../../map/MapLibrePointsMap';
import Viewer from './viewer';

const MapViewer = ({
  mapPoint,
  clickable,
}: {
  mapPoint?: MapPoint | MapPoint[];
  clickable?: any;
}) => {
  const infoExpanded = (
    <MapLibrePointsMap
      name='map-points'
      pointsRef={
        Array.isArray(mapPoint) ? [...mapPoint] : mapPoint ? [mapPoint] : []
      }
      sendPoints={() => {}}
      disablePointSelection={true}
      center={{
        lat: Array.isArray(mapPoint)
          ? mapPoint[0]?.position.lat || 0
          : mapPoint?.position.lat || 0,
        lng: Array.isArray(mapPoint)
          ? mapPoint[0]?.position.lng || 0
          : mapPoint?.position.lng || 0,
      }}
      height='78vh'
      width='50%'
    />
  );

  return <Viewer posterSpan={clickable} infoExpanded={infoExpanded}></Viewer>;
};

export default MapViewer;
