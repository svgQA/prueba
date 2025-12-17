import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { CardData } from '@/components/compose/cards';
import { useSignal } from '@preact/signals';
import { Button } from '@/components/common/button/button';
import { CreateUser } from './components/user.create';
import { UserMessage } from './components/user.message';
import { IUserResponse } from '@/types/auth';
import { useTranslation } from 'react-i18next';
import { SendForm } from '../shifts/components/send/send.modal';
import { ToastManager } from '@/utils/toast/toast-manager';
import { NotificationService, UserService } from '@/services';
import { getColumns } from './components/user.columns';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';
import { Table } from '@/components/common/table/table';
import { setUser, USER_MODE_SERVICE } from './store/user.store';
import { useUserStore } from '@/store/slices';
import { ButtonsPage, CardsPage, SectionPage } from '@/pages/component';

enum VIEW_NAME {
  TABLE,
  CREATE,
  MESSAGE,
}

export const UsersPage: FunctionalComponent = () => {
  const { t, i18n } = useTranslation();
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const user = useSignal<IUserResponse | any>();
  const loading = useSignal<boolean>(false);

  const totalUsers = useSignal(0);
  const connectedUsers = useSignal(0);
  const disconnectedUsers = useSignal(0);

  const showSendModal = useSignal<boolean>(false);
  const notificationValidate = useSignal<boolean>(false);
  const { selectedCompany } = useUserStore();

  const [selectedUsers, setSelectedUsers] = useState<IUserResponse[]>([]);
  const [onNotifications, setOnNotifications] = useState(false);
  const [hasValidPlayer, setHasValidPlayer] = useState(false);

  const hasValidPlayerRef = useRef(false);
  const onNotificationsRef = useRef(false);

  useEffect(() => {
    document.title = t('p_user');
  }, []);

  useEffect(() => {
    hasValidPlayerRef.current = hasValidPlayer;
    setHasValidPlayer(hasValidPlayerRef.current);
  }, [hasValidPlayer]);

  useEffect(() => {
    onNotificationsRef.current = onNotifications;
    setOnNotifications(onNotificationsRef.current);
  }, [onNotifications]);

  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchStats();
      getUsers();
    }
  }, [selectedCompany, location]);

  const fetchStats = async () => {
    const [hasValidResponse, statsResponse] = await Promise.all([
      NotificationService.hasUsersWithPlayerId(),
      UserService.getDashboardStats(),
    ]);

    const { hasUsers } = hasValidResponse.getOne();
    setHasValidPlayer(hasUsers);
    hasValidPlayerRef.current = hasUsers;

    if (statsResponse.getStatus()) {
      const {
        totalUsers: total,
        connectedUsers: active,
        disconnectedUsers: inactive,
      } = statsResponse.getOne();

      totalUsers.value = total;
      connectedUsers.value = active;
      disconnectedUsers.value = inactive;
    }
  };

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    if (currentView.value === VIEW_NAME.CREATE && view !== VIEW_NAME.CREATE) {
      user.value = undefined;
    }
    currentView.value = view;
  }, []);

  const handleCloseSendModal = useCallback(() => {
    showSendModal.value = false;
    setOnNotifications(false);
    onNotificationsRef.current = false;
  }, []);

  const toggleSendModal = () => {
    handleViewChange(VIEW_NAME.TABLE);

    if (!hasValidPlayerRef.current) {
      ToastManager.warning('s_there_are_not_player_id');
      return;
    }

    if (!onNotificationsRef.current) {
      setOnNotifications(true);
      onNotificationsRef.current = true;
      return;
    }

    if (selectedUsers.length === 0) {
      ToastManager.warning('s_must_some_selected');
      setOnNotifications(false);
      onNotificationsRef.current = false;
      return;
    } else {
      showSendModal.value = true;
    }
  };

  const users = useSignal<IUserResponse[]>([]);

  const getUsers = async () => {
    loading.value = true;
    const response = await UserService.get_all();
    if (!response.getStatus()) {
      loading.value = false;
      return;
    }
    const [hasNotifications, responseUsers] = findNotificationsUser(
      response.getMany()
    );
    notificationValidate.value = hasNotifications;
    users.value = responseUsers;
    loading.value = false;
  };

  const findNotificationsUser = (
    usersResponse: IUserResponse[]
  ): [boolean, IUserResponse[]] => {
    let hasSomeNotifications = false;
    const users = usersResponse.map((user) => {
      if (user.playerId) {
        hasSomeNotifications = true;
        return {
          ...user,
          hasNotifications: true,
        };
      }
      return {
        ...user,
        hasNotifications: false,
      };
    });

    return [hasSomeNotifications, users];
  };

  const deleteUser = async (id: number) => {
    const response = await UserService.delete(id);
    if (!response.getStatus()) return;
    getUsers();
  };

  const setProfile = async (id: number, companyId: string) => {
    const response = await UserService.setProfile(id, companyId);
    if (!response.getStatus()) return;
    ToastManager.success('s_assigned_success');
    getUsers();
  };

  const handleOnClick = async (action: IRowAction) => {
    const userFound = findUser(Number(action.id));
    switch (action.action) {
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('h_delete_user'),
          message: `${t('i_message_user')} ${userFound.name} ${userFound.surname} - ${userFound.cardId}?`,
          onConfirm: () => deleteUser(userFound.id),
          onCancel: () => {},
        });
        break;
      case ROW_ACTIONS.PROFILE:
        const company = String(userFound.companies[0].company.id);
        if (userFound.cognitoId) {
          return ToastManager.warning('s_already_profile');
        }
        if (!company) {
          return ToastManager.warning('s_select_company');
        }
        showAlert({
          title: t('h_assign_profile'),
          message: `${t('i_message_assign_profile')} ${userFound.name} ${userFound.surname}?, ${t('i_message_assign_profile_subtitle')}`,
          onConfirm: () => setProfile(userFound.id, company),
          onCancel: () => {},
        });
        break;
      case ROW_ACTIONS.UPDATE:
        // @ts-ignore
        user.value = userFound;
        setUser({ mode: USER_MODE_SERVICE.UPDATE, id: userFound.id });
        handleViewChange(VIEW_NAME.CREATE);
        break;
    }
  };

  const findUser = (id: number): IUserResponse => {
    const user = users.value.find((u) => u.id === id);
    if (!user) throw new Error(`User with id ${id} not found`);
    return user;
  };

  return (
    <SectionPage
      padding
      relative
      cards={
        <CardsPage>
          <CardData
            title={t('l_total_users')}
            count={totalUsers.value}
            subtitle={t('l_registered')}
            color='text-secondary'
            icon='users'
          />
          <CardData
            title={t('l_active_connection')}
            count={connectedUsers.value}
            subtitle={t('l_connected_users')}
            color='text-primary'
            icon='user-active'
          />
          <CardData
            title={t('l_inactive_connection')}
            count={disconnectedUsers.value}
            subtitle={t('l_disconnected_users')}
            color='text-error'
            icon='user-inactive'
          />
        </CardsPage>
      }
      buttons={
        <ButtonsPage>
          <Button
            name='button-change-table'
            onClick={() => handleViewChange(VIEW_NAME.TABLE)}
            rounded={false}
            selected={currentView.value === VIEW_NAME.TABLE}
            icon='320'
          />
          <Button
            name='button-change-table'
            onClick={() => handleViewChange(VIEW_NAME.CREATE)}
            rounded={false}
            selected={currentView.value === VIEW_NAME.CREATE}
            icon='039'
            permissions={{ name: 'user', state: 'upsert' }}
          />
          <div className='relative'>
            <Button
              name='button-action'
              rounded={false}
              icon='314'
              onClick={toggleSendModal}
              disabled={!hasValidPlayer}
              selected={onNotifications}
            />
            {showSendModal.value && (
              <div className='my-3 absolute left-0 rounded-lg shadow-lg z-50 w-[600px]'>
                <SendForm
                  onClose={handleCloseSendModal}
                  hasplayers={hasValidPlayer}
                  users={selectedUsers as []}
                />
              </div>
            )}
          </div>
        </ButtonsPage>
      }
    >
      {currentView.value === VIEW_NAME.CREATE && (
        <CreateUser
          onUserCreated={() => {
            handleViewChange(VIEW_NAME.TABLE);
            user.value = undefined;
            getUsers();
          }}
          user={user.value}
        />
      )}
      {currentView.value === VIEW_NAME.MESSAGE && <UserMessage />}
      {currentView.value === VIEW_NAME.TABLE && (
        <Table<IUserResponse>
          key={i18n.language}
          data={users.value}
          columns={getColumns(t, handleOnClick)}
          selectable
          onClickAction={handleOnClick}
          onNotifications={onNotifications}
          hasNotifications={notificationValidate.value}
          loading={loading.value}
          visibility={{
            id: false,
            connection: false,
            taskProgress: false,
          }}
          onSelectionChange={(rows) => {
            setSelectedUsers(rows);
          }}
          fileName='employee'
        />
      )}
    </SectionPage>
  );
};
