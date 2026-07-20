import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/media — List all media
 */
export async function GET() {
  try {
    const media = await db.media.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(media);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

/**
 * POST /api/media — Create a new media record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, filename, type, mimeType, size, width, height, alt } = body;

    if (!url || !filename) {
      return NextResponse.json({ error: "url and filename are required" }, { status: 400 });
    }

    const media = await db.media.create({
      data: {
        url,
        filename,
        type: type || "image",
        mimeType: mimeType || null,
        size: size || null,
        width: width || null,
        height: height || null,
        alt: alt || null,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Failed to create media:", error);
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
  }
}
