import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogRoot = path.resolve(__dirname, "../src/content/blog");
const outputRoot = path.resolve(__dirname, "../public/images/blog-placeholders");

function wrapText(text, maxChars, maxLines) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;

    if (lines.length === maxLines) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === 0) {
    return [text];
  }

  const used = lines.join(" ");
  if (text.length > used.length) {
    const last = lines.length - 1;
    lines[last] = `${lines[last].replace(/[.,;:!?-]*$/, "")}...`;
  }

  return lines.slice(0, maxLines);
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function extractField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*"(.*)"$`, "m"));
  return match?.[1] ?? "";
}

function extractTags(frontmatter) {
  const lines = frontmatter.split("\n");
  const start = lines.findIndex((line) => line.trim() === "tags:");
  if (start === -1) {
    return [];
  }

  const tags = [];
  for (const line of lines.slice(start + 1)) {
    const match = line.match(/^\s*-\s+(.*)$/);
    if (!match) {
      break;
    }

    tags.push(match[1].trim());
  }

  return tags;
}

function renderPlaceholder({ title, description, tags }) {
  const titleLines = wrapText(title, 20, 3);
  const descriptionLines = wrapText(description, 42, 2);
  const safeTags = tags.slice(0, 3).map((tag) => escapeXml(tag.toUpperCase()));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1600" y2="900" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0F172A"/>
      <stop offset="1" stop-color="#16213A"/>
    </linearGradient>
    <radialGradient id="glow-left" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 160) rotate(20) scale(440 300)">
      <stop stop-color="#94A3FF" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#94A3FF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-right" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1270 740) rotate(-14) scale(520 320)">
      <stop stop-color="#C7D2FE" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#C7D2FE" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect x="52" y="52" width="1496" height="796" stroke="rgba(255,255,255,0.14)"/>
  <rect x="78" y="0" width="14" height="900" fill="rgba(148,163,255,0.35)"/>
  <circle cx="220" cy="160" r="260" fill="url(#glow-left)"/>
  <circle cx="1270" cy="740" r="320" fill="url(#glow-right)"/>
  <text x="170" y="172" fill="#A5B4FC" font-size="28" font-family="Public Sans, Inter, Arial, sans-serif" letter-spacing="0.24em">BLOG ENTRY</text>
  <text x="168" y="302" fill="#F8FAFC" font-size="100" font-family="Lora, Georgia, serif" font-weight="600">
    ${titleLines
      .map((line, index) => `<tspan x="168" dy="${index === 0 ? 0 : 112}">${escapeXml(line)}</tspan>`)
      .join("")}
  </text>
  <text x="174" y="676" fill="rgba(248,250,252,0.82)" font-size="34" font-family="Public Sans, Inter, Arial, sans-serif">
    ${descriptionLines
      .map((line, index) => `<tspan x="174" dy="${index === 0 ? 0 : 44}">${escapeXml(line)}</tspan>`)
      .join("")}
  </text>
  ${
    safeTags.length
      ? safeTags
          .map(
            (tag, index) => `
  <rect x="${174 + index * 196}" y="748" width="170" height="44" fill="rgba(248,250,252,0.08)"/>
  <text x="${259 + index * 196}" y="776" text-anchor="middle" fill="#C7D2FE" font-size="20" font-family="Public Sans, Inter, Arial, sans-serif" letter-spacing="0.08em">${tag}</text>`,
          )
          .join("")
      : ""
  }
  <text x="1428" y="796" text-anchor="end" fill="#E2E8F0" font-size="28" font-family="Public Sans, Inter, Arial, sans-serif" letter-spacing="0.18em">GROGU</text>
</svg>`;
}

async function main() {
  const entries = await fs.readdir(blogRoot, { withFileTypes: true });
  const created = [];

  await fs.mkdir(outputRoot, { recursive: true });
  const existingFiles = await fs.readdir(outputRoot);
  await Promise.all(
    existingFiles.map((file) => fs.rm(path.join(outputRoot, file), { force: true })),
  );

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const mdPath = path.join(blogRoot, entry.name, "index.md");
    const mdxPath = path.join(blogRoot, entry.name, "index.mdx");

    let sourcePath = "";
    try {
      await fs.access(mdPath);
      sourcePath = mdPath;
    } catch {
      try {
        await fs.access(mdxPath);
        sourcePath = mdxPath;
      } catch {
        continue;
      }
    }

    const source = await fs.readFile(sourcePath, "utf8");
    const match = source.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      continue;
    }

    const frontmatter = match[1];
    const title = extractField(frontmatter, "title") || entry.name;
    const description = extractField(frontmatter, "description") || "Grogu blog entry";
    const tags = extractTags(frontmatter);

    const outputPath = path.join(outputRoot, `hero-${entry.name}.png`);
    const svg = renderPlaceholder({ title, description, tags });
    const png = await sharp(Buffer.from(svg), { density: 144 }).png().toBuffer();
    await fs.writeFile(outputPath, png);
    created.push(path.relative(outputRoot, outputPath));
  }

  for (const item of created) {
    console.log(`created ${item}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
