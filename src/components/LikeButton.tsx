"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LikeButtonProps {
  postId: string;
  initialLikes: string[];
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<string[]>(initialLikes || []);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const isLiked = address ? likes.includes(address) : false;

  const handleLike = async () => {
    if (!address || isLoading) return;

    setIsLoading(true);
    try {
      const postRef = doc(db, "posts", postId);

      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(address),
        });
        setLikes(likes.filter((like) => like !== address));
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(address),
        });
        setLikes([...likes, address]);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || !address}
      className={`flex items-center gap-1 ${
        isLiked ? "text-blue-500" : "text-gray-500"
      } hover:text-blue-600 transition-colors`}
    >
      <svg
        className="w-5 h-5"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
        />
      </svg>
      <span>{likes.length}</span>
    </button>
  );
}
