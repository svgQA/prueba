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

export const PqrsPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const pqrs = useSignal<ICPqrsRequest[]>([]);
  const loading = useSignal<boolean>(true);
  const groupedPqrs = useSignal<Record<string, ICPqrsRequest[]>>({});
  const columns = useSignal<ColumnConfig[]>([]);
  const openModalUpsert = useSignal<boolean>(false);

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

    const createdStatus = list.find((item) => item.label === 'created') || { value: uuid(), label: 'created' };
    const finishedStatus = list.find((item) => item.label === 'finished') || { value: uuid(), label: 'finished' };
    const middleStatuses = list.filter((item) => item.label !== 'created' && item.label !== 'finished');
    const orderedList = [createdStatus, ...middleStatuses, finishedStatus];

    orderedList.forEach((statusItem) => {
      const normalizedStatus = statusItem.label.toLowerCase();
      if (!groupedPqrs.value[normalizedStatus]) {
        groupedPqrs.value[normalizedStatus] = [];
      }
    });
  }

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
  const getColumnBadgeStatus = (colorClass: string): 'error' | 'success' | 'warning' | 'info' | 'ternary' => {
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

  return (
    <div class='p-6 h-full'>
      <div class='mb-6'>
        <div class='flex justify-between items-center mb-4'>
          <h1 class='text-2xl font-bold text-t-light'>Gestión de PQRS</h1>
          <div class='flex gap-3'>
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

      <div class='flex gap-6 overflow-x-auto vox-scroll-design pb-6'>
        {columns.value.map((column, index) => {
          const items = groupedPqrs.value[column.title] ?? [];
          return (
            <div
              key={index}
              class={`${column.bgColorClass} rounded-lg p-4 min-h-96 w-80 flex-shrink-0`}
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
                    maxWidth="100%"
                    lines={1}
                  />
                </h3>
                <Badge 
                  label={String(items.length)}
                  status={getColumnBadgeStatus(column.colorClass)}
                  outline
                  borderless
                  size="xs"
                  width="w-fit"
                />
              </div>

              <div class='space-y-2 max-h-96 overflow-y-auto vox-scroll-design'>
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
                  <div class='text-center py-8 text-gray-text-light opacity-60'>
                    <p class='text-sm'>No hay PQRS en esta columna</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
