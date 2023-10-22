import { createStyles } from 'antd-style';

const useStyle = createStyles(({ prefixCls, token }, props) => {
  const antCls = `.${prefixCls}`;
  const prefix = `${props}`;
  const prefixClassName = `.${prefix}`;
  return {
    main: {
      [`${prefixClassName}`]: {
        ['&-title']: {
          marginBlockEnd: 32,
          marginBottom: 20,
          fontWeight: '600',
          fontSize: token.fontSizeHeading5,
          lineHeight: 1.5,
        },
        ['&-upload-picture-circle-wrapper']: {
          [`${antCls}-upload`]: {
            width: 160,
            height: 160,
          },
        },
      },
    },
  };
});
export default useStyle;
