"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";

interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: any;
  likes: string[];
  isRepost?: boolean;
  originalAuthor?: string;
}

export default function ProfilePage(): JSX.Element {
  const params = useParams();
  const userAddress = params.address as string;
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [sharedPosts, setSharedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInteractions = async () => {
      if (!userAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch all posts that the user has written (including old posts)
        const userPostsQuery = query(
          collection(db, "posts"),
          where("author", "==", userAddress)
        );
        const userPostsSnapshot = await getDocs(userPostsQuery);
        const allUserPosts = userPostsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Post
        );

        // Separate regular posts and reposts
        setUserPosts(allUserPosts.filter((post) => !post.isRepost));
        setSharedPosts(allUserPosts.filter((post) => post.isRepost));

        // Fetch posts that the user has liked
        const likedPostsQuery = query(
          collection(db, "posts"),
          where("likes", "array-contains", userAddress)
        );
        const likedPostsSnapshot = await getDocs(likedPostsQuery);
        const likedPostsData = likedPostsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Post
        );
        setLikedPosts(likedPostsData);
      } catch (error) {
        console.error("Error fetching user interactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInteractions();
  }, [userAddress]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <p className="text-gray-600">
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Posts</h3>
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div key={post.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    Posted on {post.timestamp?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p>{post.content}</p>
              </div>
            ))}
            {userPosts.length === 0 && (
              <p className="text-gray-500">No posts yet</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Liked Posts</h3>
          <div className="space-y-4">
            {likedPosts.map((post) => (
              <div key={post.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    Posted by {post.author.slice(0, 6)}...
                    {post.author.slice(-4)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.timestamp?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p>{post.content}</p>
              </div>
            ))}
            {likedPosts.length === 0 && (
              <p className="text-gray-500">No liked posts yet</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Shared Posts</h3>
          <div className="space-y-4">
            {sharedPosts.map((post) => (
              <div key={post.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    Original by {post.originalAuthor?.slice(0, 6)}...
                    {post.originalAuthor?.slice(-4)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.timestamp?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p>{post.content}</p>
              </div>
            ))}
            {sharedPosts.length === 0 && (
              <p className="text-gray-500">No shared posts yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
