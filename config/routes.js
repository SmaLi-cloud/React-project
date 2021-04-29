export default [
  {
    path: '/',
    // component: '../layouts/BlankLayout',
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
                redirect: '/home',
              },
              {
                path: '/home',
                name: 'home',
                icon: 'home',
                component: './home',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Admin',
                  },
                ],
              },
              {
                path: '/list',
                name: 'list',
                icon: 'smile',
                component: './tableList',
                // authority:["co.sss"]
              },
              {
                path: '/form',
                name: 'form',
                icon: 'smile',
                component: './treeList',
                // authority:["co.sss"]
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
