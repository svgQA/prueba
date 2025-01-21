import { create } from 'zustand';
import { type ICompany, type IUser } from './interface/user.interface';
import { message_service_url } from '@/env.config';

type State = {
  user: IUser | null;
  companies: ICompany[];
  token: string;
  socket: string;
  cognito: string;
};

type Actions = {
  setUser: (user: IUser | null) => void;
  setToken: (token: string) => void;
  setCompanies: (companies: ICompany[]) => void;
  setSelected: (company_id: string) => void;
  getSelected: () => ICompany | undefined;
  getUser: () => IUser | null;
  getToken: () => string;
  getUrlSocket: () => string;
  setCognito: (uuid: string) => void;
  getCognito: () => string;
};

export const useUserStore = create<State & Actions>((set, get) => ({
  user: null,
  token: 'Bearer',
  companies: [],
  socket: '',
  cognito: '',
  getCognito: () => {
    const { cognito } = get();
    return cognito;
  },
  setCognito: (cognito: string) => set({ cognito }),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    set({ token });
  },
  setCompanies: (companies) =>
    set({
      companies: companies.map((company) => ({ ...company, selected: false })),
    }),
  setSelected: (company_id) => {
    const { companies, token } = get();
    let i = 0,
      l = companies.length,
      uuid = '',
      uCompanies = new Array(l);
    for (; i < l; i++) {
      const c = companies[i];
      if (c.id === company_id) uuid = c.tenant_id;
      uCompanies[i] = {
        id: c.id,
        name: c.name,
        nit: c.nit,
        tenant_id: c.tenant_id,
        type: c.type,
        selected: c.id === company_id,
        role: c.role,
      };
    }
    set({
      companies: uCompanies,
      socket: message_service_url + '?token=' + token + '&tenant_uuid=' + uuid,
    });
  },
  getSelected: () => {
    const { companies } = get();
    return companies.find((company) => company.selected);
  },
  getUser: () => {
    const { user } = get();
    return user;
  },
  getUrlSocket: () => {
    const { socket } = get();
    return socket;
  },
  getToken: () => {
    const { token } = get();
    return `Bearer ${token}`;
  },
}));

/**
 * Tener en cuenta que esta funcion depende de un any porque proviene
 * desde tenant y no hay una forma definida para las companies que
 * provienen, por ese motivo se "estabilizar" con el objeto company.
 */
export const parsingCompanies = (data: any): ICompany[] => {
  const model = data?.data;
  if (!model || !model?.companies) return [];
  return model?.companies.map(
    (company: any): ICompany => ({
      id: company.company.id,
      name: company.company.name,
      nit: company.company.nit,
      tenant_id: company.company.tenant_id,
      type: company.company.type,
      selected: false,
      role: company.type,
    })
  );
};
