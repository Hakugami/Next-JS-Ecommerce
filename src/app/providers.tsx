"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CartProvider } from "@/providers/CartProvider";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { FontSizeProvider } from "@/providers/FontSizeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme={true}
        >
          <FontSizeProvider>
            <CartProvider>
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
              </main>
              <footer className="bg-gray-800 text-white mt-auto">
                <div className="container mx-auto px-4 py-4 text-center">
                  &copy; 2024 PC Parts Store
                </div>
              </footer>
              <Toaster />
            </CartProvider>
          </FontSizeProvider>
        </NextThemesProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
