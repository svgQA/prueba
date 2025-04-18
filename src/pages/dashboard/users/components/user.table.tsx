import { Table } from '@/components/common/table/table';
import { userColumns } from './user.columns';
import { FunctionalComponent } from 'preact';
import { useSignal } from '@preact/signals';
import { IUserResponse } from '@/types/auth';
import { useEffect } from 'preact/hooks';
import { UserService } from '@/services/user';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { toast } from 'react-toastify';

interface UserTableProps {
  onUserEdit?: (user: IUserResponse) => void;
}

export const UserTable: FunctionalComponent<UserTableProps> = (props) => {
  const users = useSignal<IUserResponse[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await UserService.get_all();
    if (!response.getStatus()) return;
    users.value = response.getMany();
  };

  const deleteUser = async (id: number) => {
    const response = await UserService.delete(id);
    if (!response.getStatus()) return;
    getUsers();
  };

  const setProfile = async (id: number, companyId: string) => {
    const response = await UserService.setProfile(id, companyId);
    if (!response.getStatus()) return;
    toast.success(
      'Perfil asignado correctamente, te enviamos un código de verificación'
    );
    getUsers();
  };

  const handleOnClick = async (action: IRowAction) => {
    const user = findUser(Number(action.id));
    console.log(user);
    switch (action.action) {
      case ROW_ACTIONS.DELETE: {
        showAlert({
          title: 'Eliminar Usuario',
          message: `¿Está seguro que desea eliminar el usuario ${user.name} ${user.surname} - ${user.cardId}?`,
          onConfirm: () => deleteUser(Number(action.id)),
          onCancel: () => {},
        });
        break;
      }
      case ROW_ACTIONS.PROFILE: {
        const company = user.extraData?.company;
        if (user.cognitoId)
          return toast.warning(
            'Este usuario ya tiene un perfil asignado, puede iniciar en la aplicación'
          );

        if (!company) {
          return toast.warning(
            'Este usuario no tiene una empresa asignada, por favor asigne para poder asignarle un perfil'
          );
        }

        showAlert({
          title: 'Asignar perfil',
          message: `
          ¿Estás seguro que deseas asignar perfil a ${user.name} ${user.surname}?,
           Tenga en cuenta que el usuario ya podrá usar la aplicación.`,
          onConfirm: () => setProfile(user.id, company),
          onCancel: () => {},
        });
        break;
      }
      case ROW_ACTIONS.UPDATE: {
        if (props.onUserEdit) {
          props.onUserEdit({
            id: user.id,
            cognitoId: user.cognitoId,
            externalId: user.externalId,
            externalPlatformId: user.externalPlatformId,
            name: user.name,
            surname: user.surname,
            userType: user.userType,
            address: user.address,
            email: user.email,
            image: user.image,
            phone: user.phone,
            cardId: user.cardId,
            cardType: user.cardType,
            extraData: user.extraData,
          });
        }
        break;
      }
      default:
        break;
    }
  };

  const findUser = (id: number): IUserResponse => {
    const user = users.value.find((user) => user.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  };

  return (
    <Table<IUserResponse>
      data={users.value}
      columns={userColumns}
      pageSize={10}
      onClickAction={handleOnClick}
      visibility={{
        id: false,
        connection: false,
        taskProgress: false,
      }}
    />
  );
};
