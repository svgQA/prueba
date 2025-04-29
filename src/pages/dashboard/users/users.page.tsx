import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useMemo } from 'preact/hooks';
import { Section } from '@/components/common/section/section'; // Ajusta según tu estructura
import { CardData } from '@/components/compose/cards'; // Ajusta la ruta si difiere
import { useSignal } from '@preact/signals';
import { Button } from '@/components/common/button/button';
import { CreateUser } from './components/user.create';
import { UserMessage } from './components/user.message';
import { UserTable } from './components/user.table';
import { IUserResponse } from '@/types/auth';
import { useTranslation } from 'react-i18next';

enum VIEW_NAME {
  TABLE,
  CREATE,
  MESSAGE,
}

export const UsersPage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const user = useSignal<IUserResponse>();
  useEffect(() => {
    document.title = t('users.pageTitle');
  }, []);

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view;
  }, []);

  const handleStateChange = useCallback((view: VIEW_NAME) => {
    return currentView.value === view ? 'bg-primary-opacity p-2' : '';
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
        <Button
          name='button-change-table'
          onClick={() => {
            handleViewChange(VIEW_NAME.MESSAGE);
          }}
          rounded={false}
          className={handleStateChange(VIEW_NAME.MESSAGE)}
          icon='314'
        />
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
          count={0}
          subtitle={t('users.cards.totalSubtitle')}
          color='text-secondary'
          icon='189'
        />
        <CardData
          title={t('users.cards.activeConnection')}
          count={0}
          subtitle={t('users.cards.activeSubtitle')}
          color='text-primary'
          icon='020'
        />
        <CardData
          title={t('users.cards.inactiveConnection')}
          count={0}
          subtitle={t('users.cards.inactiveSubtitle')}
          color='text-error'
          icon='110'
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
          />
        )}
      </div>
    </Section>
  );
};
