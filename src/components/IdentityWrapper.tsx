import { IdentityCard } from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";
import { base } from "viem/chains";

export default function IdentityWrapper() {
  const { address } = useAccount();

  return <IdentityCard address={address} schemaId={address} chain={base} />;
}
