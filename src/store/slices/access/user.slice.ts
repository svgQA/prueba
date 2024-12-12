import { create } from 'zustand';
import { type ICompany, type IUser } from './interface/user.interface';

type State = {
  user: IUser | null;
  companies: ICompany[];
  token: string;
};

type Actions = {
  setUser: (user: IUser | null) => void;
  setToken: (token: string) => void;
  setCompanies: (companies: ICompany[]) => void;
  setSelected: (company_id: string) => void;
  getSelected: () => ICompany | undefined;
  getUser: () => IUser | null;
  getToken: () => string;
};

export const useUserStore = create<State & Actions>((set, get) => ({
  user: null,
  token: 'Bearer',
  companies: [],
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token: `Bearer ${token}` }),
  setCompanies: (companies) =>
    set({
      companies: companies.map((company) => ({ ...company, selected: false })),
    }),
  setSelected: (company_id) => {
    const { companies } = get();
    set({
      companies: companies.map((company) => ({
        ...company,
        selected: company.id === company_id,
      })),
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
  getToken: () => {
    const { token } = get();
    return token;
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
