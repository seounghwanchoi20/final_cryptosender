"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ShareButtonProps {
  post: {
    id: string;
    content: string;
    author: string;
  };
}

export default function ShareButton({ post }: ShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const handleShare = async () => {
    if (!address || isLoading) return;
    setIsLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        content: post.content,
        author: address,
        originalAuthor: post.author,
        originalPostId: post.id,
        timestamp: serverTimestamp(),
        likes: [],
        isRepost: true,
      });
    } catch (error) {
      console.error("Error sharing post:", error);
      alert("Failed to share post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isLoading || !address}
      className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      <span>Share</span>
    </button>
  );
}
