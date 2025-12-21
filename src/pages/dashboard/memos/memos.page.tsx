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
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/common/table/table';
import { getColumns } from './components/memos.columns';
import { Memo } from './utils/memos';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button';
import { baseParams, MemoService, MemosSummary } from '@/services';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ChatView } from './page/chat.page';
import { useUserStore } from '@/store/slices';
import { ExpandableMultiple } from './components/expandable.multiple';
import { DateUtils } from '@/utils/utilities/dates';
import { MapPath } from '@/components/common/map/MapPath';
import { RoutePoint } from '@/services/general/tracking';
import NotificationBanner from '@/components/common/notifications/components/notification.banner';
import { PanicService } from '@/services/memo/panic';
import { getColumnsPanic } from './components/panic.columns';
import { handleNotificationEvent } from '@/components/common/notifications/components/notification.event';
import { modulesReport } from '@/types/form';

/**
 * TODO: WebSocket
 */
import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  SOCKET_MESSAGE_EVENTS,
  MessageEvent,
  MESSAGE_LISTENERS,
} from '@/utils/socket/manager/types';
import { allPermissions } from '@/store/signals/access/permission';
import { ButtonsPage, CardsPage, SectionPage } from '@/pages/component';
import { IRangeValues } from '@/components/common/table/components/range';

enum VIEW_NAME {
  TABLE,
  CHAT,
  MAP,
  PANIC,
}

export const defaultSummary = {
  total: 0,
  in_progress: 0,
  completed: 0,
};

export const MemosPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { selectedCompany, selectedPlace } = useUserStore();
  const [location] = useLocation();
  const [highlightedMemoId, setHighlightedMemoId] = useState<number | null>(
    null
  );
  const [highlightedPanicMemoId, setHighlightedPanicMemoId] = useState<
    string | null
  >(null);

  // const wsManager = useWebSocket();
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
  const [dateRangeFilters, setDateRangeFilters] = useState<IRangeValues | null>(
    null
  );

  useEffect(() => {
    document.title = t('p_chat');
    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.MEMOS,
      handleMessage,
      MESSAGE_LISTENERS.MEMOS
    );
    return () => {
      WebSocketManager.remove(
        SOCKET_MESSAGE_AREA.MEMOS,
        MESSAGE_LISTENERS.MEMOS
      );
    };
  }, []);

  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchInitialData(dateRangeFilters);
      selectedNotifier();
    }
  }, [selectedCompany, location, dateRangeFilters, selectedPlace]);

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

  const handleMessage = (event: InSocketMessage<MessageEvent>) => {
    const { type: name, message } = event.payload;

    if (
      name === SOCKET_MESSAGE_EVENTS.CREATE_PARENT ||
      name === SOCKET_MESSAGE_EVENTS.UPDATE ||
      name === SOCKET_MESSAGE_EVENTS.UPDATE_CHECK
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

    if (name === SOCKET_MESSAGE_EVENTS.CREATE) {
      notificationBannerRef.current?.startBannerAnimation();
    }
  };

  const fetchInitialData = async (rangeFilter?: IRangeValues | null) => {
    loading.value = true;
    const _range_model = rangeFilter
      ? { [rangeFilter?.column]: rangeFilter.data }
      : baseParams;
    const [
      responseMemos,
      responseUsers,
      responseSummary,
      responseGroupedByService,
      responseGroupedByUser,
      responseMemoPanic,
      responseSummaryPanic,
    ] = await Promise.all([
      MemoService.get_all({ ...baseParams, ..._range_model }),
      UserService.get_all_employee(baseParams),
      MemoService.getMemosSummary(),
      MemoService.get_all_by_service(),
      MemoService.get_all_by_user(),
      PanicService.get_all_memo_panic(baseParams),
      PanicService.getPanicSummary(),
    ]);

    if (responseMemos.getStatus()) {
      memos.value = responseMemos.getMany().map((memo: Memo) => ({
        ...memo,
        // Es importante que se mantenga el updatedAt para que el history funcione correctamente
        //updatedAt: DateUtils.dateToFrontend(memo.updatedAt, { format: 'DD/MM/YYYY HH:mm' }),
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
      <>
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
          name='button-change-panic'
          onClick={() => {
            handleViewChange(VIEW_NAME.PANIC);
          }}
          rounded={false}
          selected={currentView.value === VIEW_NAME.PANIC}
          icon='359'
        />
        <Button
          name='button-change-scheduler'
          onClick={() => {
            handleViewChange(VIEW_NAME.CHAT);
          }}
          rounded={false}
          selected={currentView.value === VIEW_NAME.CHAT}
          icon='418'
          permissions={{ name: 'memo', state: 'chat' }}
        />
      </>
    ),
    [currentView.value, allPermissions.value]
  );

  /**
   *
   * @returns cards
   */
  const renderCardsInfo = (summary: MemosSummary, _type: string = 'memos') => (
    <>
      <CardData
        title='h_memos_total'
        count={summary.total}
        subtitle=''
        color='t-dark'
        icon='0001'
      />
      <CardData
        title='h_memos_unresolved'
        count={calculatePercentage(summary)}
        subtitle=''
        color='t-dark'
        icon='311'
      />
      <CardData
        title='h_memos_resolved'
        count={calculatePercentage(summary, true)}
        subtitle=''
        color='t-dark'
        icon='000'
      />
    </>
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

  const handleStatusChange = (newStatus: string, memoId: number) => {
    // console.log('newStatus', newStatus, 'memoId', memoId);

    // Actualizar el estado del memo en el array de panic
    const panicIndex = panic.value.findIndex((memo) => memo.id === memoId);
    if (panicIndex !== -1) {
      const panicCopy: Memo[] = [...panic.value];
      panicCopy[panicIndex] = { ...panicCopy[panicIndex], state: newStatus };
      panic.value = panicCopy;
    }
  };

  return (
    <SectionPage
      className={currentView.value === VIEW_NAME.CHAT ? 'pt-0' : ''}
      padding
      cards={
        <CardsPage
          className={currentView.value === VIEW_NAME.CHAT ? '!mb-0' : ''}
        >
          {(currentView.value === VIEW_NAME.TABLE ||
            currentView.value === VIEW_NAME.MAP) &&
            renderCardsInfo(summary.value)}

          {currentView.value === VIEW_NAME.PANIC &&
            renderCardsInfo(summaryPanic.value, 'panic')}
        </CardsPage>
      }
      buttons={
        <ButtonsPage
          className={currentView.value === VIEW_NAME.CHAT ? 'px-2' : ''}
        >
          {buttonMenu}
          <NotificationBanner
            ref={notificationBannerRef}
            message='Memo nuevo'
            reload={fetchInitialData}
          />
        </ButtonsPage>
      }
    >
      {currentView.value === VIEW_NAME.TABLE && (
        <Table<Memo>
          data={memos.value}
          columns={getColumns(onClickAction)}
          showExpandableIcon
          selectable
          loading={loading.value}
          onRangeChange={setDateRangeFilters}
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
            service: false,
            contract: false,
            client: false,
          }}
          searchable={{
            history: false,
          }}
          rowClassName={(row: Memo) =>
            row.id === highlightedMemoId ? 'animate-highlight' : ''
          }
          modules={modulesReport.Memo}
        />
      )}

      {currentView.value === VIEW_NAME.PANIC && (
        <Table<Memo>
          data={panic.value}
          columns={getColumnsPanic(onClickAction)}
          showExpandableIcon
          selectable
          loading={loading.value}
          expandable={(row: Memo, column?: string) => (
            <ExpandableMultiple
              type={column}
              data={row}
              onStatusChange={handleStatusChange}
            />
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
            row.panicUuid === highlightedPanicMemoId ? 'animate-highlight' : ''
          }
        />
      )}

      {currentView.value === VIEW_NAME.MAP && (
        <MapPath route={routePath.value} height='70vh'></MapPath>
      )}

      {currentView.value === VIEW_NAME.CHAT && (
        <ChatView
          users={users.value}
          getUsersHandler={getUsersHandler}
          memosGroupedByService={memosGroupedByService.value}
          memosGroupedByUser={memosGroupedByUser.value}
        />
      )}
    </SectionPage>
  );
};
