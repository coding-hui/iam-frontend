import { useState } from 'react';

export default function usePaginate(offset = 0, size = 10) {
  const [pageOffset, setPageOffset] = useState(offset);
  const [pageSize, setPageSize] = useState(size);
  const [pageTotal, setPageTotal] = useState(0);

  const actions = {
    setPageOffset,
    setPageSize,
    setPageTotal,
  } as const;

  return [{ pageOffset, pageSize, pageTotal }, actions] as const;
}
