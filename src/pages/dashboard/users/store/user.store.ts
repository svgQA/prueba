import { IUserRequest } from '@/types/auth';
import { computed, signal } from '@preact/signals';

export type UserKey = keyof IUserRequest;

export enum USER_MODE_SERVICE {
  CREATE,
  UPDATE,
}

const buildInitUser = (): IUserRequest => ({
  cognitoId: '',
  name: '',
  surname: '',
  email: '',
  externalId: '',
  externalPlatformId: '',
  image: '',
  phone: '',
  cardId: '',
  cardType: undefined,
  extraData: {
    country: '',
    state: '',
    city: '',
    job: '',
    area: '',
    sucursal: '',
    company: '',
  },
});

interface IUserMode {
  mode: USER_MODE_SERVICE;
  id?: number;
}

const user = signal<IUserRequest>(buildInitUser());
const userMode = signal<IUserMode>({ mode: USER_MODE_SERVICE.CREATE });
export const getUserMode = computed(() => userMode.value);
export const getUser = computed(() => user.value);
export const setUser = (
  mode: IUserMode = {
    mode: USER_MODE_SERVICE.CREATE,
  },
  model?: IUserRequest
) => {
  user.value =
    mode.mode === USER_MODE_SERVICE.CREATE
      ? buildInitUser()
      : model || buildInitUser();
  userMode.value = mode;
};
export const updateUser = (name: UserKey, value: string | number | boolean) => {
  if (user.value) {
    user.value = {
      ...user.value,
      [name]: value,
    };
  }
};
