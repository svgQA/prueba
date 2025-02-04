export const PAGES_LIST_ROUTER = {
  home: '/',
  signin: '/signin',
  signup: '/signup',
  dashboard: {
    base: '/dashboard',
    memos: '/',
    shift: '/shifts',
    form: '/forms',
    access: '/access',
    correspondence: '/correspondence',
    users: '/users',
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
        create: {
          base: '/create',
          to: '/round/create',
        },
        places: {
          base: '/places',
          to: '/rounds/places',
        },
        placesCreate: {
          base: '/places/create',
          to: '/rounds/places/create',
        },
        placesUpdate: {
          base: '/places/create',
          to: '/rounds/places/update/:id',
        },
        shiftsCreate: {
          base: '/shifts/create',
          to: '/rounds/shifts/create',
        },
        projects: {
          base: '/projects',
          to: '/rounds/projects',
        },
        projectCreate: {
          base: '/project/create',
          to: '/rounds/project/create',
        },
        projectUpdate: {
          base: '/project/edit',
          to: '/rounds/project/edit/:id',
        },
      },
      setting: {
        base: '/setting',
        user: {
          base: '/',
          to: '/setting',
        },
        userCreate: {
          base: '/user/create',
          to: '/setting/user/create',
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
        resources: {
          base: '/',
          to: '/asociate',
        },
      },
      access: {
        base: '/access',
        resource: {
          base: '/',
          to: '/access',
        },
        sets: {
          base: '/sets',
          to: '/access/sets',
        },
        place: {
          base: '/place',
          to: '/access/place',
        },
        createResource: {
          base: '/create',
          to: '/access/createResource',
        },
        createSets: {
          base: '/create',
          to: '/access/createSets',
        },
        createPlaces: {
          base: '/create',
          to: '/access/createPlaces',
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
      optimus: {
        base: '/optimus',
        resource: {
          base: '/',
          to: '/optimus',
        },
      },
    },
  },
};
