import { create } from "lodash";

export const PAGES_LIST_ROUTER = {
  home: '/',
  signin: '/signin',
  signup: '/signup',
  demo: '/demo',
  dashboard: {
    base: '/dashboard',
    memos: '/',
    shift: '/shifts',
    form: '/forms',
    access: '/access',
    correspondence: '/correspondence',
    users: '/users',
    devices: '/devices',
    history: '/history',
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
          create: {
            base: '/create',
            to: '/users/areas/create',
          },
          update: {
            base: '/update',
            to: '/users/areas/update/:id',
          },
        },
        roles: {
          base: '/roles',
          to: '/users/roles',
          create: {
            base: '/create',
            to: '/users/roles/create',
          },
          update: {
            base: '/update',
            to: '/users/roles/update/:id',
          },
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
        predefined: {
          base: '/predefined',
          to: '/memo/predefined',
          create: {
            base: '/predefined/create',
            to: '/memo/predefined/create',
          },
          update: {
            base: '/predefined/update',
            to: '/memo/predefined/update/:id',
          },
        },
        resource: {
          base: '/resource',
          to: '/memo/resource',
          create: {
            base: '/resource/create',
            to: '/memo/resource/create',
          },
          update: {
            base: '/resource/update',
            to: '/memo/resource/update/:id',
          },
        },
      },
      shifts: {
        base: '/shifts',
        settings: '/shifts/settings',
        service: {
          base: '/service',
          to: '/shifts/service',
          create: {
            base: '/service/create',
            to: '/shifts/service/create',
          },
          update: {
            base: '/service/update',
            to: '/shifts/service/update/:id',
          },
        },
        schedule: {
          base: '/schedule',
          to: '/shifts/schedule',
          create: {
            base: '/schedule/create',
            to: '/shifts/schedule/create',
          },
          update: {
            base: '/schedule/update',
            to: '/shifts/schedule/update/:id',
          },
        },
        task: {
          base: '/task',
          to: '/shifts/task',
          create: {
            base: '/task/create',
            to: '/shifts/task/create',
          },
          update: {
            base: '/task/update',
            to: '/shifts/task/update/:id',
          },
        },
        rounds: {
          base: '/rounds',
          to: '/shifts/rounds',
          create: {
            base: '/create',
            to: '/shifts/rounds/create',
          },
          update: {
            base: '/update',
            to: '/shifts/rounds/update/:id',
          },
        },
        places: {
          base: '/places',
          to: '/shifts/places',
          create: {
            base: '/places/create',
            to: '/shifts/places/create',
          },
          update: {
            base: '/places/create',
            to: '/shifts/places/update/:id',
          },
        },
        activity: {
          base: '/activity',
          to: '/shifts/activity',
          create: {
            base: '/activity/create',
            to: '/shifts/activity/create',
          },
          update: {
            base: '/activity/update',
            to: '/shifts/activity/update/:id',
          },
        },
        project: {
          base: '/projects',
          to: '/shifts/projects',
          create: {
            base: '/projects/create',
            to: '/shifts/projects/create',
          },
          update: {
            base: '/project/edit',
            to: '/shifts/project/edit/:id',
          },
        },
      },
      notification: {
        base: '/notification',
        settings: '/notification/settings',
        scheduled: {
          base: '/scheduled',
          to: '/notification/scheduled',
          create: {
            base: '/scheduled/create',
            to: '/notification/scheduled/create',
          },
          update: {
            base: '/scheduled/update/:id',
            to: '/notification/scheduled/update/:id',
          },
        },
        template: {
          base: '/template',
          to: '/notification/template',
          create: {
            base: '/template/create',
            to: '/notification/template/create',
          },
          update: {
            base: '/template/update/:id',
            to: '/notification/template/update/:id',
          },
        },
      },
      setting: {
        base: '/setting',
        settings: '/setting/settings',
        user: {
          base: '/',
          to: '/setting',
        },
        create: {
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
          create: {
            base: '/groups/create',
            to: '/security/groups/create',
          },
          update: {
            base: '/groups/update',
            to: '/security/groups/update/:id',
          },
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
        base: '/forms',
        settings: '/forms/settings',
        form: {
          base: '',
          to: '/forms',
          create: {
            base: '/create',
            to: '/forms/create',
          },
        },
        analytic: {
          base: '/analytic',
          to: '/forms/analytic',
        },
        // inspect: {
        //   base: '/inspect',
        //   to: '/form/inspect',
        // },
        response: {
          base: '/response',
          to: '/forms/response',
        },
        list: {
          base: '/list',
          to: '/forms/list',
        },
        report: {
          base: '/report',
          to: '/forms/report',
          update: {
            base: '/update',
            to: '/forms/report/update/:id',
          },
          create: {
            base: '/create',
            to: '/forms/report/create',
          },
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
          create: {
            base: '/create',
            to: '/access/create',
          },
        },
        sets: {
          base: '/sets',
          to: '/access/sets',

          create: {
            base: '/create',
            to: '/access/create',
          },
        },
        place: {
          base: '/place',
          to: '/access/place',
          create: {
            base: '/create',
            to: '/access/create',
          },
        },
        information: {
          base: '/information',
          to: '/access/information',
          create: {
            base: '/create',
            to: '/access/create',
          },
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
