import { create } from 'zustand';
import { type ICompany, type IUser } from './interface/user.interface';

type State = {
  user: IUser | null;
  companies: ICompany[];
};

type Actions = {
  setUser: (user: IUser | null) => void;
  setCompanies: (companies: ICompany[]) => void;
};

export const useUserStore = create<State & Actions>((set) => ({
  user: null,
  companies: [],
  setUser: (user) => set({ user }),
  setCompanies: (companies) => set({ companies }),
}));

/**
 * Tener en cuenta que esta funcion depende de un any porque proviene
 * desde tenant y no hay una forma definida para las companies que
 * provienen, por ese motivo se "estabilizar" con el objeto company.
 */
export const parsingCompanies = (data: any): ICompany[] => {
  return data.companies.map((company: any) => ({
    id: company.company.id,
    name: company.company.name,
    nit: company.company.nit,
    tenant_id: company.company.tenant_id,
    type: company.company.type,
  }));
};
