export enum PAGES_LIST {
  HOME = '/',
  SIGNIN = '/signin',
  SIGNUP = '/signup',
  DASHBOARD = '/dashboard',
  SHIFTS = '/shifts',
  FORMS = '/forms',
  MEMOS = '/memos',
  DEVICES = '/devices',
  SETTING = '/setting',
  SETTING_USERS = '/setting/users',
  SETTING_COMPANY = '/setting/company',
  SETTING_MODULES = '/setting/modules',
  SETTING_INTEGRATION = '/setting/integration',
  SETTING_VOXLINE = '/setting/voxline',
  SETTING_SOLO = '/setting/solo',
  FALLBACK = '*',
}

export const PAGES_LIST_ROUTER = {
  home: {
    base: '/',
    to: PAGES_LIST.HOME,
  },
  signin: {
    base: '/signin',
    to: PAGES_LIST.SIGNIN,
  },
  signup: {
    base: '/signup',
    to: PAGES_LIST.SIGNUP,
  },
  dashboard: {
    shift: {
      base: '/',
      to: PAGES_LIST.SHIFTS,
    },
    form: {
      base: '/forms',
      to: PAGES_LIST.FORMS,
    },
    memos: {
      base: '/memos',
      to: PAGES_LIST.MEMOS,
    },
    devices: {
      base: '/devices',
      to: PAGES_LIST.DEVICES,
    },
    setting: {
      user: {
        base: '/',
        to: PAGES_LIST.SETTING,
      },
      company: {
        base: '/company',
        to: PAGES_LIST.SETTING_COMPANY,
      },
      modules: {
        base: '/modules',
        to: PAGES_LIST.SETTING_MODULES,
      },
      integration: {
        base: '/integration',
        to: PAGES_LIST.SETTING_INTEGRATION,
      },
      voxline: {
        base: '/voxline',
        to: PAGES_LIST.SETTING_VOXLINE,
      },
      solo: {
        base: '/solo',
        to: PAGES_LIST.SETTING_SOLO,
      },
    },
    security: {
      keys: {
        base: '',
        to: '',
      },
      users: {
        base: '',
        to: '',
      },
      roles: {
        base: '',
        to: '',
      },
      groups: {
        base: '',
        to: '',
      },
    },
    payment: {
      history: {
        base: '',
        to: '',
      },
      payment: {
        base: '',
        to: '',
      },
    },
    iot: {
      devices: {
        base: '',
        to: '',
      },
      iot: {
        base: '',
        to: '',
      },
      channels: {
        base: '',
        to: '',
      },
    },
  },
};
