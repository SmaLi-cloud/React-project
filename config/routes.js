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
                redirect: '/login',
              },
              {
                path:'/cus',
                name: 'cus',
                icon: 'crown',
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
                path:'/co',
                name: 'co',
                icon: 'crown',
                authority: ['co'],
                routes: [
                  {
                    path: '/co/staff',
                    name: 'staff',
                    component: './co/staff',
                    authority: ['co.staff'],
                  },
                  
                ],
              },
              {
                // path:'/sys',
                name: 'sys',
                icon: 'crown',
                authority: ['sys'],
                routes: [
                  {
                    path: '/sys/permission',
                    name: 'permission',
                    icon: 'smile',
                    component: './sys/permission',
                    authority: ['sys.permission'],
                  },
                  {
                    path: '/sys/dictionary',
                    name: 'dictionary',
                    icon: 'smile',
                    component: './sys/dictionary',
                    authority: ['sys.dictionary'],
                  },
                  {
                    path: '/sys/log',
                    name: 'log',
                    icon: 'smile',
                    component: './sys/log',
                    authority: ['sys.log'],
                  },

                  {
                    path: '/sys/role',
                    name: 'role',
                    component: './sys/role',
                    authority: ['sys.role'],
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
