import { useEffect } from "preact/hooks";
import { MapPath } from "../../map/MapPath";
import Viewer from "./viewer";
import { useSignal } from "@preact/signals";
import { RoutePoint } from "@/services";
import { ToastManager } from "@/utils/toast/toast-manager";

const MapPathViewer = ({ src }: { src: string }) => {
    const points = useSignal<RoutePoint[]>([]);

    useEffect(() => {
        getData(src);
    }, []);

    const getData = async (src: string) => {
        try {
            const response = await fetch(src);
            const data = await response.json();
            points.value = data.map((value: any) => {
                return {
                    coords: [value.g, value.t],
                    action: value.e.e,
                } as RoutePoint;
            });
        } catch (error) {
            ToastManager.error('Error al obtener la ruta');
        }
    };

    return (
        <Viewer
            posterSpan={(
                <span className='vox-icon vx-icon-064 px-3' />
            )}
            infoExpanded={(
                <MapPath
                    route={points.value}
                    width='80%'
                />
            )}
        />
    );
}

export default MapPathViewer;