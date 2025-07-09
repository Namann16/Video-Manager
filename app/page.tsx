"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/Video`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      } else {
        console.error("Failed to load videos");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`/api/Video/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Video deleted ✅");
        setVideos((prev) => prev.filter((video) => video._id !== id));
      } else {
        alert("❌ Failed to delete video");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Error deleting video");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="bg-gray-900 shadow-sm sticky top-0 z-50">
        <nav className="flex items-center justify-between px-6 py-4 sm:px-20">
          <Link href="/">
            <span className="text-2xl font-bold text-blue-500 cursor-pointer">
              MyVideoApp
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Upload */}
            <Link href="/Upload">
              <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Upload
              </span>
            </Link>

            {/* Auth Button */}
            {status !== "loading" && (
              session ? (
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              ) : (
                <Link href="/login">
                  <span className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Login
                  </span>
                </Link>
              )
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-6 py-10 sm:px-20">
        <h1 className="text-3xl font-bold mb-6">Latest Videos</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos.map((video) => (
              <div
                key={video._id}
                className="rounded-lg shadow bg-gray-900"
              >
                <div 
                className="resize overflow-auto bg-black rounded-md border border-zinc-600"
                style={{ minWidth: "200px", minHeight: "150px", maxWidth: "100%", maxHeight: "80vh" }}
                >
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-md font-semibold truncate">{video.title}</h2>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
