import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: '系统管理',
  //   icon: 'nb-gear',
  //   children: [
  //     {
  //       title: '角色管理',
  //       icon: 'ion-person-stalker',
  //       link: '/pages/role/list',
  //     },
  //     {
  //       title: '用户管理',
  //       icon: 'ion-person',
  //       link: '/pages/user/list',
  //     },
  //     {
  //       title: '模块管理',
  //       icon: 'ion-android-archive',
  //       link: '/pages/module/list',
  //     },
  //     {
  //       title: '查询管理',
  //       icon: 'ion-android-archive',
  //       link: '/pages/query/list',
  //     }
  //   ]
  // },
  // {
  //   title: '测试查询',
  //   icon: 'nb-gear',
  //   children: [
  //     {
  //       title: '模块管理',
  //       icon: 'ion-person-stalker',
  //       link: '/pages/query/query/module'
  //     },
  //     {
  //       title: '查询管理',
  //       icon: 'ion-person-stalker',
  //       link: '/pages/query/query/query'
  //     },
  //     {
  //       title: '用户管理',
  //       icon: 'ion-person-stalker',
  //       link: '/pages/query/query/user'
  //     },
  //     {
  //       title: '角色管理',
  //       icon: 'ion-person-stalker',
  //       link: '/pages/query/query/role'
  //     }
  //   ]
  // },
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'UI Features',
    icon: 'nb-keypad',
    link: '/pages/ui-features',
    children: [
      {
        title: 'Buttons',
        link: '/pages/ui-features/buttons',
      },
      {
        title: 'Grid',
        link: '/pages/ui-features/grid',
      },
      {
        title: 'Icons',
        link: '/pages/ui-features/icons',
      },
      {
        title: 'Modals',
        link: '/pages/ui-features/modals',
      },
      {
        title: 'Typography',
        link: '/pages/ui-features/typography',
      },
      {
        title: 'Animated Searches',
        link: '/pages/ui-features/search-fields',
      },
      {
        title: 'Tabs',
        link: '/pages/ui-features/tabs',
      },
    ],
  },
  {
    title: 'Forms',
    icon: 'nb-compose',
    children: [
      {
        title: 'Form Inputs',
        link: '/pages/forms/inputs',
      },
      {
        title: 'Form Layouts',
        link: '/pages/forms/layouts',
      },
    ],
  },
  {
    title: 'Components',
    icon: 'nb-gear',
    children: [
      {
        title: 'Tree',
        link: '/pages/components/tree',
      }, {
        title: 'Notifications',
        link: '/pages/components/notifications',
      },{
        title: 'treeview',
        link: '/pages/components/treeview',
      },
    ],
  },
  {
    title: 'Maps',
    icon: 'nb-location',
    children: [
      {
        title: 'Google Maps',
        link: '/pages/maps/gmaps',
      },
      {
        title: 'Leaflet Maps',
        link: '/pages/maps/leaflet',
      },
      {
        title: 'Bubble Maps',
        link: '/pages/maps/bubble',
      },
    ],
  },
  {
    title: 'Charts',
    icon: 'nb-bar-chart',
    children: [
      {
        title: 'Echarts',
        link: '/pages/charts/echarts',
      },
      {
        title: 'Charts.js',
        link: '/pages/charts/chartjs',
      },
      {
        title: 'D3',
        link: '/pages/charts/d3',
      },
    ],
  },
  {
    title: 'Editors',
    icon: 'nb-title',
    children: [
      {
        title: 'TinyMCE',
        link: '/pages/editors/tinymce',
      },
      {
        title: 'CKEditor',
        link: '/pages/editors/ckeditor',
      },
    ],
  },
  {
    title: 'Tables',
    icon: 'nb-tables',
    children: [
      {
        title: 'Smart Table',
        link: '/pages/tables/smart-table',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'nb-locked',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
