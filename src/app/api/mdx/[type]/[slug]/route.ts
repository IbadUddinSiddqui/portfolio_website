import { NextRequest, NextResponse } from "next/server";
import {
  getEntry,
  updateEntry,
  deleteEntry,
  duplicateEntry,
  validateEntry,
  ALL_CONTENT_TYPES,
  type ContentType,
} from "@/lib/mdx";

// ─── GET /api/mdx/[type]/[slug] ──────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params;

    if (!ALL_CONTENT_TYPES.includes(type as ContentType)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const entry = getEntry(type as ContentType, slug);
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Error getting MDX entry:", error);
    return NextResponse.json(
      { error: "Failed to get entry" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/mdx/[type]/[slug] ──────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params;

    if (!ALL_CONTENT_TYPES.includes(type as ContentType)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const body = await request.json();
    const { frontmatter, content, action } = body;

    // Duplicate action
    if (action === "duplicate") {
      const newSlug = body.newSlug || `${slug}-copy`;
      const entry = duplicateEntry(type as ContentType, slug, newSlug);
      if (!entry) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
      }
      return NextResponse.json({ entry });
    }

    // Validate
    const validation = validateEntry(
      type as ContentType,
      slug,
      frontmatter || {},
      content || ""
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation },
        { status: 422 }
      );
    }

    const entry = updateEntry(type as ContentType, slug, frontmatter || {}, content || "");
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ entry, warnings: validation.warnings });
  } catch (error) {
    console.error("Error updating MDX entry:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/mdx/[type]/[slug] ───────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params;

    if (!ALL_CONTENT_TYPES.includes(type as ContentType)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const deleted = deleteEntry(type as ContentType, slug);
    if (!deleted) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting MDX entry:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
