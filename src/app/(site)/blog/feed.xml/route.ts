import { db } from "@/lib/db";
import { siteConfig } from "@/lib/constants";
import { parseJsonArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * RSS Feed Route
 *
 * Generates a valid RSS 2.0 XML feed of published blog posts.
 * Served at /blog/feed.xml
 */
export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const items = posts
      .map((post) => {
        const tags = parseJsonArray<string>(post.tags);
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>${
        tags.length > 0
          ? tags.map((tag) => `\n      <category>${escapeXml(tag)}</category>`).join("")
          : ""
      }
    </item>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)} Blog</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("❌ RSS feed generation failed:", error);
    return new Response(
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?><rss version=\"2.0\"><channel><title>Blog Feed</title><description>Feed temporarily unavailable</description></channel></rss>",
      {
        status: 200,
        headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
      }
    );
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
