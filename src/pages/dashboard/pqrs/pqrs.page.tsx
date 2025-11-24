import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  SOCKET_MESSAGE_EVENTS,
  MessageEvent,
  MESSAGE_LISTENERS,
} from '@/utils/socket/manager/types';

import { Button } from '@/components/common/button/button';
import { Loading } from '@/components/common/loading/loading';
import { TextEllipsis } from '@/components/common/text-ellipsis';

import { PqrsService } from '@/services/pqrs/pqrs';

import { ICPqrsRequest } from './utils/interface';
import { StageService } from '@/services/pqrs/stage';
import { PqrsCards } from './components/pqrs.card';
import { Badge } from '@/components/common/badge/badge';
import { PqrsUpsert } from './components/pqrs.upsert';
import { IOption } from '@/components/common/smart-selector/smart-select';
import { uuid } from 'short-uuid';
import { useTranslation } from 'react-i18next';

interface ColumnConfig {
  title: string;
  colorClass: string;
  bgColorClass: string;
}

type ViewMode = 'cards' | 'dashboard';

export const PqrsPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const pqrs = useSignal<ICPqrsRequest[]>([]);
  const loading = useSignal<boolean>(true);
  const groupedPqrs = useSignal<Record<string, ICPqrsRequest[]>>({});
  const columns = useSignal<ColumnConfig[]>([]);
  const openModalUpsert = useSignal<boolean>(false);
  const viewMode = useSignal<ViewMode>('cards');

  useEffect(() => {
    Promise.all([fetchingAllData()]);
  }, []);

  useEffect(() => {
    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.PQRS,
      handleMessage,
      MESSAGE_LISTENERS.PQRS_AI
    );
    return () => {
      WebSocketManager.remove(
        SOCKET_MESSAGE_AREA.PQRS,
        MESSAGE_LISTENERS.PQRS_AI
      );
    };
  }, []);

  const handleMessage = async (event: InSocketMessage<MessageEvent>) => {
    const { type: name } = event.payload;
    if (name === SOCKET_MESSAGE_EVENTS.CHANGE_STATUS) await fetchingAllData();
  };

  const fetchingAllData = async () => {
    await getPqrs();
    await getPqrsGrouped();
  };

  const getPqrs = async () => {
    loading.value = true;
    const response = await PqrsService.get_all();
    if (!response.getStatus()) return;
    pqrs.value = response.getMany();
    loading.value = false;
  };

  const getStatus = async () => {
    const response = await StageService.getSimpleList();
    if (!response.getStatus()) return;
    groupedPqrs.value = {};
    const list: IOption[] = response.getMany();

    const createdStatus = list.find((item) => item.label === 'created') || {
      value: uuid(),
      label: 'created',
    };
    const finishedStatus = list.find((item) => item.label === 'finished') || {
      value: uuid(),
      label: 'finished',
    };
    const middleStatuses = list.filter(
      (item) => item.label !== 'created' && item.label !== 'finished'
    );
    const orderedList = [createdStatus, ...middleStatuses, finishedStatus];

    orderedList.forEach((statusItem) => {
      const normalizedStatus = statusItem.label.toLowerCase();
      if (!groupedPqrs.value[normalizedStatus]) {
        groupedPqrs.value[normalizedStatus] = [];
      }
    });
  };

  const getPqrsGrouped = async () => {
    loading.value = true;
    await getStatus();

    pqrs.value.forEach((item: ICPqrsRequest) => {
      const normalizedStatus = item.status.toLowerCase();
      if (!groupedPqrs.value[normalizedStatus]) {
        groupedPqrs.value[normalizedStatus] = [];
      }
      groupedPqrs.value[normalizedStatus].push(item);
    });

    columns.value = getColumns(groupedPqrs.value);
    loading.value = false;
  };

  const getColumns = (
    grouped: Record<string, ICPqrsRequest[]>
  ): ColumnConfig[] => {
    const colors = [
      { colorClass: 'text-caution', bgColorClass: 'bg-caution-opacity' },
      { colorClass: 'text-primary', bgColorClass: 'bg-primary-opacity' },
      { colorClass: 'text-secondary', bgColorClass: 'bg-secondary-opacity' },
      { colorClass: 'text-error', bgColorClass: 'bg-error-opacity' },
      { colorClass: 'text-ternary', bgColorClass: 'bg-primary-opacity' },
    ];

    return Object.entries(grouped).map(([status], index) => {
      return {
        title: status,
        colorClass: colors[index % colors.length].colorClass,
        bgColorClass: colors[index % colors.length].bgColorClass,
      };
    });
  };

  // Mapear colorClass a status del Badge
  const getColumnBadgeStatus = (
    colorClass: string
  ): 'error' | 'success' | 'warning' | 'info' | 'ternary' => {
    if (colorClass.includes('error')) return 'error';
    if (colorClass.includes('secondary')) return 'success';
    if (colorClass.includes('caution')) return 'warning';
    if (colorClass.includes('ternary')) return 'ternary';
    return 'info';
  };

  const closeModalUpsert = async () => {
    openModalUpsert.value = false;
    await fetchingAllData();
  };

  const SkeletonBlock = ({
    className = '',
  }: {
    className?: string;
  }) => <div class={`animate-pulse bg-gray-100 rounded ${className}`} />;

  const DashboardPreview = () => (
    <div class='grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6'>
      <div class='xl:col-span-2 space-y-6'>
        <div class='bg-white border border-gray-border rounded-xl p-6 shadow-sm'>
          <div class='flex items-start justify-between flex-wrap gap-4'>
            <div>
              <p class='text-xs uppercase text-gray-text-light tracking-wide'>
                Resumen operativo
              </p>
              <h2 class='text-xl font-semibold text-t-light'>Dashboard de atención</h2>
              <p class='text-sm text-gray-text-light mt-1 max-w-xl'>
                Usa este espacio para visualizar el desempeño de PQRS: números atendidos
                por mes, resoluciones automáticas con IA y desglose por áreas o niveles de
                prioridad.
              </p>
            </div>
            <div class='flex items-center gap-2 bg-b-light border border-gray-border rounded-full px-4 py-2 text-xs text-gray-text-light'>
              <span class='w-2 h-2 rounded-full bg-primary animate-pulse'></span>
              Diseño previo — listo para conectar con el backend
            </div>
          </div>

          <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            {[{
              title: 'Atenciones del mes',
              helper: 'Incluye totales y porcentaje vs. mes anterior',
            },
            {
              title: 'Resueltas por IA',
              helper: 'Qué porcentaje resolvió el chatbot o agente virtual',
            },
            {
              title: 'Prioridad alta',
              helper: 'Cuántas solicitudes críticas siguen abiertas',
            },
            {
              title: 'Área con más casos',
              helper: 'Top 3 áreas con mayor volumen y tiempos de respuesta',
            },
            {
              title: 'SLA promedio',
              helper: 'Duración desde radicación hasta resolución',
            },
            {
              title: 'Satisfacción',
              helper: 'NPS/CSAT asociado a casos atendidos',
            }].map((card, idx) => (
              <div
                key={`${card.title}-${idx}`}
                class='p-4 rounded-lg border border-gray-border bg-b-light/60 hover:bg-b-light transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
              >
                <div class='flex items-start justify-between gap-3'>
                  <div>
                    <p class='text-xs text-gray-text-light uppercase tracking-wide'>
                      {card.title}
                    </p>
                    <p class='text-[13px] text-gray-text-light mt-1 leading-snug'>
                      {card.helper}
                    </p>
                  </div>
                  <span class='px-2 py-1 text-[11px] rounded-full bg-primary-opacity text-primary border border-primary/30'>
                    Placeholder
                  </span>
                </div>
                <div class='mt-4 space-y-2'>
                  <SkeletonBlock className='h-6 w-24' />
                  <SkeletonBlock className='h-3 w-20' />
                  <SkeletonBlock className='h-2 w-full' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div class='p-6 rounded-xl bg-white border border-gray-border shadow-sm'>
            <div class='flex items-start justify-between gap-2'>
              <div>
                <p class='text-xs text-gray-text-light uppercase tracking-wide'>
                  Gráfica sugerida
                </p>
                <h3 class='text-lg font-semibold text-t-light'>
                  Distribución por estado y prioridad
                </h3>
                <p class='text-sm text-gray-text-light'>
                  Aquí podría ir una gráfica de barras apiladas con estados (creado, en
                  proceso, finalizado) y prioridades alta/media/baja.
                </p>
              </div>
              <Badge label='Gráfico' status='info' outline size='xs' width='w-fit' />
            </div>

            <div class='mt-4 h-52 rounded-lg border border-gray-border bg-b-light flex items-center justify-center'>
              <div class='w-full px-4 space-y-3'>
                <SkeletonBlock className='h-4 w-1/2' />
                <SkeletonBlock className='h-4 w-2/3' />
                <SkeletonBlock className='h-24 w-full' />
              </div>
            </div>
          </div>

          <div class='p-6 rounded-xl bg-white border border-gray-border shadow-sm'>
            <div class='flex items-start justify-between gap-2'>
              <div>
                <p class='text-xs text-gray-text-light uppercase tracking-wide'>
                  Tendencia semanal
                </p>
                <h3 class='text-lg font-semibold text-t-light'>
                  Tiempo de respuesta y casos por día
                </h3>
                <p class='text-sm text-gray-text-light'>
                  Reserva este espacio para una gráfica de líneas con casos atendidos y
                  tiempos promedio de resolución.
                </p>
              </div>
              <Badge label='Línea' status='secondary' outline size='xs' width='w-fit' />
            </div>

            <div class='mt-4 h-52 rounded-lg border border-gray-border bg-b-light flex items-center justify-center'>
              <div class='w-full px-4 space-y-3'>
                <SkeletonBlock className='h-4 w-2/5' />
                <SkeletonBlock className='h-28 w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class='space-y-6'>
        <div class='p-6 rounded-xl bg-white border border-gray-border shadow-sm'>
          <div class='flex items-start justify-between gap-2'>
            <div>
              <p class='text-xs text-gray-text-light uppercase tracking-wide'>
                Tablas recomendadas
              </p>
              <h3 class='text-lg font-semibold text-t-light'>
                Casos por agente o área
              </h3>
              <p class='text-sm text-gray-text-light'>
                Ideal para listar detalle de casos abiertos, SLA, responsable y prioridad.
              </p>
            </div>
            <Badge label='Tabla' status='warning' outline size='xs' width='w-fit' />
          </div>

          <div class='mt-4 space-y-3'>
            {[...Array(5)].map((_, idx) => (
              <div
                key={`row-${idx}`}
                class='flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-border bg-b-light/60'
              >
                <div class='flex items-center gap-3'>
                  <SkeletonBlock className='h-10 w-10 rounded-full' />
                  <div class='space-y-1'>
                    <SkeletonBlock className='h-3 w-32' />
                    <SkeletonBlock className='h-2 w-24' />
                  </div>
                </div>
                <div class='flex items-center gap-2'>
                  <SkeletonBlock className='h-3 w-10 rounded-full' />
                  <SkeletonBlock className='h-3 w-14 rounded-full' />
                  <SkeletonBlock className='h-3 w-10 rounded-full' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class='p-6 rounded-xl bg-white border border-gray-border shadow-sm'>
          <div class='flex items-start justify-between gap-2'>
            <div>
              <p class='text-xs text-gray-text-light uppercase tracking-wide'>
                Alertas clave
              </p>
              <h3 class='text-lg font-semibold text-t-light'>
                Casos a punto de vencer
              </h3>
              <p class='text-sm text-gray-text-light'>
                Lista de casos con fecha límite cercana para priorizar acciones.
              </p>
            </div>
            <Badge label='Recordatorios' status='error' outline size='xs' width='w-fit' />
          </div>

          <div class='mt-4 space-y-3'>
            {[...Array(3)].map((_, idx) => (
              <div
                key={`alert-${idx}`}
                class='p-3 rounded-lg border border-error-opacity bg-error-opacity/20 text-error'
              >
                <div class='flex items-center justify-between'>
                  <SkeletonBlock className='h-3 w-40 bg-error/30' />
                  <SkeletonBlock className='h-3 w-12 bg-error/30' />
                </div>
                <SkeletonBlock className='h-2 w-full mt-2 bg-error/20' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class='p-6 h-full space-y-4'>
      <div class='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div>
          <p class='text-xs uppercase text-gray-text-light tracking-wide'>PQRS</p>
          <h1 class='text-2xl font-bold text-t-light'>Gestión y experiencia</h1>
          <p class='text-sm text-gray-text-light max-w-2xl'>
            Alterna entre la vista de tarjetas y un dashboard preliminar para planificar los
            indicadores de atención al cliente.
          </p>
        </div>

        <div class='flex items-center gap-3'>
          <div class='bg-b-light border border-gray-border rounded-full p-1 flex gap-1'>
            {[{ id: 'cards', label: 'Tarjetas' }, { id: 'dashboard', label: 'Dashboard' }].map(
              (option) => (
                <button
                  key={option.id}
                  class={`px-4 py-2 text-sm font-medium rounded-full transition-all shadow-sm ${
                    viewMode.value === option.id
                      ? 'bg-primary text-white shadow-primary/20'
                      : 'text-gray-text-light hover:text-t-light'
                  }`}
                  onClick={() => (viewMode.value = option.id as ViewMode)}
                >
                  {option.label}
                </button>
              )
            )}
          </div>

          <div class='flex gap-2'>
            <Button
              name='btn-refresh'
              onClick={() => fetchingAllData()}
              label='h_refresh'
              icon='050'
              iconSize='sm'
            />
            <Button
              name='btn-upsert-pqrs'
              onClick={() => (openModalUpsert.value = true)}
              label='create'
              icon='044'
              iconSize='sm'
            />
          </div>
        </div>
      </div>

      {viewMode.value === 'cards' && (
        <div class='flex gap-6 overflow-x-auto vox-scroll-design pb-6'>
          {columns.value.map((column, index) => {
            const items = groupedPqrs.value[column.title] ?? [];
            return (
              <div
                key={index}
                class={`${column.bgColorClass} rounded-xl p-4 min-h-96 w-80 flex-shrink-0 border border-gray-border/60 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-sm`}
              >
                <div class='flex items-center justify-between mb-4 gap-2'>
                  <h3
                    class={`font-semibold flex items-center gap-2 ${column.colorClass} flex-1 min-w-0`}
                  >
                    <div
                      class={`w-3 h-3 rounded-full flex-shrink-0 ${column.colorClass.replace('text-', 'bg-')}`}
                    />
                    <TextEllipsis
                      text={t(column.title)}
                      maxWidth='100%'
                      lines={1}
                    />
                  </h3>
                  <Badge
                    label={String(items.length)}
                    status={getColumnBadgeStatus(column.colorClass)}
                    outline
                    borderless
                    size='xs'
                    width='w-fit'
                  />
                </div>

                <div class='space-y-2 max-h-96 overflow-y-auto vox-scroll-design pr-1'>
                  {items.map((item: ICPqrsRequest, index) => {
                    return (
                      <PqrsCards
                        key={item.id}
                        pqrs={item}
                        index={index}
                        columnColorClass={column.colorClass}
                      />
                    );
                  })}
                  {items.length === 0 && (
                    <div class='text-center py-8 text-gray-text-light opacity-60 border border-dashed border-gray-border rounded-lg bg-white/60'>
                      <p class='text-sm'>No hay PQRS en esta columna</p>
                      <p class='text-xs mt-1'>Crea un nuevo caso para empezar.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode.value === 'dashboard' && <DashboardPreview />}

      <PqrsUpsert
        showModal={openModalUpsert}
        closeModal={() => Promise.all([closeModalUpsert()])}
      />

      {loading.value && (
        <div class='flex justify-center items-center h-96'>
          <Loading />
        </div>
      )}
    </div>
  );
};
