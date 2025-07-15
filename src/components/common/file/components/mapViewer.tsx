import { MapPoint } from '../../map/utils/interface';
import MapLibrePointsMap from '../../map/MapLibrePointsMap';
import Viewer from './viewer';

const MapViewer = ({
  mapPoint,
  clickable,
  title
}: {
  mapPoint?: MapPoint | MapPoint[];
  clickable?: any;
  title?: string;
}) => {
  const infoExpanded = (
    <div className="w-1/2 mx-auto">
      {title && (
        <div className="flex justify-center mb-4">
          <span className={'text-xl font-bold text-white'}>{title}</span>
        </div>
      )}
      <MapLibrePointsMap
        name='map-points'
        pointsRef={Array.isArray(mapPoint) ? [...mapPoint] : mapPoint ? [mapPoint] : []}
        sendPoints={() => { }}
        disablePointSelection={true}
        center={{
          lat: Array.isArray(mapPoint) ? mapPoint[0]?.position.lat || 0 : mapPoint?.position.lat || 0,
          lng: Array.isArray(mapPoint) ? mapPoint[0]?.position.lng || 0 : mapPoint?.position.lng || 0,
        }}
        height='78vh'
        width='100%'
      />
    </div>
  );

  return <Viewer posterSpan={clickable} infoExpanded={infoExpanded}></Viewer>;
};

export default MapViewer;
