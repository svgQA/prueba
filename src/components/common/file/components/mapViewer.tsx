import { MapPoint } from '../../map/interface';
import MapLibrePointsMap from '../../map/MapLibrePointsMap';
import Viewer from './viewer';

const MapViewer = ({
  mapPoint,
  clickable,
}: {
  mapPoint?: MapPoint;
  clickable?: any;
}) => {
  const infoExpanded = (
    <MapLibrePointsMap
      name='map-points'
      pointsRef={[mapPoint]}
      sendPoints={() => {}}
      disablePointSelection={true}
      center={{
        lat: mapPoint?.position.lat || 0,
        lng: mapPoint?.position.lng || 0,
      }}
      height='78vh'
      width='50%'
    />
  );

  return <Viewer posterSpan={clickable} infoExpanded={infoExpanded}></Viewer>;
};

export default MapViewer;
