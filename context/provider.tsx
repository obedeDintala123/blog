"use client";

import { Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { useMe } from "@/lib/requests";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = useMe();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (error) setHasError(true);
  }, [error]);

  if (isLoading && !hasError) return <Loading />;

  return <>{children}</>;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <AuthWrapper>{children}</AuthWrapper>
      </Suspense>
    </QueryClientProvider>
  );
}
