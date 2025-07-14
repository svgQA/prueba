import { type FunctionComponent } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { useSignal } from '@preact/signals';
import './utils/memos.css';
import { useLocation } from 'wouter';

import { UserService } from '@/services/general/user';
import { IUserResponse } from '@/types/auth';
import { useWebSocket } from '@/utils/socket';
import { Section } from '@/components/common/section/section';
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/common/table/table';
import { getColumns } from './components/memos.columns';
import { Memo } from './utils/memos';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button';
import { MemoService, MemosSummary } from '@/services';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ChatView } from './page/chat.page';
import { useUserStore } from '@/store/slices';
import { ExpandableMultiple } from './components/expandable.multiple';
import { DateUtils } from '@/utils/utilities/dates';
import {
  IBaseSSE,
  SSE_EVENTS,
  SSE_TYPE,
  SseManager,
} from '@/utils/network/sse/base';
import { EventBus } from '@/utils/network/event.bus';
import { MapPath } from '@/components/common/map/MapPath';
import { RoutePoint } from '@/services/general/tracking';
import NotificationBanner from '@/components/common/notifications/components/notification.banner';
import { PanicService } from '@/services/memo/panic';
import { getColumnsPanic } from './components/panic.columns';
import { handleNotificationEvent } from '@/components/common/notifications/components/notification.event';

enum VIEW_NAME {
  TABLE,
  CHAT,
  MAP,
  PANIC,
}

const defaultSummary = {
  total: 0,
  in_progress: 0,
  completed: 0,
};

export const MemosPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { selectedCompany } = useUserStore();
  const [location] = useLocation();
  const [highlightedMemoId, setHighlightedMemoId] = useState<number | null>(
    null
  );
  const [highlightedPanicMemoId, setHighlightedPanicMemoId] = useState<
    string | null
  >(null);

  const wsManager = useWebSocket();
  const users = useSignal<IUserResponse[]>([]);
  const routePath = useSignal<RoutePoint[]>([]);

  /**
   *  TODO: Typiar toda esta mierda
   */
  const memosGroupedByService = useSignal<any[]>([]);
  const memosGroupedByUser = useSignal<any[]>([]);

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const memos = useSignal<Memo[]>([]);
  const summary = useSignal<MemosSummary>(defaultSummary);
  const loading = useSignal<boolean>(false);
  const notificationBannerRef = useRef<{ startBannerAnimation: () => void }>(
    null
  );
  const panic = useSignal<Memo[]>([]);
  const summaryPanic = useSignal<MemosSummary>(defaultSummary);

  useEffect(() => {
    document.title = t('p_chat');
    return () => {
      wsManager.removeListener('memos');
    };
  }, []);

  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchInitialData();
      fetchSSE();
      selectedNotifier();
      EventBus.on(SSE_TYPE.MEMO, handleMemoSSE);
    }
  }, [selectedCompany, location]);

  const selectedNotifier = () => {
    handleNotificationEvent('notification-click', (id: any) => {
      currentView.value = VIEW_NAME.TABLE;
      setHighlightedMemoId(Number(id));
    });
    handleNotificationEvent('go-to-panic-table', (id: any) => {
      currentView.value = VIEW_NAME.PANIC;
      setHighlightedPanicMemoId(String(id));
    });
  };

  const fetchSSE = useCallback(async () => {
    await SseManager.getQuery(['memo', 'stream', 'history']);
  }, []);

  const handleMemoSSE = async (event: IBaseSSE) => {
    const { name, message } = event;

    if (
      name === SSE_EVENTS.CREATE_PARENT ||
      name === SSE_EVENTS.UPDATE ||
      name === SSE_EVENTS.UPDATE_CHECK
    ) {
      const memoIndex = memos.value.findIndex((memo) => memo.id === message.id);
      if (memoIndex < 0) return;
      const memoCopy: Memo[] = memos.value;
      memoCopy[memoIndex].messages = message.messages;
      memoCopy[memoIndex].state = message.state;
      memoCopy[memoIndex].userEdit = message.userEdit;
      memoCopy[memoIndex].latitude = message.latitude;
      memoCopy[memoIndex].longitude = message.longitude;
      memoCopy[memoIndex].updatedAt = message.updatedAt;
      memos.value = [...memoCopy];
    }

    if (name === SSE_EVENTS.CREATE) {
      notificationBannerRef.current?.startBannerAnimation();
    }
  };

  const fetchInitialData = async () => {
    loading.value = true;
    const [
      responseMemos,
      responseUsers,
      responseSummary,
      responseGroupedByService,
      responseGroupedByUser,
      responseMemoPanic,
      responseSummaryPanic,
    ] = await Promise.all([
      MemoService.get_all({ page: 1, items: 1000 }),
      UserService.get_all_employee({ items: 20, page: 1 }),
      MemoService.getMemosSummary(),
      MemoService.get_all_by_service(),
      MemoService.get_all_by_user(),
      PanicService.get_all_memo_panic({ page: 1, items: 1000 }),
      PanicService.getPanicSummary(),
    ]);

    if (responseMemos.getStatus()) {
      memos.value = responseMemos.getMany().map((memo: Memo) => ({
        ...memo,
        priority:
          memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja',
        updatedAt: DateUtils.dateToFrontend(memo.updatedAt, {
          format: 'DD/MM/YYYY HH:mm',
        }),
      }));
      loading.value = false;
    }

    if (responseUsers.getStatus()) {
      users.value = responseUsers.getMany();
    }

    if (responseSummary.getStatus()) {
      summary.value = responseSummary.getOne();
    }

    if (responseGroupedByService.getStatus()) {
      memosGroupedByService.value = responseGroupedByService.getMany();
    }

    if (responseGroupedByUser.getStatus()) {
      memosGroupedByUser.value = responseGroupedByUser.getMany();
    }

    if (responseMemoPanic.getStatus()) {
      panic.value = responseMemoPanic.getMany().map((memo: Memo) => ({
        ...memo,
        priority:
          memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja',
        updatedAt: DateUtils.dateToFrontend(memo.updatedAt, {
          format: 'DD/MM/YYYY HH:mm',
        }),
      }));
      loading.value = false;
    }

    if (responseSummaryPanic.getStatus()) {
      summaryPanic.value = responseSummaryPanic.getOne();
    }
  };

  // TODO: COrregir esta parte para que solo sea desde un chat list
  // Que adapte unicamente a lo que necesita.
  const getUsersHandler = async (page: number = 1) => {
    const response = await UserService.get_all_employee({
      items: 20,
      page: page,
    });
    if (!response.getStatus()) return;
    users.value = response.getMany();
  };

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view;
  }, []);

  /*
  const onReloadRoute = async () => {
    const response = await TrackingService.getTracking();
    if (!response.getStatus()) return;
    routePath.value = response.getMany();
  };
  */

  const buttonMenu = useMemo(
    () => (
      <div className='flex items-center gap-2'>
        <Button
          name='button-change-table'
          onClick={() => {
            handleViewChange(VIEW_NAME.TABLE);
          }}
          rounded={false}
          selected={currentView.value === VIEW_NAME.TABLE}
          icon='320'
        />
        <Button
          name='button-change-scheduler'
          onClick={() => {
            handleViewChange(VIEW_NAME.CHAT);
          }}
          rounded={false}
          selected={currentView.value === VIEW_NAME.CHAT}
          icon='418'
        />
        <Button
          name='button-change-panic'
          onClick={() => {
            handleViewChange(VIEW_NAME.PANIC);
          }}
          rounded={false}
          selected={currentView.value === VIEW_NAME.PANIC}
          icon='359'
        />
        {/* <Button
          name='button-change-scheduler'
          onClick={() => {
            handleViewChange(VIEW_NAME.MAP);
          }}
          rounded={false}
          selected={currentView.value === VIEW_NAME.MAP}
          icon='318'
        />
        {currentView.value === VIEW_NAME.MAP && (
          <Button
            name='btn-reload-path'
            onClick={onReloadRoute}
            icon='132'
            rounded={false}
          />
        )}
        */}
        {/* <Button name='button-change-scheduler' rounded={false} icon='331' />
        <Button name='button-change-scheduler' rounded={false} icon='314' /> */}
      </div>
    ),
    [currentView.value]
  );

  /**
   *
   * @returns cards
   */
  const renderCardsInfo = (summary: MemosSummary, type: string = 'memos') => (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
      <CardData
        title={t(type + '.cards.totalToday')}
        count={summary.total}
        subtitle=''
        color='t-dark'
        icon='328' // 328
      />
      <CardData
        title={t(type + '.cards.unresolved')}
        count={calculatePercentage(summary)}
        subtitle=''
        color='t-dark'
        icon='311' // 311
      />
      <CardData
        title={t(type + '.cards.resolved')}
        count={calculatePercentage(summary, true)}
        subtitle=''
        color='t-dark'
        icon='312' // 312
      />
    </div>
  );

  /**
   *
   * @param summary
   * @param isResolve
   * @returns
   */
  const calculatePercentage = (
    summary: MemosSummary,
    isResolve: boolean = false
  ): string => {
    const inProgress = summary.in_progress || 0;
    const completed = summary.completed || 0;
    const total = inProgress + completed;
    if (total === 0) return '0%';
    const value = isResolve ? completed : inProgress;
    return `${Math.round((value / total) * 100)}%`;
  };

  const onClickAction = (_: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => {
    // console.log('Acción seleccionada:', params);
    // Aquí abres modales, haces navigations, etc.
  };

  return (
    <Section
      className={
        currentView.value === VIEW_NAME.CHAT
          ? 'flex flex-row h-[94.5vh]'
          : 'mr-3 my-1 relative'
      }
      padding={currentView.value !== VIEW_NAME.CHAT}
    >
      {(currentView.value === VIEW_NAME.TABLE ||
        currentView.value === VIEW_NAME.MAP) &&
        renderCardsInfo(summary.value)}
      {currentView.value === VIEW_NAME.PANIC &&
        renderCardsInfo(summaryPanic.value, 'panic')}

      <div
        className={`max-h-screen ${currentView.value === VIEW_NAME.CHAT ? '' : 'relative'}`}
      >
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 top-0 pl-1'>
          <div className='flex flex-row items-center justify-between'>
            {buttonMenu}
            <NotificationBanner
              ref={notificationBannerRef}
              message='Memo nuevo'
              reload={fetchInitialData}
            />
          </div>
        </div>

        {currentView.value === VIEW_NAME.TABLE && (
          <Table<Memo>
            data={memos.value}
            columns={getColumns(onClickAction)}
            showExpandableIcon
            pageSize={20}
            selectable
            loading={loading.value}
            expandable={(row: Memo, column?: string) => (
              <ExpandableMultiple type={column} data={row} />
            )}
            visibility={{
              id: false,
              city: false,
              address: false,
              noveltyDate: false,
              contact: false,
              updatedAt: false,
            }}
            searchable={{
              history: false,
            }}
            rowClassName={(row: Memo) =>
              row.id === highlightedMemoId ? 'animate-highlight' : ''
            }
          />
        )}

        {currentView.value === VIEW_NAME.PANIC && (
          <Table<Memo>
            data={panic.value}
            columns={getColumnsPanic(onClickAction)}
            showExpandableIcon
            pageSize={20}
            selectable
            loading={loading.value}
            expandable={(row: Memo, column?: string) => (
              <ExpandableMultiple type={column} data={row} />
            )}
            visibility={{
              id: false,
              city: false,
              address: false,
              noveltyDate: false,
              contact: false,
              updatedAt: false,
              history: false,
            }}
            searchable={{
              history: false,
            }}
            rowClassName={(row: Memo) =>
              row.panicUuid === highlightedPanicMemoId
                ? 'animate-highlight'
                : ''
            }
          />
        )}

        {currentView.value === VIEW_NAME.MAP && (
          <div className='p-5 pt-16'>
            <MapPath route={routePath.value} height='70vh'></MapPath>
          </div>
        )}
      </div>

      {currentView.value === VIEW_NAME.CHAT && (
        <ChatView
          users={users.value}
          getUsersHandler={getUsersHandler}
          memosGroupedByService={memosGroupedByService.value}
          memosGroupedByUser={memosGroupedByUser.value}
        />
      )}
    </Section>
  );
};
