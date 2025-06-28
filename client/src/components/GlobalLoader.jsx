import React from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import LoadingPage from './LoadingPage';

export default function GlobalLoader() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (isFetching + isMutating > 0) {
    return <LoadingPage />;
  }

  return null;
}
