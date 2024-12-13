"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: any;
  postId: string;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  // Fetch comments
  useEffect(() => {
    console.log("Starting to fetch comments for postId:", postId);

    // Simpler query without orderBy
    const q = query(collection(db, "comments"), where("postId", "==", postId));

    try {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(
            "Snapshot received, document count:",
            snapshot.docs.length
          );

          if (snapshot.empty) {
            console.log("No comments found for this post");
            setComments([]);
            return;
          }

          const commentData = snapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Comment found:", {
              id: doc.id,
              ...data,
            });
            return {
              id: doc.id,
              content: data.content || "",
              author: data.author || "",
              timestamp: data.timestamp,
              postId: data.postId,
            } as Comment;
          });

          console.log("Setting comments state with:", commentData);
          setComments(commentData);
        },
        (error) => {
          console.error("Error in snapshot listener:", error);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up snapshot listener:", error);
    }
  }, [postId]);

  // Add this console.log to verify state updates
  useEffect(() => {
    console.log("Current comments in state:", comments);
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !newComment.trim() || isLoading) return;

    const commentContent = newComment.trim();
    setNewComment("");
    setIsLoading(true);

    try {
      const commentData = {
        postId,
        content: commentContent,
        author: address,
        timestamp: serverTimestamp(),
      };

      console.log("Adding comment:", commentData);

      await addDoc(collection(db, "comments"), commentData);
      console.log("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
      setNewComment(commentContent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              address ? "Write a comment..." : "Connect wallet to comment"
            }
            className="flex-1 rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
            disabled={!address || isLoading}
          />
          <button
            type="submit"
            disabled={!address || isLoading || !newComment.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {comment.author.slice(0, 6)}...{comment.author.slice(-4)}
                </span>
                <span className="text-sm text-gray-500">
                  {comment.timestamp?.toDate()?.toLocaleDateString() ||
                    "Just now"}
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No comments yet</div>
        )}
      </div>
    </div>
  );
}
