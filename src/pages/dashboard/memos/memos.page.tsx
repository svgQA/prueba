import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';

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
import { ToastManager } from '@/utils/toast/toast-manager';

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

  const wsManager = useWebSocket();
  const users = useSignal<IUserResponse[]>([]);

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const memos = useSignal<Memo[]>([]);
  const summary = useSignal<MemosSummary>(defaultSummary);

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
      handleSSE();
    }
  }, [selectedCompany]);

  const handleSSE = useCallback(async () => {
    await MemoService.streamQuery(
      (chunk: any) => {
        let data = JSON.parse(chunk);
        if (data) {
          const idMemo = data.id;
          const memoIndex = memos.value.findIndex((memo) => memo.id === idMemo);

          memos.value = [
            ...memos.value.slice(0, memoIndex),
            {
              ...memos.value[memoIndex],
              state: data.state,
              messages: data.messages,
              // ...data  // Actualizar cualquier otra propiedad que venga en data
            },
            ...memos.value.slice(memoIndex + 1)
          ];
        }
      },
      () => ToastManager.success('Stream completado'),
      (error: any) => {
        // Show error toast
        console.log('Stream error:', error);
        // TODO: Cambiar para que BaseService muestre el error
        //ToastManager.error(`Error en el stream: ${error.message}`);
      }
    );
  }, []);

  const fetchInitialData = async () => {
    const [responseMemos, responseUsers, responseSummary] = await Promise.all([
      MemoService.get_all({ page: 1, items: 1000 }),
      UserService.get_all_employee({ items: 20, page: 1 }),
      MemoService.getMemosSummary(),
    ]);

    if (responseMemos.getStatus()) {
      const memosData = responseMemos.getMany();
      // TODO: Cambiar esto, porque desde back se puede tener
      memos.value = memosData.map((memo) => ({
        ...memo,
        priority:
          memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja',
      }));
    }
    if (responseUsers.getStatus()) {
      users.value = responseUsers.getMany();
    }

    if (responseSummary.getStatus()) {
      summary.value = responseSummary.getOne();
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
          </div>
        </div>

        {currentView.value === VIEW_NAME.TABLE && (
          <Table
            data={memos.value}
            columns={getColumns(onClickAction)}
            // showExpandableIcon
            pageSize={20}
            selectable
            expandable={(row: Memo, column?: string) => (
              <ExpandableMultiple type={column} data={row} />
            )}
            visibility={{
              id: false,
              city: false,
              address: false,
              noveltyDate: false,
              contact: false,
            }}
          />
        )}
      </div>
      {currentView.value === VIEW_NAME.CHAT && (
        <ChatView users={users.value} getUsersHandler={getUsersHandler} />
      )}
    </Section>
  );
};
