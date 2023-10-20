import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from '@/components';
import { currentUser as queryCurrentUser } from '@/services/system/login';
import { LinkOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { App } from 'antd';
import { isLoginPath, isSessionExpiredPath } from '@/utils/is';
import { PageEnum } from '@/enums';

const isDev = process.env.NODE_ENV === 'development';

const goLogin = () => {
  const query = queryString.parse(history.location.search);
  const { redirect } = query as { redirect: string };
  history.replace({
    pathname: PageEnum.BASE_LOGIN,
    search:
      redirect &&
      queryString.stringify({
        redirect: redirect,
      }),
  });
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  /**
   * 控制台打印
   */
  // @ts-nocheck
  console.log('%c欢迎使用 WeCoding 统一身份认证中心', 'font-size: 24px;font-weight: bold');
  const fetchUserInfo = async () => {
    return await queryCurrentUser().catch(() => undefined);
  };
  return {
    fetchUserInfo,
    currentUser: isLoginPath() ? undefined : await fetchUserInfo(),
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.metadata?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      let gotoLogin: boolean = false;
      // 如果没有登录，重定向到 login
      if (!initialState || !initialState?.currentUser) {
        gotoLogin = true;
      }
      if (gotoLogin && (isLoginPath() || isSessionExpiredPath())) {
        return;
      }
      if (gotoLogin) {
        goLogin();
        return;
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>API Docs</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <App>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </App>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
