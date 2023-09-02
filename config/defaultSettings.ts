import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * Global Settings
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'WeCoding IAM',
  pwa: true,
  splitMenus: false,
  siderMenuType: 'group',
  siderWidth: 184,
  logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAYAAABNo9TkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAEphJREFUeNrs2sFtAyEURdEhorB4j6CkuCUQ+7gzbC9SQRRNPnNOCU/I+Io5DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHaWTABxldqWFXi5zdEfZgDcC7y97gT/8SGoDxMAAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAA4GTZBEBkc/RkBQC/iT9KbctJAKLygg4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAACAs2UTQGg3EwBvpbZ19Q3m6MlJwN0IROYiAwCBLtAB4B/wiTsAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAIdAAAAECgAwAAgEAHAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAABDoAAAAg0AEAAECgAwAAAAIdAAAAdpdNABBbqe3z6hvM0R9OAgAg0AE427cJjmQCACA6n7gDAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAACAQAcAAAAEOgAAAAh0AAAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAYHfZBBBXqe1+9Q3m6HcnAQAAgQ6c7csEh0AHAGALPnEHAAAAgQ4AAAAIdAAAABDoAAAAgEAHAAAAgQ4AAAAIdAAAABDoAAAAgEAHAAAAgQ4AAAAIdAAAABDoAAAAgEAHAAAAgQ4AAAAIdAAAABDoAAAAgEAHAAAAgQ4AAAAIdAAAABDoAAAAgEAHAAAAgQ4AAAAIdAAAABDoAAAAgEAHAAAAgQ4AAAAIdAAAABDoAAAAgEAHAAAAgQ4AAAD8RjYBAAC7KLWtq28wR09OAsTkBR0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAAh0AAAAEOgAAACDQAQAAQKADAAAAZ8smAADYQ6ltWQEgLi/oAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAABDoAAAAINABAAAAgQ4AAAACHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC/9BRgAGHIK2BEljbkAAAAAElFTkSuQmCC',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
};

export default Settings;
