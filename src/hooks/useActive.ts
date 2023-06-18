import { useCallback, useState } from 'react';

export default function useActive(initialState = false): [
  boolean,
  {
    active: () => void;
    deactive: () => void;
    toggle: () => void;
  },
] {
  const [active, setActive] = useState(initialState);

  return [
    active,
    {
      active: useCallback(() => {
        setActive(true);
      }, []),
      deactive: useCallback(() => {
        setActive(false);
      }, []),
      toggle: useCallback(() => {
        setActive((prevState) => !prevState);
      }, []),
    },
  ];
}
