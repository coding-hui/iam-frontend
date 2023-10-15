import { createStyles } from 'antd-style';

const useStyle = createStyles(({ token }, props) => {
  const { prefix } = props as any;
  const prefixClassName = `.${prefix}`;
  return {
    main: {
      [`${prefixClassName}`]: {
        ['&-wrapper']: {
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'auto',
          backgroundImage:
            "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
          backgroundSize: '100% 100%',
        },
        ['&-container']: {
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '32px 0',
        },
        ['&-login-form']: {
          minWidth: 280,
          maxWidth: '75vw',
        },
        ['&-lang']: {
          width: 42,
          height: 42,
          lineHeight: '42px',
          position: 'absolute',
          top: 16,
          right: 16,
          borderRadius: token.borderRadius,
          ':hover': {
            backgroundColor: token.colorBgTextHover,
          },
        },
        ['&-login-card']: {
          display: 'flex',
          flexDirection: 'column',
          width: '440px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: 'rgba(57, 106, 255, 0.05) 0px 2px 10px 0px',
        },
      },
    },
  };
});

export default useStyle;
