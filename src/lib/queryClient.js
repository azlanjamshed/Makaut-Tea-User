import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // Data considered fresh for 30s
      gcTime: 1000 * 60 * 5, // Garbage collected after 5 minutes unused
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
