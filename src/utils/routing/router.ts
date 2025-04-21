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
      users: {
        base: '/users',
        password: {
          base: '/password',
          to: '/users/password',
        },
        areas: {
          base: '/areas',
          to: '/users/areas',
        },
        roles: {
          base: '/roles',
          to: '/users/roles',
        },
        groups: {
          base: '/groups',
          to: '/users/groups',
        },
        settings: {
          base: '/settings',
          to: '/users/settings',
        },
      },
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
      memo: {
        base: '/memo',
        novelty: {
          base: '/novelty',
          to: '/memo/novelty',
          create: {
            base: '/novelty/create',
            to: '/memo/novelty/create',
          },
          update: {
            base: '/novelty/update',
            to: '/memo/novelty/update/:id',
          },
        },
      },
      shifts: {
        base: '/rounds',
        settings: '/rounds/settings',
        service: {
          base: '/service',
          to: '/rounds/service',
          create: {
            base: '/service/create',
            to: '/rounds/service/create',
          },
          update: {
            base: '/service/update',
            to: '/rounds/service/update/:id',
          },
        },
        schedule: {
          base: '/schedule',
          to: '/rounds/schedule',
          create: {
            base: '/schedule/create',
            to: '/rounds/schedule/create',
          },
          update: {
            base: '/schedule/update',
            to: '/rounds/schedule/update/:id',
          },
        },
        task: {
          base: '/task',
          to: '/rounds/task',
          create: {
            base: '/task/create',
            to: '/rounds/task/create',
          },
          update: {
            base: '/task/update',
            to: '/rounds/task/update/:id',
          },
        },
        rounds: {
          base: '/',
          to: '/rounds',
        },
        create: {
          base: '/create',
          to: '/round/create',
        },
        update: {
          base: '/update',
          to: '/round/update/:id',
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
        activity: {
          base: '/activity',
          to: '/rounds/activity',
        },
        activityCreate: {
          base: '/activity/create',
          to: '/rounds/activity/create',
        },
        activityUpdate: {
          base: '/activity/update',
          to: '/rounds/activity/update/:id',
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
        settings: '/setting/settings',
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
        information: {
          base: '/information',
          to: '/access/information',
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
        createInformation: {
          base: '/create',
          to: '/access/createInformation',
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
