"use client";
import Link from "next/link";
import WalletWrapper from "./WalletWrapper";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-12 sm:px-24 lg:px-36">
        <div className="flex h-20 justify-between items-center">
          <Link
            href="/"
            className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-3"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>CryptoSender</span>
          </Link>

          <div className="flex items-center ml-[300px]">
            <WalletWrapper />
          </div>
        </div>
      </div>
    </nav>
  );
}
