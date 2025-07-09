"use client";

import FileUpload from "@/app/components/FileUpload";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleVideoSuccess = (res: any) =>
    setForm((f) => ({ ...f, videoUrl: res.url }));
  const handleThumbnailSuccess = (res: any) =>
    setForm((f) => ({ ...f, thumbnailUrl: res.url }));

  const handleSubmit = async () => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.title || !form.description || !form.videoUrl || !form.thumbnailUrl) {
      setErrorMsg("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(form);
      setSuccessMsg("✅ Video uploaded successfully!");
      setForm({ title: "", description: "", videoUrl: "", thumbnailUrl: "" });

      // Redirect after 1.5s
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <div>
        <label className="block mb-1 font-semibold">Title</label>
        <input
          type="text"
          placeholder="Enter video title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          placeholder="Enter a short description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Upload Thumbnail</label>
        <FileUpload onSuccess={handleThumbnailSuccess} fileType="image" />
        {form.thumbnailUrl && (
          <div className="mt-2">
            <img
              src={form.thumbnailUrl}
              alt="Thumbnail preview"
              className="w-32 h-20 rounded object-cover border"
            />
            <p className="text-green-600 text-sm mt-1">Thumbnail uploaded ✅</p>
          </div>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">Upload Video</label>
        <FileUpload onSuccess={handleVideoSuccess} fileType="video" />
        {form.videoUrl && (
          <p className="text-green-600 text-sm mt-1">Video uploaded ✅</p>
        )}
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" /> <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" /> <span>{errorMsg}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin w-5 h-5" />}
        {loading ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
}
