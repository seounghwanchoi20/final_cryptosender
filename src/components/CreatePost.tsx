"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !address) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        content,
        author: address,
        timestamp: serverTimestamp(),
        likes: [],
        isRepost: false,
      });
      setContent("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-lg border p-2 focus:border-[#0052FF] focus:outline-none"
        placeholder="What's on your mind?"
        rows={3}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="rounded-lg bg-[#0052FF] px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
