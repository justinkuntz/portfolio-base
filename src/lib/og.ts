type OgImageInput = {
  title: string;
  description: string;
  eyebrow: string;
  siteName: string;
  tags?: string[];
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(text: string, maxChars: number, maxLines: number) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines) break;
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === 0) return [text];

  const remainingWords = words.join(" ");
  const usedWords = lines.join(" ");
  if (remainingWords.length > usedWords.length) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = `${lines[lastIndex].replace(/[.,;:!?-]*$/, "")}...`;
  }

  return lines.slice(0, maxLines);
}

export function renderOgImage({
  title,
  description,
  eyebrow,
  siteName,
  tags = [],
}: OgImageInput) {
  const titleLines = wrapText(title, 24, 3);
  const descriptionLines = wrapText(description, 56, 2);
  const safeTags = tags.slice(0, 3).map(escapeXml);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#101626"/>
      <stop offset="1" stop-color="#1B2336"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(180 120) rotate(18) scale(380 240)">
      <stop stop-color="#7F8FDA" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#7F8FDA" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(980 520) rotate(-12) scale(420 260)">
      <stop stop-color="#C7D2FF" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#C7D2FF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" rx="24" fill="url(#bg)"/>
  <rect x="28" y="28" width="1144" height="574" rx="20" stroke="rgba(247,249,253,0.14)"/>
  <circle cx="180" cy="120" r="260" fill="url(#glowA)"/>
  <circle cx="980" cy="520" r="280" fill="url(#glowB)"/>
  <rect x="86" y="84" width="12" height="462" fill="rgba(199,210,255,0.28)"/>
  <text x="128" y="142" fill="#A4AEC6" font-size="24" font-family="Lora, Georgia, serif" letter-spacing="0.24em">${escapeXml(eyebrow.toUpperCase())}</text>
  <text x="126" y="236" fill="#F7F9FD" font-size="74" font-family="Lora, Georgia, serif" font-weight="600">
    ${titleLines
      .map((line, index) => `<tspan x="126" dy="${index === 0 ? 0 : 88}">${escapeXml(line)}</tspan>`)
      .join("")}
  </text>
  <text x="130" y="494" fill="rgba(247,249,253,0.78)" font-size="28" font-family="Public Sans, Inter, Arial, sans-serif">
    ${descriptionLines
      .map((line, index) => `<tspan x="130" dy="${index === 0 ? 0 : 38}">${escapeXml(line)}</tspan>`)
      .join("")}
  </text>
  ${
    safeTags.length
      ? safeTags
          .map(
            (tag, index) => `
  <rect x="${130 + index * 176}" y="542" width="152" height="38" rx="19" fill="rgba(247,249,253,0.08)"/>
  <text x="${206 + index * 176}" y="567" text-anchor="middle" fill="#C7D2FF" font-size="18" font-family="Public Sans, Inter, Arial, sans-serif" letter-spacing="0.08em">${tag.toUpperCase()}</text>`,
          )
          .join("")
      : ""
  }
  <text x="1074" y="574" text-anchor="end" fill="#F7F9FD" font-size="26" font-family="Public Sans, Inter, Arial, sans-serif" letter-spacing="0.18em">${escapeXml(siteName.toUpperCase())}</text>
</svg>`;
}

