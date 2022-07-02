import { useContext } from 'react';

import { RefreshContext } from '../contexts/RefreshContext';

export const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext);
  return { fastRefresh: fast, slowRefresh: slow };
};
