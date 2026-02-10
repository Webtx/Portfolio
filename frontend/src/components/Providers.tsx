"use client";

import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { SWRConfig } from "swr";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        onErrorRetry: (error, key, _config, revalidate, opts) => {
          const status =
            (error as { status?: number; statusCode?: number })?.status ||
            (error as { statusCode?: number })?.statusCode ||
            0;
          if (status === 401) return;
          if (opts.retryCount >= 3) return;
          setTimeout(() => revalidate({ retryCount: opts.retryCount + 1 }), 5000);
        },
      }}
    >
      <Auth0Provider>{children}</Auth0Provider>
    </SWRConfig>
  );
}
