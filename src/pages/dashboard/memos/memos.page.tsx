import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { UserService } from '@/services/user';
import { IUserResponse } from '@/types/auth';
import { useWebSocket } from '@/utils/socket';
import { Section } from '@/components/common/section/section';
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/common/table/table';
import { columns } from './components/memos.columns';
import { Memo } from './utils/memos';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button';
import { MemoService, MemosSummary } from '@/services';
import { ExpandableMultiple } from './components/expandable.multiple';
import { ChatView } from './page/chat.page';

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

  const wsManager = useWebSocket();
  const users = useSignal<IUserResponse[]>([]);

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const memos = useSignal<Memo[]>([]);
  const defaultColumn = useSignal<string>('default');

  const memoSummary = useSignal<MemosSummary>(defaultSummary);

  useEffect(() => {
    document.title = 'VX - Chat';
    getUsersHandler();
    fetchInitialData();
    handleGetMemosSummary();
    return () => {
      wsManager.removeListener('memos');
    };
  }, []);

  const fetchInitialData = async () => {
    const response = await MemoService.get_all({ page: 1, items: 1000 });
    if (!response.getStatus()) return;
    memos.value = response.getMany();
  };

  const handleGetMemosSummary = async () => {
    const summary = await MemoService.getMemosSummary();
    if (!summary.getStatus()) return;
    memoSummary.value = summary.getOne();
  };

  const getUsersHandler = async (page: number = 1) => {
    const response = await UserService.get_all_employee({
      items: 20,
      page: page,
    });
    if (!response.getStatus()) return;

    users.value = response.getMany();
  };

  const calculatePercentage = (value: number): string => {
    if (memoSummary.value.total === 0) return '0%';
    return `${Math.round((value / memoSummary.value.total) * 100)}%`;
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
          className={
            currentView.value === VIEW_NAME.TABLE
              ? 'bg-primary-opacity p-2'
              : ''
          }
          icon='320'
        />
        <Button
          name='button-change-scheduler'
          onClick={() => {
            handleViewChange(VIEW_NAME.CHAT);
          }}
          rounded={false}
          className={
            currentView.value === VIEW_NAME.CHAT ? 'bg-primary-opacity p-2' : ''
          }
          icon='418'
        />
        <Button name='button-change-scheduler' rounded={false} icon='331' />
        <Button name='button-change-scheduler' rounded={false} icon='314' />
      </div>
    ),
    [currentView.value]
  );

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
            count={memoSummary.value.total}
            subtitle=''
            color='t-dark'
            icon='054' // 328
          />

          <CardData
            title={t('memos.cards.unresolved')}
            count={calculatePercentage(memoSummary.value.in_progress)}
            subtitle=''
            color='t-dark'
            icon='052' // 311
          />

          <CardData
            title={t('memos.cards.resolved')}
            count={calculatePercentage(memoSummary.value.completed)}
            subtitle=''
            color='t-dark'
            icon='015' // 312
          />
        </div>
      )}

      <div className='max-h-screen relative'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark top-0'>
          <div className='flex flex-row items-center justify-between'>
            {buttonMenu}
          </div>
        </div>

        {currentView.value === VIEW_NAME.TABLE && (
          <Table
            data={memos.value}
            columns={columns}
            showExpandableIcon={false}
            pageSize={20}
            selectable
            expandable={(row: Memo, currentColumnName?: string) => (
              <ExpandableMultiple
                type={currentColumnName || defaultColumn.value}
                data={row}
              />
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
