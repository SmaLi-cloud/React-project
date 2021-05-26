export default [
  {
    path: '/',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
        ],
      },
      {
        path: '/',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/user/login',
              },
              
              {
                path: '/co',
                name: 'co',
                authority: ['co'],
                routes: [
                  {
                    path: '/co/staff',
                    name: 'staff',
                    component: './co/staff',
                    authority: ['co.staff'],
                  },
                  {
                    path: '/co/role',
                    name: 'role',
                    component: './co/role',
                    authority: ['co.role'],
                  },
                ],
              },
              {
                path: '/sys',
                name: 'sys',
                authority: ['sys'],
                routes: [
                  {
                    path: '/sys/permission',
                    name: 'permission',
                    component: './sys/permission',
                    authority: ['sys.permission'],
                  },
                  {
                    path: '/sys/dictionary',
                    name: 'dictionary',
                    component: './sys/dictionary',
                    authority: ['sys.dictionary'],
                  },
                  {
                    path: '/sys/sysConfig',
                    name: 'sysConfig',
                    component: './sys/sysConfig',
                    authority: ['sys.sys_config'],
                  },
                ],
              },
              {
                path: '/cus',
                name: 'cus',
                authority: ['cus'],
                routes: [
                  {
                    path: '/cus/thirdPartySystem',
                    name: 'thirdPartySystem',
                    component: './cus/thirdPartySystem',
                    authority: ['cus.third_party_system'],
                  },
                ],
              },
              {
                path: '/dev',
                name: 'dev',
                authority: ['dev'],
                routes: [
                  {
                    path: '/dev/model',
                    name: 'model',
                    component: './dev/model',
                    authority: ['dev.model'],
                  },
                  {
                    path: '/dev/device',
                    name: 'device',
                    component: './dev/device',
                    authority: ['dev.device'],
                  },
                  {
                    path: '/dev/deviceType',
                    name: 'deviceType',
                    component: './dev/deviceType',
                    authority: ['dev.device_type'],
                  },
                ],
              },
              {
                path: '/svr',
                name: 'svr',
                authority: ['svr'],
                routes: [
                  {
                    path: '/svr/emqxServer',
                    name: 'emqxServer',
                    component: './svr/emqxServer',
                    authority: ['svr.emqx_server'],
                  },
                  {
                    path: '/svr/apiServer',
                    name: 'apiServerList',
                    component: './svr/apiServerList',
                    authority: ['svr.api_server_list'],
                  },
                ],
              },
              
              {
                path: '/log',
                name: 'log',
                authority: ['log'],
                routes: [
                  {
                    path: '/log/apiLog',
                    name: 'apiLog',
                    component: './log/apiLog',
                    authority: ['log.api_log'],
                  },
                  {
                    path: '/log/deviceLog',
                    name: 'deviceLog',
                    component: './log/deviceLog',
                    authority: ['log.device_log'],
                  },
                ],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
