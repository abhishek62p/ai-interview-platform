"use client";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <NextAuthSessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider >
    </NextAuthSessionProvider >
  )
}
