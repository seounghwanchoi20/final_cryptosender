import React, { useCallback } from "react";
import { useConnect } from "wagmi";

export default function BlueCreateWalletButton() {
  const { connectors, connect } = useConnect();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK"
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center w-[140px] px-4 py-2 text-sm font-medium text-white bg-[#0052FF] rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={createWallet}
    >
      Create Wallet
    </button>
  );
}
