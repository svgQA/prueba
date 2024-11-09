import { PAGES_LIST } from './pages';

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
    shifts: {
      rounds: {
        base: '/rounds',
        to: PAGES_LIST.SETTING_SHIFTS_ROUNDS,
      },
    },
    admin: {
      analytic: {
        base: '/admin',
        to: PAGES_LIST.SETTING_ADMIN,
      },
      database: {
        base: '/admin/database',
        to: PAGES_LIST.SETTING_ADMIN_DATABASE,
      },
      tenant: {
        base: '/admin/tenant',
        to: PAGES_LIST.SETTING_ADMIN_TENANT,
      },
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
        base: '/security/keys',
        to: PAGES_LIST.SETTING_SECURITY_KEYS,
      },
      users: {
        base: '/security/users',
        to: PAGES_LIST.SETTING_SECURITY_USERS,
      },
      roles: {
        base: '/security/roles',
        to: PAGES_LIST.SETTING_SECURITY_ROLES,
      },
      groups: {
        base: '/security/groups',
        to: PAGES_LIST.SETTING_SECURITY_GROUPS,
      },
    },
    payment: {
      payment: {
        base: '/payment',
        to: PAGES_LIST.SETTING_PAYMENT_PAYMENT,
      },
      history: {
        base: '/payment/history',
        to: PAGES_LIST.SETTING_PAYMENT_HISTORY,
      },
    },
    forms: {
      create: {
        base: '/form',
        to: PAGES_LIST.SETTING_FORMS_CREATE,
      },
      analytic: {
        base: '/form/analytic',
        to: PAGES_LIST.SETTING_FORMS_ANALYTIC,
      },
    },
    asociate: {
      list: {
        base: '/asociate',
        to: PAGES_LIST.SETTING_ASOCIATE_LIST,
      },
      resource: {
        base: '/asociate/resources',
        to: PAGES_LIST.SETTING_ASOCIATE_RESOURCES,
      },
    },
    ia: {
      ia: {
        base: '/ia',
        to: PAGES_LIST.SETTING_IA_ANALYTIC,
      },
    },
    sales: {
      sales: {
        base: '/sales',
        to: PAGES_LIST.SETTING_SALES_ANALYTIC,
      },
    },
    iot: {
      devices: {
        base: '/iot/devices',
        to: PAGES_LIST.SETTING_IOT_DEVICES,
      },
      iot: {
        base: '/iot',
        to: PAGES_LIST.SETTING_IOT_ANALYTIC,
      },
      channels: {
        base: '/iot/channels',
        to: PAGES_LIST.SETTING_IOT_CHANNELS,
      },
    },
  },
};
