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
                path:'/sys',
                name: 'sys',
                icon: 'crown',
                authority:['sys'],
                routes: [
                  {
                    path: '/sys/permission',
                    name: 'permission',
                    icon: 'smile',
                    component: './sys/permission',
                    authority:['sys.permission'],
                  },
                  {
                    path: '/sys/dictionary',
                    name: 'dictionary',
                    icon: 'smile',
                    component: './sys/dictionary',
                    authority:['sys.dictionary'],
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
