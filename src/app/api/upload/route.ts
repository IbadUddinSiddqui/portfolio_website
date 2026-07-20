import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, stat } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 1920; // Max width/height for optimization
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Generate unique filename (always use webp for optimized images)
    const isOptimizable = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    const ext = isOptimizable ? "webp" : (file.name.split(".").pop() || "jpg");
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filePath = path.join(UPLOAD_DIR, fileName);

    let width: number | null = null;
    let height: number | null = null;

    if (isOptimizable) {
      // Optimize with sharp
      const image = sharp(buffer);
      const metadata = await image.metadata();
      width = metadata.width ?? null;
      height = metadata.height ?? null;

      // Resize if larger than max dimension
      if ((metadata.width && metadata.width > MAX_DIMENSION) || (metadata.height && metadata.height > MAX_DIMENSION)) {
        const resized = image.resize({
          width: Math.min(metadata.width || MAX_DIMENSION, MAX_DIMENSION),
          height: Math.min(metadata.height || MAX_DIMENSION, MAX_DIMENSION),
          fit: "inside",
          withoutEnlargement: true,
        });
        await resized.webp({ quality: 85, effort: 4 }).toFile(filePath);
      } else {
        // Just convert to WebP at original size
        await image.webp({ quality: 85, effort: 4 }).toFile(filePath);
      }
    } else {
      // Write non-optimizable files (GIF, SVG) as-is
      await writeFile(filePath, buffer);
    }

    const url = `/uploads/${fileName}`;
    const fileStat = await stat(filePath).catch(() => null);

    return NextResponse.json({
      success: true,
      file: {
        name: fileName,
        originalName: file.name,
        url,
        size: fileStat?.size ?? file.size,
        type: isOptimizable ? "image/webp" : file.type,
        width,
        height,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
