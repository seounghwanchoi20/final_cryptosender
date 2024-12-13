import { IdentityCard } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import { useAccount } from "wagmi";
import type { Chain } from "viem";

export default function IdentityWrapper() {
  const { address } = useAccount();

  return (
    <IdentityCard address={address} schemaId={address} chain={base as Chain} />
  );
}
