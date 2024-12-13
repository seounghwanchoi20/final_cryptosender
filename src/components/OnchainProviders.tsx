"use client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { base } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { NEXT_PUBLIC_CDP_API_KEY } from "../config";
import { useWagmiConfig } from "../wagmi";
import type { Chain } from "viem";

type Props = { children: ReactNode };

const queryClient = new QueryClient();

const baseChainConfig: Chain = {
  ...base,
  id: 8453,
  name: "Base",
  network: "base",
};

function OnchainProviders({ children }: Props) {
  const wagmiConfig = useWagmiConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={NEXT_PUBLIC_CDP_API_KEY}
          chain={baseChainConfig}
          config={{
            appearance: {
              mode: "auto",
              theme: "base",
            },
          }}
        >
          <RainbowKitProvider modalSize="compact">
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
export default OnchainProviders;
