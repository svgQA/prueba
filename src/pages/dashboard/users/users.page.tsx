import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section'; // Ajusta según tu estructura
import { CardData } from '@/components/compose/cards'; // Ajusta la ruta si difiere
import { Table } from '@/components/common/table/table'; // Tu tabla reutilizable
import { ExpandableUser } from '@/components/compose/table/expandable/user';
import { User, usersData } from './utils';
import { userColumns } from './components/user.columns';

export const UsersPage: FunctionalComponent = () => {
  useEffect(() => {
    document.title = 'VX - Users Service';
  }, []);

  return (
    <Section>
      {/* Ejemplo de 3 cards arriba, análogo a shifts */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total de Usuarios'
          count={usersData.length}
          subtitle='Registrados'
          color='text-secondary'
          icon='189'
        />
        <CardData
          title='Conexión Activa'
          count={usersData.filter((u) => u.connection === 'Activo').length}
          subtitle='Usuarios conectados'
          color='text-primary'
          icon='020'
        />
        <CardData
          title='Conexión Inactiva'
          count={usersData.filter((u) => u.connection === 'Inactivo').length}
          subtitle='Usuarios desconectados'
          color='text-error'
          icon='110'
        />
      </div>

      {/* La tabla reutilizable con las columnas y un expansible para user */}
      <Table<User>
        data={usersData}
        columns={userColumns}
        pageSize={10}
        expandable={(row: User) => <ExpandableUser row={row} />}
        visibility={
          {
            // Oculta/visible si gustas. Ejemplo:
            // identification: true,
            // department: false,
          }
        }
      />
    </Section>
  );
};
