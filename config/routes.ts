/**
 * Copyright (c) 2023 coding-hui. All rights reserved.
 * Use of this source code is governed by a MIT style
 * license that can be found in the LICENSE file.
 */

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    name: 'login',
    path: '/login',
    layout: false,
    hideInMenu: true,
    component: './Login',
  },
  {
    name: 'callback',
    path: '/auth/callback',
    layout: false,
    hideInMenu: true,
    component: './Login/Callback',
  },
  {
    name: 'bind-account',
    path: '/auth/bind-account',
    layout: false,
    hideInMenu: true,
    component: './Login/BindAccount',
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'PieChartOutlined',
    component: './Welcome',
  },
  {
    name: 'org-management',
    path: '/org-management',
    icon: 'ClusterOutlined',
    routes: [
      { path: '/org-management', redirect: '/org-management/org' },
      {
        path: '/org-management/user',
        name: 'user.list',
        component: './User',
      },
      {
        path: '/org-management/user/:instanceId',
        name: 'user.edit',
        component: './User/Edit',
        hideInMenu: true,
        parentKeys: ['/org-management', '/org-management/user'],
      },
      {
        path: '/org-management/org',
        name: 'org.list',
        component: './Organization',
      },
      {
        path: '/org-management/org/:instanceId',
        name: 'org.edit',
        component: './Organization/Edit',
        hideInMenu: true,
        parentKeys: ['/org-management', '/org-management/org'],
      },
    ],
  },
  {
    name: 'app-management',
    path: '/app-management',
    icon: 'RobotOutlined',
    routes: [
      { path: '/app-management', redirect: '/app-management/app' },
      {
        path: '/app-management/app',
        name: 'app.list',
        component: './Application',
      },
      {
        path: '/app-management/mail-template',
        name: 'mail.list',
        component: './Email',
      },
      {
        path: '/app-management/mail-template/create',
        name: 'mail.create',
        component: './Email/Create',
        hideInMenu: true,
        parentKeys: ['/app-management', '/app-management/mail-template'],
      },
      {
        path: '/app-management/mail-template/edit/:instanceId',
        name: 'mail.edit',
        component: './Email/Edit',
        hideInMenu: true,
        parentKeys: ['/app-management', '/app-management/mail-template'],
      },
      {
        path: '/app-management/app/edit/:instanceId',
        name: 'app.edit',
        component: './Application/Edit',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'authn',
    path: '/authn',
    icon: 'NodeIndexOutlined',
    routes: [
      { path: '/authn', redirect: '/authn/identity-source/social' },
      {
        path: '/authn/identity-source/social',
        name: 'identity-source.social.list',
        component: './IdentityProvider',
      },
      {
        path: '/authn/identity-source/social/edit/:instanceId',
        name: 'identity-source.social.edit',
        component: './IdentityProvider/Create',
        hideInMenu: true,
      },
      {
        path: '/authn/identity-source/social/create',
        name: 'identity-source.social.create',
        component: './IdentityProvider/Create',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'resource',
    path: '/resource',
    icon: 'SecurityScanOutlined',
    routes: [
      { path: '/resource', redirect: '/resource/list' },
      {
        path: '/resource/list',
        name: 'resource-list',
        component: './Resource',
      },
      {
        path: '/resource/create',
        name: 'resource-create',
        component: './Resource/Create',
        hideInMenu: true,
        parentKeys: ['/resource', '/resource/list'],
      },
      {
        path: '/resource/edit/:instanceId',
        name: 'resource-edit',
        component: './Resource/Edit',
        hideInMenu: true,
        parentKeys: ['/resource', '/resource/list'],
      },
      {
        path: '/resource/policy',
        name: 'policy-list',
        component: './Policy',
      },
      {
        path: '/resource/policy/create',
        name: 'policy-create',
        component: './Policy/Create',
        hideInMenu: true,
      },
      {
        path: '/resource/policy/edit/:instanceId',
        name: 'policy-edit',
        component: './Policy/Create',
        hideInMenu: true,
      },
      {
        path: '/resource/role',
        name: 'role-list',
        component: './Role',
      },
      {
        path: '/resource/role/:instanceId',
        name: 'role-edit',
        component: './Role/Edit',
        hideInMenu: true,
      },
      {
        path: '/resource/apikey',
        name: 'apikey.list',
        component: './ApiKey',
      },
    ],
  },
  // {
  //   path: 'system',
  //   name: 'system',
  //   icon: 'SettingOutlined',
  //   component: './Admin',
  // },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
