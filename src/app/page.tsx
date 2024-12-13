"use client";
import { useAccount } from "wagmi";
import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import Navbar from "@/components/Navbar";

export default function Page() {
  const { isConnected } = useAccount();

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24">
        <div className="w-full space-y-6">
          {isConnected ? (
            <CreatePost />
          ) : (
            <div className="rounded-lg bg-gray-100 p-4 text-center text-gray-600">
              <p>Connect your wallet to start posting!</p>
            </div>
          )}
          <PostFeed />
        </div>
      </div>
    </>
  );
}
