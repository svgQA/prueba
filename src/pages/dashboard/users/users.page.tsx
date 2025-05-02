import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Section } from '@/components/common/section/section'; // Ajusta según tu estructura
import { CardData } from '@/components/compose/cards'; // Ajusta la ruta si difiere
import { useSignal } from '@preact/signals';
import { Button } from '@/components/common/button/button';
import { CreateUser } from './components/user.create';
import { UserMessage } from './components/user.message';
import { UserTable } from './components/user.table';
import { IUserResponse } from '@/types/auth';
import { useTranslation } from 'react-i18next';
import { UserService } from '@/services/user';
import { SendForm } from '../shifts/components/send/send.modal';
import { toast } from 'react-toastify';

enum VIEW_NAME {
  TABLE,
  CREATE,
  MESSAGE,
}

export const UsersPage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const user = useSignal<IUserResponse>();

  const totalUsers = useSignal(0);
  const connectedUsers = useSignal(0);
  const disconnectedUsers = useSignal(0);

  const showSendModal = useSignal<boolean>(false);

  const [selectedUsers, setSelectedUsers] = useState<IUserResponse[]>([]);
  const [onNotifications, setOnNotifications] = useState(false);
  const [hasValidPlayer, setHasValidPlayer] = useState(false);

  const hasValidPlayerRef = useRef(false);
  const onNotificationsRef = useRef(false);

  useEffect(() => {
    document.title = t('users.pageTitle');
    fetchStats();
  }, []);

  // sincroniza ambos:
  useEffect(() => {
    hasValidPlayerRef.current = hasValidPlayer;
    setHasValidPlayer(hasValidPlayerRef.current);
  }, [hasValidPlayer]);

  useEffect(() => {
    onNotificationsRef.current = onNotifications;
    setOnNotifications(onNotificationsRef.current);
  }, [onNotifications]);

  const fetchStats = async () => {
    const response = await UserService.getDashboardStats();
    if (response.getStatus()) {
      const { totalUsers: total, connectedUsers: active, disconnectedUsers: inactive } =
        response.getOne();
      totalUsers.value = total;
      connectedUsers.value = active;
      disconnectedUsers.value = inactive;
    }
  };

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view;
  }, []);

  const handleStateChange = useCallback((view: VIEW_NAME) => {
    return currentView.value === view ? 'bg-primary-opacity p-2' : '';
  }, []);

  const handleCloseSendModal = useCallback(() => {
    showSendModal.value = false;
    setOnNotifications(false);
    onNotificationsRef.current = false;
  }, []);

  const toggleSendModal = () => {

    handleViewChange(VIEW_NAME.TABLE);
    
    if (!hasValidPlayerRef.current) {
      toast.warn(t('notification.nobody_have_player_id'));
      return;
    }

    if (!onNotificationsRef.current) {
      // 🟡 Primera vez: solo activa notificaciones
      setOnNotifications(true);
      onNotificationsRef.current = true;
      return;
    }

    // ✅ Siguientes veces: solo abre el modal (sin toggle)
    if (selectedUsers.length === 0) {
      toast.warn(t('notification.select_at_least_one_employee'));
      setOnNotifications(false);
      onNotificationsRef.current = false;
      return;
    } else {
      showSendModal.value = true;
    }
  };

  const buttonMenu = useMemo(
    () => (
      <div className='flex items-center gap-2'>
        <Button
          name='button-change-table'
          onClick={() => {
            handleViewChange(VIEW_NAME.TABLE);
          }}
          rounded={false}
          className={handleStateChange(VIEW_NAME.TABLE)}
          icon='320'
        />
        <Button
          name='button-change-table'
          onClick={() => {
            handleViewChange(VIEW_NAME.CREATE);
          }}
          rounded={false}
          className={handleStateChange(VIEW_NAME.CREATE)}
          icon='039'
        />
        <div className='relative'>
          <Button
            name='button-action'
            rounded={false}
            icon='314'
            onClick={toggleSendModal}
            className={`border-2 p-2 ${!hasValidPlayer
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : onNotifications
                ? 'bg-primary-opacity'
                : 'border-primary'
              }`}
          />
          {showSendModal.value && (
            <div className='absolute mt-4 mr-12 z-50 rounded p-4'>
              <SendForm
                onClose={handleCloseSendModal}
                hasplayers={hasValidPlayer}
                users={selectedUsers as []}
              />
            </div>
          )}
        </div>
      </div>
    ),
    [currentView.value]
  );

  return (
    <Section padding>
      {/* Ejemplo de 3 cards arriba, análogo a shifts */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title={t('users.cards.total')}
          count={totalUsers.value}
          subtitle={t('users.cards.totalSubtitle')}
          color='text-secondary'
          icon='users'
        />
        <CardData
          title={t('users.cards.activeConnection')}
          count={connectedUsers.value}
          subtitle={t('users.cards.activeSubtitle')}
          color='text-primary'
          icon='user-active'
        />
        <CardData
          title={t('users.cards.inactiveConnection')}
          count={disconnectedUsers.value}
          subtitle={t('users.cards.inactiveSubtitle')}
          color='text-error'
          icon='user-inactive'
        />
      </div>
      {/* Menu de botones */}
      <div className='max-h-screen relative'>
        <div className='py-2 flex flex-row justify-center xl:justify-between px-1 items-center overflow-visible xl:absolute relative z-10 w-full xl:w-fit bg-b-content'>
          <div className='flex flex-row items-center !w-full xl:!w-fit md:w-auto justify-between'>
            {buttonMenu}
          </div>
        </div>
        {/* Renderer el componente de creación de usuario */}
        {currentView.value === VIEW_NAME.CREATE && (
          <CreateUser
            onUserCreated={() => handleViewChange(VIEW_NAME.TABLE)}
            user={user.value}
          />
        )}
        {/* Renderer el componente de mensaje */}
        {currentView.value === VIEW_NAME.MESSAGE && <UserMessage />}
        {/* Renderer la tabla de usuarios */}
        {currentView.value === VIEW_NAME.TABLE && (
          <UserTable
            onUserEdit={(value) => {
              user.value = value;
              handleViewChange(VIEW_NAME.CREATE);
            }}
            setSelectedUsers={setSelectedUsers}
          />
        )}
      </div>
    </Section>
  );
};
