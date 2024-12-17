export const PAGES_LIST_ROUTER = {
  home: '/',
  signin: '/signin',
  signup: '/signup',
  dashboard: {
    base: '/dashboard',
    memos: '/',
    shift: '/shifts',
    form: '/forms',
    devices: '/devices',
    setting: {
      base: '/setting',
      admin: {
        base: '/admin',
        analytic: {
          base: '/',
          to: '/admin',
        },
        database: {
          base: '/database',
          to: '/admin/database',
        },
        tenant: {
          base: '/tenant',
          to: '/admin/tenant',
        },
      },
      shifts: {
        base: '/rounds',
        rounds: {
          base: '/',
          to: '/rounds',
        },
      },
      setting: {
        base: '/setting',
        user: {
          base: '/',
          to: '/setting',
        },
        company: {
          base: '/company',
          to: '/setting/company',
        },
        modules: {
          base: '/modules',
          to: '/setting/modules',
        },
        integration: {
          base: '/integration',
          to: '/setting/integration',
        },
        voxline: {
          base: '/voxline',
          to: '/setting/voxline',
        },
        solo: {
          base: '/solo',
          to: '/setting/solo',
        },
      },
      security: {
        base: '/security',
        keys: {
          base: '/',
          to: '/security',
        },
        users: {
          base: '/users',
          to: '/security/users',
        },
        roles: {
          base: '/roles',
          to: '/security/roles',
        },
        groups: {
          base: '/groups',
          to: '/security/groups',
        },
      },
      payment: {
        base: '/payment',
        payment: {
          base: '/',
          to: '/payment',
        },
        history: {
          base: '/history',
          to: '/payment/history',
        },
      },
      forms: {
        base: '/form',
        form: {
          base: '/',
          to: '/form',
        },
        create: {
          base: '/create',
          to: '/form/create',
        },
        analytic: {
          base: '/analytic',
          to: '/form/analytic',
        },
        inspect: {
          base: '/inspect',
          to: '/form/inspect',
        },
        response: {
          base: '/response',
          to: '/form/response',
        },
        list: {
          base: '/list',
          to: '/form/list',
        },
        report: {
          base: '/report',
          to: '/form/report',
        },
      },
      asociate: {
        base: '/asociate',
        list: {
          base: '/',
          to: '/asociate',
        },
        resource: {
          base: '/resources',
          to: '/asociate/resources',
        },
      },
      ia: {
        base: '/ia',
        ia: {
          base: '/',
          to: '/ia',
        },
      },
      sales: {
        base: '/sales',
        sales: {
          base: '/',
          to: '/sales',
        },
      },
      iot: {
        base: '/iot',
        iot: {
          base: '/',
          to: '/iot',
        },
        devices: {
          base: '/devices',
          to: '/iot/devices',
        },
        channels: {
          base: '/channels',
          to: '/iot/channels',
        },
      },
    },
  },
};
