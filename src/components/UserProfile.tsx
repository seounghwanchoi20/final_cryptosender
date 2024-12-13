"use client";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function UserProfile(): JSX.Element {
  const { address } = useAccount();

  if (!address) {
    return <div className="text-center">Please connect your wallet</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Your Profile</h2>
          <span className="text-gray-600">
            ({address.slice(0, 6)}...{address.slice(-4)})
          </span>
        </div>
        <Link
          href={`/profile/${address}`}
          className="text-blue-500 hover:text-blue-600"
        >
          View your activity →
        </Link>
      </div>
    </div>
  );
}
