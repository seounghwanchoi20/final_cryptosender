import { IdentityCard } from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";

const baseChain = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"],
    },
    public: {
      http: ["https://mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://basescan.org",
    },
  },
};

export default function IdentityWrapper() {
  const { address } = useAccount();

  return (
    <IdentityCard address={address} schemaId={address} chain={baseChain} />
  );
}
