import { MapPoint } from "../../map/interface";
import MapLibrePointsMap from "../../map/MapLibrePointsMap";
import Viewer from "./viewer";


const MapViewer = ({ mapPoint }: { mapPoint?: MapPoint }) => {
    const infoExpanded = (
        <MapLibrePointsMap
            name='map-points'
            pointsRef={[mapPoint]}
            sendPoints={() => { }}
            disablePointSelection={true}
            center={{ lat: mapPoint?.position.lat || 0, lng: mapPoint?.position.lng || 0 }}
            height='78vh'
            width='50%'
        />
    );

    const posterSpan = (
        <div className='border border-b-light-dark dark:border-b-dark-light rounded-sm py-2 relative'>
            <span className='vox-icon vx-icon-064 px-3' />
        </div>
    );

    return (
        <Viewer posterSpan={posterSpan} infoExpanded={infoExpanded} ></Viewer>

    );
};

export default MapViewer;