"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";
import Link from "next/link";

interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: any;
  likes: string[];
  isRepost?: boolean;
  originalAuthor?: string;
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(newPosts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border p-4 shadow-sm">
          {post.isRepost && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <svg
                className="w-4 h-4"
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
              <Link
                href={`/profile/${post.author}`}
                className="hover:text-blue-500"
              >
                {post.author.slice(0, 6)}...{post.author.slice(-4)}
              </Link>
              <span>shared a post from</span>
              <Link
                href={`/profile/${post.originalAuthor}`}
                className="hover:text-blue-500"
              >
                {post.originalAuthor?.slice(0, 6)}...
                {post.originalAuthor?.slice(-4)}
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Link
              href={`/profile/${post.author}`}
              className="text-sm text-gray-500 hover:text-blue-500"
            >
              {post.author.slice(0, 6)}...{post.author.slice(-4)}
            </Link>
            <span className="text-sm text-gray-500">
              {post.timestamp?.toDate().toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2">{post.content}</p>
          <div className="mt-4 border-t pt-3 flex items-center gap-4">
            <LikeButton postId={post.id} initialLikes={post.likes || []} />
            <ShareButton post={post} />
          </div>
          <CommentSection postId={post.id} />
        </div>
      ))}
    </div>
  );
}
