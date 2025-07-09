"use client"

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import React from "react";


interface FileUploadProps {
    onSuccess: (res: any) => void
    onProgress?: (progress: number) => void
    fileType?: "image" | "video"
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null >(null);

    const validateFile = (file: File) => {
        if (fileType === "image" && !file.type.startsWith("image/")) {
            throw new Error("Invalid file type. Please upload an image.");
        }
        if (fileType === "video" && !file.type.startsWith("video/")) {
            throw new Error("Invalid file type. Please upload a video.");
        }
        return true;
    }

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
        const authRes = await fetch("/api/imagekit-auth");
        if (!authRes.ok) {
            throw new Error("Failed to fetch authentication data");
        }
        const auth = await authRes.json();

        const res = await upload({
            file,
            fileName: file.name,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY || "",
            signature: auth.signature,
            expire: auth.expire,
            token: auth.token,

            onProgress: (event) => {
                if (onProgress && event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onProgress(progress);
                }
            }
        })
        onSuccess(res);
    } catch (error) {
        console.error("Upload failed:", error);
    } finally {
        setUploading(false);
    }
}

    return (
        <>
            <input type="file" 
            accept ={fileType === "image" ? "image/*" : fileType === "video" ? "video/*" : "*/*"}
            onChange={handleFileChange}
            />
            {uploading && <span>Uploading...</span>}
        </>
    );
};

export default FileUpload;