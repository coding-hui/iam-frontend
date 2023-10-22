import type { GenerateStyle, ProAliasToken } from '@ant-design/pro-components';
import { useStyle as useAntdStyle } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import { useContext } from 'react';

const { ConfigContext } = ConfigProvider;

interface AppConfigToken extends ProAliasToken {
  antCls: string;
  prefixCls: string;
}

const genStyles: GenerateStyle<AppConfigToken> = (token) => {
  const { prefixCls } = token;
  return {
    [`${prefixCls}`]: {
      [`&-app-name`]: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        fontSize: '24px',
        fontWeight: 500,
        color: '#293350',
        marginRight: '8px',
        overflow: 'hidden',
      },
      [`&-app-id`]: {
        fontFamily: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        color: '#86909c',
      },
    },
  };
};

export default function useStyle(prefixCls?: string) {
  const { getPrefixCls } = useContext(ConfigContext || ConfigProvider.ConfigContext);
  const antCls = `.${getPrefixCls()}`;

  return useAntdStyle('EditApp', (token) => {
    const appConfigToken: AppConfigToken = {
      ...token,
      prefixCls: `.${prefixCls}`,
      antCls,
    };

    return [genStyles(appConfigToken)];
  });
}
