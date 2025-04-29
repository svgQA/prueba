import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ChatHeader } from './components/chat.header';
import { ChatCard } from './components/chat.card';
import { ChatMessage } from './components/chat.message';
import { ChatInput } from './components/chat.input';
import { UserService } from '@/services/user';
import { IUserResponse } from '@/types/auth';
import { useWebSocket } from '@/utils/socket';
import { useUserStore } from '@/store/slices';
import { IMessage } from '@/utils/socket/interface';
import { toast } from 'react-toastify';
import { Section } from '@/components/common/section/section';
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/common/table/table';
import { columns } from './components/memos.columns';
import { Memo } from './utils/memos';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button';
import { MemoService, MemosSummary } from '@/services';
import { Chats, FrequentQuestion } from './interface';
import { ExpandableMultiple } from './components/expandable.multiple';

interface ChatMessage {
  message: string;
  isSender: boolean;
  from: string;
  to: string;
}

const FrequentQuestions = () => {
  const { t } = useTranslation();

  const questions: FrequentQuestion[] = [
    { id: 1, question: t('memos.frequentQuestions.question1') },
    { id: 2, question: t('memos.frequentQuestions.question2') },
    { id: 3, question: t('memos.frequentQuestions.question3') },
  ];

  return (
    <div className='flex flex-wrap gap-2 mb-4'>
      {questions.map((q) => (
        <div
          key={q.id}
          className='bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200'
        >
          {q.question}
        </div>
      ))}
    </div>
  );
};

enum VIEW_NAME {
  TABLE,
  CHAT,
}

export const MemosPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { cognito } = useUserStore();

  const wsManager = useWebSocket();
  const selectedChat = useSignal<string>('0');
  const users = useSignal<IUserResponse[]>([]);
  const userSelected = useSignal<IUserResponse | undefined>();
  const currentPage = useSignal<number>(1);
  const totalPages = useSignal<number>(3);
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const memos = useSignal<Memo[]>([]);
  const defaultColumn = useSignal<string>('default');

  const chats = useSignal<Chats>({});
  const memoSummary = useSignal<MemosSummary>({
    total: 0,
    in_progress: 0,
    completed: 0,
  });

  useEffect(() => {
    document.title = 'VX - Chat';
    wsManager.addListener('memos', handleReceiveMessage);
    getUsersHandler();
    fetchInitialData();
    handleGetMemosSummary();
    return () => {
      wsManager.removeListener('memos');
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [memosResponse] = await Promise.all([
        MemoService.get_all({ page: 1, items: 1000 }),
      ]);
      if (memosResponse && memosResponse.getStatus())
        memos.value = memosResponse.getMany();
    } catch (error) {
      toast.error('memos.error_fetching_initial_data');
    }
  };

  const handleGetMemosSummary = async () => {
    const summary = await MemoService.getMemosSummary();
    if (!summary.getStatus()) return;
    memoSummary.value = summary.getOne();
  };

  const handleSendMessage = (message: string) => {
    if (!cognito || !userSelected.value?.cognitoId) {
      toast.error('El mensaje tiene mala estructura');
      return;
    }
    const objMessage: IMessage = {
      from: cognito,
      to: userSelected.value?.cognitoId,
      message,
    };
    wsManager.sendMessage(objMessage);

    chats.value = addMessageArray(objMessage.to, objMessage, true);
  };

  const addMessageArray = (
    sender: string,
    message: IMessage,
    isSender: boolean = false
  ) => {
    const newChats = { ...chats.value };

    if (!newChats[sender]) {
      newChats[sender] = {
        new: 1,
        messages: [
          {
            message: message.message,
            from: message.from,
            to: message.to,
            isSender: isSender,
          },
        ],
      };
    } else {
      newChats[sender] = {
        new: isSender ? newChats[sender].new : newChats[sender].new + 1,
        messages: [
          ...newChats[sender].messages,
          {
            message: message.message,
            from: message.from,
            to: message.to,
            isSender: isSender,
          },
        ],
      };
    }

    return newChats;
  };

  const handleReceiveMessage = (message: IMessage) => {
    chats.value = addMessageArray(message.from, message);
  };

  const getUsersHandler = async (page: number = 1) => {
    const response = await UserService.get_all_employee({
      items: 20,
      page: page,
    });
    if (!response.getStatus()) return;

    users.value = response.getMany();
  };

  const handleNextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
      getUsersHandler(currentPage.value);
    }
  };

  const handlePrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
      getUsersHandler(currentPage.value);
    }
  };

  const handleChatSelect = (chatId: string) => {
    selectedChat.value = chatId;
    userSelected.value = users.value.find((user) => user.cognitoId === chatId);
  };

  const chatView = () => {
    return (
      <>
        <div className='w-full flex flex-col h-full'>
          <div className='w-full p-1 border-b dark:border-b-dark-light'>
            {buttonMenu}
          </div>

          <div className='flex flex-1 overflow-y-auto'>
            <div className='w-[30%] border-r dark:border-b-dark-light flex flex-col h-full'>
              <ChatHeader />
              <ChatCard
                id={'0'}
                name={t('memos.chat.aiAssistant')}
                lastMessage={t('memos.chat.aiDefaultMessage')}
                time={t('memos.chat.time')}
                isAI
                onClick={handleChatSelect}
                isSelected={selectedChat.value === '0'}
              />
              <div className='flex-1 overflow-y-auto vox-scroll-design border-t dark:border-t-dark-light'>
                {users.value.map((user: IUserResponse) => (
                  <ChatCard
                    user={user}
                    key={`chat-card-${user.cognitoId}`}
                    id={user.cognitoId}
                    name={`${user.name} ${user.surname}`}
                    lastMessage={`${cognito === user.cognitoId ? 'SOY YO' : 'OTRO'}`}
                    time='10:15'
                    amount={chats.value[user.cognitoId]?.new}
                    onClick={handleChatSelect}
                    isSelected={selectedChat.value === user.cognitoId}
                  />
                ))}
              </div>
              <div className='flex justify-between items-center p-4 border-t dark:border-t-dark-light'>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage.value === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage.value === 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {t('memos.pagination.previous')}
                </button>
                <span className='text-sm text-gray-500'>
                  {t('memos.pagination.page')} {currentPage.value}{' '}
                  {t('memos.pagination.of')} {totalPages.value}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage.value >= totalPages.value}
                  className={`px-4 py-2 rounded-md ${
                    currentPage.value >= totalPages.value
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {t('memos.pagination.next')}
                </button>
              </div>
            </div>

            <div className='w-[70%] flex flex-col'>
              <div className='flex-1 overflow-y-auto p-4 vox-scroll-design'>
                {selectedChat.value === '0' && <FrequentQuestions />}
                {chats.value[selectedChat.value]?.messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.message}
                    isSender={msg.isSender}
                  />
                ))}
              </div>
              <ChatInput onSend={handleSendMessage} />
            </div>
          </div>
        </div>
      </>
    );
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
        currentView.value === VIEW_NAME.CHAT ? 'flex flex-row h-[99.5vh]' : ''
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
        {currentView.value !== VIEW_NAME.CHAT && (
          <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
            <div className='flex flex-row items-center justify-between'>
              {buttonMenu}
            </div>
          </div>
        )}

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
      {currentView.value === VIEW_NAME.CHAT && chatView()}
    </Section>
  );
};
