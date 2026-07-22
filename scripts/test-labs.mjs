import fs from "fs";
import path from "path";
import matter from "gray-matter";

function walkMdxFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMdxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      results.push(fullPath);
    }
  }
  return results;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");
const dir = path.join(CONTENT_ROOT, "labs");

console.log("Looking in:", dir);
console.log("Directory exists:", fs.existsSync(dir));

const files = walkMdxFiles(dir);
console.log(`Total .mdx files found: ${files.length}`);

const published = [];
for (const filePath of files) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  const rawStatus = data.status || "published";
  const entryStatus = rawStatus === "completed" ? "published" : rawStatus;
  console.log(`${path.basename(filePath)} -> rawStatus: ${data.status || "(missing)"} -> normalized: ${entryStatus}`);
  if (entryStatus === "published") {
    published.push({ slug: data.slug || path.basename(filePath).replace(/\.mdx$/, ""), filePath });
  }
}

console.log(`\nTotal published: ${published.length}`);
published.forEach(p => console.log(`  ${p.slug} -> ${path.relative(CONTENT_ROOT, p.filePath)}`));
