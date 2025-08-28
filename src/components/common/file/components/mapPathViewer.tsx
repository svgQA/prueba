import { MapPath } from '../../map/MapPath';
import Viewer from './viewer';
import { useSignal } from '@preact/signals';
import { RoutePoint } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';

const MapPathViewer = ({ src }: { src: string }) => {
  const points = useSignal<RoutePoint[]>([]);
  const message = useSignal<string>('Cargando ruta...');

  const getData = async () => {
    if (!src) return;

    try {
      const response = await fetch(src);
      const data = await response.json();
      const filteredData = data.filter((value: any) => {
        return (
          value?.h !== 'undefined' &&
          value?.h &&
          value?.g &&
          value?.t &&
          value?.e?.e &&
          !value?.timestamp
        );
      });

      points.value = filteredData.map((value: any) => {
        return {
          coords: [value.g, value.t],
          action: value.e.e,
        } as RoutePoint;
      });
      if(points.value.length === 0) {
        message.value = 'No hay datos de ruta disponibles';
      }
    } catch (error) {
      ToastManager.error('Error al obtener la ruta');
    }
  };

  return (
    <Viewer
      posterSpan={<span className='vox-icon vx-icon-321 px-3' />}
      infoExpanded={
        points.value.length > 0 ? (
          <MapPath route={points.value} width='80%' />
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <span>{message.value}</span>
          </div>
        )
      }
      click={getData}
    />
  );
};

export default MapPathViewer;
