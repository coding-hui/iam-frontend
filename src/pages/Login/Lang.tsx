import React from 'react';
import { SelectLang } from '@umijs/max';

export const Lang: React.FC<{ prefixCls: string }> = (props) => {
  return (
    <div className={`${props.prefixCls}-lang`} data-lang="">
      {SelectLang && <SelectLang />}
    </div>
  );
};
