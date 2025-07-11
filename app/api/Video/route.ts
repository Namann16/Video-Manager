export const dynamic = "force-dynamic";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/videos.models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find().sort({ createdAt: -1 });
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const deleted = await Video.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const { title, description, videoUrl, thumbnailUrl } = body;

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      uploadedBy: session.user?.email,
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("POST /api/video error:", error);
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
  }
}