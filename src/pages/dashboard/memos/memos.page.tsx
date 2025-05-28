import { type FunctionComponent } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
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
/* import { FrequentQuestion } from './interface'; */
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ChatView } from './page/chat.page';
import { useUserStore } from '@/store/slices';
import { ExpandableMultiple } from './components/expandable.multiple';
import { FloatBadge } from '@/components/common/badge/float';
import { DateUtils } from '@/utils/utilities/dates';
import { IBaseSSE, SSE_EVENTS, SSE_TYPE, SseManager } from '@/utils/network/sse/base';
import { EventBus } from '@/utils/network/event.bus';

enum VIEW_NAME {
  TABLE,
  CHAT,
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
  const [highlightedMemoId, setHighlightedMemoId] = useState<number | null>(null);

  const wsManager = useWebSocket();
  const users = useSignal<IUserResponse[]>([]);
  const memosGroupedByService = useSignal<any[]>([]);

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const memos = useSignal<Memo[]>([]);
  const summary = useSignal<MemosSummary>(defaultSummary);

  //notifications
  const [notificationMemo, setNotificationMemo] = useState<number>(0);
  const [showReload, setShowReload] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'VX - Chat';
    return () => {
      wsManager.removeListener('memos');
    };
  }, []);

  useEffect(() => {
    // TODO: No tocar esta parte, para evitar que se ejecute cuando no hay una compañia seleccionada
    // Lo cual emite errores innecsarios.
    // Esto tambien se puede prevenir desde el service, pero pasa que por cada peticicón el responderia
    // con este error
    if (selectedCompany) {
      fetchInitialData();
      fetchSSE();
      selectedMemo();
      EventBus.on(SSE_TYPE.MEMO, handleMemoSSE);
    }
  }, [selectedCompany, location]);

  const selectedMemo = () => {
    // Add event listener for notification clicks
    const handleNotificationClick = (event: CustomEvent) => {
      const { id } = event.detail;
      if (id) setHighlightedMemoId(Number(id));
    };

    window.addEventListener('notification-click', handleNotificationClick as EventListener);

    // Get memoId from URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const memoId = urlParams.get('notificationId');
    if (memoId) setHighlightedMemoId(Number(memoId));
  };

  const fetchSSE = useCallback(async () => {
    await SseManager.getQuery(['memo', 'stream', 'history']);
  }, []);
  
  const handleMemoSSE = (event: IBaseSSE) => {
    console.log('memo event list: ', event);
    const { name, message } = event;

    if ((name === SSE_EVENTS.CREATE_PARENT || name === SSE_EVENTS.UPDATE || name === SSE_EVENTS.UPDATE_CHECK)) {
      const memoIndex = memos.value.findIndex((memo) => memo.id === message.id);
      if (memoIndex < 0) return;
      const memoCopy = memos.value;
      memoCopy[memoIndex].messages = message.messages;
      memoCopy[memoIndex].state = message.state;
      memoCopy[memoIndex].userEdit = message.userEdit;
      memoCopy[memoIndex].latitude = message.latitude;
      memoCopy[memoIndex].longitude = message.longitude;
      memoCopy[memoIndex].updatedAt = message.updatedAt;
      memos.value = [...memoCopy];
    }

    if (name && message && name === 'create') {
      setNotificationMemo((prevCount) => prevCount + 1);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const fetchInitialData = async () => {
    const [responseMemos, responseUsers, responseSummary, responseGroupedByService] = await Promise.all([
      MemoService.get_all({ page: 1, items: 1000 }),
      UserService.get_all_employee({ items: 20, page: 1 }),
      MemoService.getMemosSummary(),
      MemoService.get_all_by_service(),
    ]);

    if (responseMemos.getStatus()) {
      const memosData = responseMemos.getMany();
      // TODO: Cambiar esto, porque desde back se puede tener
      memos.value = memosData.map((memo) => ({
        ...memo,
        priority:
          memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja',
        updatedAt: DateUtils.dateToFrontend(memo.updatedAt, {
          format: 'DD/MM/YYYY',
        }),
      }));
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

  const calculatePercentage = (value: number): string => {
    if (summary.value.total === 0) return '0%';
    return `${Math.round((value / summary.value.total) * 100)}%`;
  };

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view;
  }, []);

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
        <Button name='button-change-scheduler' rounded={false} icon='331' />
        <Button name='button-change-scheduler' rounded={false} icon='314' />
      </div>
    ),
    [currentView.value]
  );

  const onClickAction = (_: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => {
    // console.log('Acción seleccionada:', params);
    // Aquí abres modales, haces navigations, etc.
  };

  const handleReload = async () => {
    setNotificationMemo(0);
    setShowReload(false);
    await fetchInitialData();
  };

  useEffect(() => {
    if (!showReload) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowReload(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReload]);

  return (
    <Section
      className={
        currentView.value === VIEW_NAME.CHAT ? 'flex flex-row h-[94.5vh]' : ''
      }
      padding={currentView.value === VIEW_NAME.TABLE}
    >
      {currentView.value === VIEW_NAME.TABLE && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <CardData
            title={t('memos.cards.totalToday')}
            count={summary.value.total}
            subtitle=''
            color='t-dark'
            icon='328' // 328
          />

          <CardData
            title={t('memos.cards.unresolved')}
            count={calculatePercentage(summary.value.in_progress)}
            subtitle=''
            color='t-dark'
            icon='311' // 311
          />

          <CardData
            title={t('memos.cards.resolved')}
            count={calculatePercentage(summary.value.completed)}
            subtitle=''
            color='t-dark'
            icon='312' // 312
          />
        </div>
      )}

      <div
        className={`max-h-screen ${currentView.value === VIEW_NAME.CHAT ? '' : 'relative'}`}
      >
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 top-0 pl-1'>
          <div className='flex flex-row items-center justify-between'>
            {buttonMenu}
            {notificationMemo > 0 && (
              <div className='ml-3 relative'>
                <FloatBadge label={notificationMemo || '0'} color='bg-primary'>
                  <div
                    className={`border border-primary rounded-lg px-4 py-1.5 flex items-center justify-center cursor-pointer transition-all duration-300 ${isAnimating ? 'animate-curtain' : ''}`}
                    onClick={() => setShowReload(!showReload)}
                  >
                    <span className='text-sm text-primary pr-2'>
                      Memo nuevo
                    </span>
                  </div>
                </FloatBadge>
                {showReload && (
                  <div
                    ref={popupRef}
                    className='absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 animate-fade-in'
                  >
                    <Button
                      name='button-change-scheduler'
                      onClick={handleReload}
                      label='Ver Memo'
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {currentView.value === VIEW_NAME.TABLE && (
          <Table<Memo>
            data={memos.value}
            columns={getColumns(onClickAction)}
            showExpandableIcon
            pageSize={20}
            selectable
            expandable={(row: Memo, column?: string) => (
              <ExpandableMultiple type={column || 'supervisor'} data={row} />
            )}
            visibility={{
              id: false,
              city: false,
              address: false,
              noveltyDate: false,
              contact: false,
              updatedAt: false,
            }}
            rowClassName={(row: Memo) => row.id === highlightedMemoId ? 'animate-highlight' : ''}
          />
        )}
      </div>
      {currentView.value === VIEW_NAME.CHAT && (
        <ChatView users={users.value} getUsersHandler={getUsersHandler} memosGroupedByService={memosGroupedByService.value} />
      )}
    </Section>
  );
};
