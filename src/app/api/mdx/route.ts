import { NextRequest, NextResponse } from "next/server";
import {
  getEntry,
  listEntries,
  createEntry,
  searchEntries,
  validateEntry,
  generateSlug,
  ALL_CONTENT_TYPES,
  type ContentType,
} from "@/lib/mdx";

// ─── GET /api/mdx ────────────────────────────────────
// Query params: type, status, search, slug

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as ContentType | null;
    const status = searchParams.get("status") as "draft" | "published" | "archived" | null;
    const search = searchParams.get("search");
    const slug = searchParams.get("slug");

    // If slug is provided, search for a specific entry
    if (slug && type) {
      const entry = getEntry(type, slug);
      if (!entry) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
      }
      return NextResponse.json({ entry });
    }

    // Search mode
    if (search) {
      const types = type ? [type] : undefined;
      const results = searchEntries(search, types);
      return NextResponse.json({
        results,
        total: results.length,
      });
    }

    // List mode
    const entries = listEntries(type || undefined, status || undefined);

    return NextResponse.json({
      entries,
      total: entries.length,
      types: ALL_CONTENT_TYPES,
    });
  } catch (error) {
    console.error("Error listing MDX entries:", error);
    return NextResponse.json(
      { error: "Failed to list entries" },
      { status: 500 }
    );
  }
}

// ─── POST /api/mdx ───────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, frontmatter, content } = body;

    if (!type || !ALL_CONTENT_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid content type. Must be one of: " + ALL_CONTENT_TYPES.join(", ") },
        { status: 400 }
      );
    }

    if (!frontmatter?.title?.trim()) {
      return NextResponse.json(
        { error: "Title is required in frontmatter" },
        { status: 400 }
      );
    }

    const slug = frontmatter.slug || generateSlug(frontmatter.title);

    // Check if slug already exists
    const existing = getEntry(type, slug);
    if (existing) {
      return NextResponse.json(
        { error: `An entry with slug "${slug}" already exists in ${type}` },
        { status: 409 }
      );
    }

    // Validate
    const validation = validateEntry(type, slug, frontmatter, content || "");
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation },
        { status: 422 }
      );
    }

    const entry = createEntry(type, slug, frontmatter, content || "");

    return NextResponse.json({ entry, warnings: validation.warnings }, { status: 201 });
  } catch (error) {
    console.error("Error creating MDX entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}
