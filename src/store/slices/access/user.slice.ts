import { create } from 'zustand';
// import { type ICompany } from './interface/user.interface';
// import { message_service_url } from '@/env.config';
import { IUserResponse } from '@/types/auth';
import { IOption } from '@/components/common/multi/interface';

type State = {
  companies: IOption[];
  user: IUserResponse | null;
  token: string;
  socket: string;
  cognito: string;
  tenant: string;
  selectedCompany: IOption | null;
  loaded: boolean;
  places: IOption[];
  selectedPlace: IOption | null;
};

type Actions = {
  setUser: (user?: IUserResponse) => void;
  setToken: (token: string) => void;
  getUser: () => IUserResponse | null;
  getToken: () => string;
  setLoaded: (loaded: boolean) => void;
  getLoaded: () => boolean;
  getUrlSocket: () => string;
  setCognito: (uuid: string) => void;
  getCognito: () => string;
  setTenant: (uuid: string) => void;
  getTenant: () => string;
  getCompany: (id: number) => IOption | null | undefined;
  getCompanyId: () => string;
  setCompanies: (companies: IOption[]) => void;
  getCompanies: () => IOption[];
  setSelectedCompany: (id: number) => void;
  getSelectedCompany: () => IOption | null;
  cleanUserStore: () => void;
  getPlace: (id: number) => IOption | null | undefined;
  getPlaceId: () => string;
  setPlaces: (places: IOption[]) => void;
  getPlaces: () => IOption[];
  setSelectedPlace: (id: number) => void;
  getSelectedPlace: () => IOption | null;
};

export const useUserStore = create<State & Actions>((set, get) => ({
  user: null,
  token: 'Bearer',
  companies: [],
  socket: '',
  cognito: '',
  tenant: '',
  selectedCompany: null,
  loaded: false,
  places: [],
  selectedPlace: null,
  setLoaded: (loaded: boolean) => set({ loaded }),
  getLoaded: () => {
    const { loaded } = get();
    return loaded;
  },
  getCompanyId: () => {
    const { selectedCompany } = get();
    return String(selectedCompany?.value || '1');
  },
  getCompany: (id: number) => {
    const { companies } = get();
    return companies.find((company) => company.value === id);
  },
  getSelectedCompany: () => {
    const { selectedCompany } = get();
    return selectedCompany;
  },
  setSelectedCompany: (id: number) => {
    const { companies } = get();
    const company = companies.find((company) => company.value === id);
    if (company) {
      set({ selectedCompany: company });
    } else {
      set({ selectedCompany: companies[0] });
    }
  },
  setCompanies: (companies: IOption[]) => set({ companies }),
  getCompanies: () => {
    const { companies } = get();
    return companies;
  },
  setTenant: (uuid: string) => set({ tenant: uuid }),
  getTenant: () => {
    const { tenant } = get();
    return tenant;
  },
  getCognito: () => {
    const { cognito } = get();
    return cognito;
  },
  setCognito: (cognito: string) => set({ cognito }),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    set({ token });
  },
  /*
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
  */
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
  cleanUserStore: () => {
    set({
      user: null,
      token: 'Bearer',
      companies: [],
      socket: '',
      cognito: '',
      tenant: '',
      selectedCompany: null,
      loaded: false,
    });
  },
  getPlaceId: () => {
    const { selectedCompany } = get();
    return String(selectedCompany?.value || '1');
  },
  getPlace: (id: number) => {
    const { places } = get();
    return places.find((place) => place.value === id);
  },
  getSelectedPlace: () => {
    const { selectedPlace } = get();
    return selectedPlace;
  },
  setSelectedPlace: (id: number) => {
    const { places } = get();
    const place = places.find((place) => place.value === id);
    if (place) {
      set({ selectedPlace: place });
    } else {
      set({ selectedPlace: places[0] });
    }
  },
  setPlaces: (places: IOption[]) => set({ places }),
  getPlaces: () => {
    const { places } = get();
    return places;
  },
}));

/**
 * Tener en cuenta que esta funcion depende de un any porque proviene
 * desde tenant y no hay una forma definida para las companies que
 * provienen, por ese motivo se "estabilizar" con el objeto company.
 */
/*
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
*/
