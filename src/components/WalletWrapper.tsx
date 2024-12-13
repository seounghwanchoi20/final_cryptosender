import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import BlueCreateWalletButton from "./CreateWallet";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function WalletWrapper() {
  const { isConnected, address } = useAccount();

  return (
    <div className="flex items-center space-x-4">
      {isConnected && address && (
        <Link
          href={`/profile/${address}`}
          className="rounded-lg bg-[#0052FF] px-4 py-2 text-white hover:bg-blue-700 h-[40px] flex items-center whitespace-nowrap"
        >
          My Profile
        </Link>
      )}
      {!isConnected && <BlueCreateWalletButton />}
      <Wallet>
        <ConnectWallet className="inline-flex items-center justify-center w-[140px] px-4 py-2 text-sm font-medium text-white bg-[#0052FF] rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <Avatar className="h-6 w-6" />
          <Name className="text-white" />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownLink
            icon="wallet"
            href="https://keys.coinbase.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wallet
          </WalletDropdownLink>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
