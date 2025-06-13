import { FunctionalComponent } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { Section } from '@/components/common/section/section';
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

enum VIEW_NAME {
  TABLE,
  CREATE,
  MESSAGE,
}

export const UsersPage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const user = useSignal<IUserResponse | any>();
  const loading = useSignal<boolean>(false);

  const totalUsers = useSignal(0);
  const connectedUsers = useSignal(0);
  const disconnectedUsers = useSignal(0);

  const showSendModal = useSignal<boolean>(false);
  const notificationValidate = useSignal<boolean>(false);

  const [selectedUsers, setSelectedUsers] = useState<IUserResponse[]>([]);
  const [onNotifications, setOnNotifications] = useState(false);
  const [hasValidPlayer, setHasValidPlayer] = useState(false);

  const hasValidPlayerRef = useRef(false);
  const onNotificationsRef = useRef(false);

  useEffect(() => {
    document.title = t('users.pageTitle');
    fetchStats();
  }, []);

  useEffect(() => {
    hasValidPlayerRef.current = hasValidPlayer;
    setHasValidPlayer(hasValidPlayerRef.current);
  }, [hasValidPlayer]);

  useEffect(() => {
    onNotificationsRef.current = onNotifications;
    setOnNotifications(onNotificationsRef.current);
  }, [onNotifications]);

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
      ToastManager.warning(t('notification.nobody_have_player_id'));
      return;
    }

    if (!onNotificationsRef.current) {
      setOnNotifications(true);
      onNotificationsRef.current = true;
      return;
    }

    if (selectedUsers.length === 0) {
      ToastManager.warning(t('notification.select_at_least_one_employee'));
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
      </div>
    ),
    [
      currentView.value,
      onNotifications,
      showSendModal.value,
      selectedUsers,
      hasValidPlayer,
    ]
  );

  const users = useSignal<IUserResponse[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

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
    ToastManager.success(
      'Perfil asignado correctamente, te enviamos un código de verificación'
    );
    getUsers();
  };

  const handleOnClick = async (action: IRowAction) => {
    const userFound = findUser(Number(action.id));
    switch (action.action) {
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: 'Eliminar Usuario',
          message: `¿Está seguro que desea eliminar el usuario ${userFound.name} ${userFound.surname} - ${userFound.cardId}?`,
          onConfirm: () => deleteUser(userFound.id),
          onCancel: () => {},
        });
        break;
      case ROW_ACTIONS.PROFILE:
        const company = String(userFound.companies[0].company.id);
        if (userFound.cognitoId) {
          return ToastManager.warning(
            'Este usuario ya tiene un perfil asignado, puede iniciar en la aplicación'
          );
        }
        if (!company) {
          return ToastManager.warning(
            'Este usuario no tiene una empresa asignada, por favor asigne para poder asignarle un perfil'
          );
        }
        showAlert({
          title: 'Asignar perfil',
          message: `¿Estás seguro que deseas asignar perfil a ${userFound.name} ${userFound.surname}?, Tenga en cuenta que el usuario ya podrá usar la aplicación.`,
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
    <Section padding>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title={t('user.cards.total')}
          count={totalUsers.value}
          subtitle={t('user.cards.totalSubtitle')}
          color='text-secondary'
          icon='users'
        />
        <CardData
          title={t('user.cards.activeConnection')}
          count={connectedUsers.value}
          subtitle={t('user.cards.activeSubtitle')}
          color='text-primary'
          icon='user-active'
        />
        <CardData
          title={t('user.cards.inactiveConnection')}
          count={disconnectedUsers.value}
          subtitle={t('user.cards.inactiveSubtitle')}
          color='text-error'
          icon='user-inactive'
        />
      </div>

      <div className='max-h-screen relative'>
        <div className='py-2 flex flex-row justify-center xl:justify-between px-1 items-center overflow-visible xl:absolute relative z-10 w-full xl:w-fit'>
          <div className='flex flex-row items-center !w-full xl:!w-fit md:w-auto justify-between'>
            {buttonMenu}
          </div>
        </div>

        {currentView.value === VIEW_NAME.CREATE && (
          <div className='pt-16'>
            <CreateUser
              onUserCreated={() => {
                handleViewChange(VIEW_NAME.TABLE);
                user.value = undefined;
                getUsers();
              }}
              user={user.value}
            />
          </div>
        )}

        {currentView.value === VIEW_NAME.MESSAGE && <UserMessage />}

        {currentView.value === VIEW_NAME.TABLE && (
          <Table<IUserResponse>
            data={users.value}
            columns={getColumns(handleOnClick)}
            pageSize={20}
            selectable
            onClickAction={handleOnClick}
            onNotifications={onNotifications}
            hasNotifications={notificationValidate.value}
            loading={loading.value}
            // showExpandableIcon
            // expandable={() => <></>}
            visibility={{
              id: false,
              connection: false,
              taskProgress: false,
            }}
            onSelectionChange={(rows) => {
              setSelectedUsers(rows);
            }}
          />
        )}
      </div>
    </Section>
  );
};
