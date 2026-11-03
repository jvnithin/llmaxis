export type Inline =
  | { type: "text"; text: string }
  | { type: "strong"; children: Inline[] }
  | { type: "link"; href: string; children: Inline[] };

export type GuideBlock =
  | { type: "heading"; level: 2 | 3 | 4; text: string; id: string }
  | { type: "paragraph"; children: Inline[] }
  | { type: "list"; items: Inline[][] }
  | { type: "table"; headers: Inline[][]; rows: Inline[][][] }
  | { type: "image"; src: string; alt: string };

export type GuideImage = {
  section: number;
  subsection: number;
  src: string;
  alt: string;
};

export type GuideTocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export type GuideDocument = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  blocks: GuideBlock[];
  toc: GuideTocItem[];
};

const HEADING = /^(#{1,6})\s+(.*)$/;
const TABLE_RULE = /^\s*-{3,}(?:\s+-{3,})+\s*$/;
const LIST_ITEM = /^(\s*)-\s+(.*)$/;

export function parseGuideMarkdown(source: string, images: GuideImage[] = []): GuideDocument {
  const lines = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const seoIndex = lines.findIndex((line) =>
    /^#{1,4}\s+(?:\*\*)?\s*(?:SEO\b|Internal linking plan\b)/i.test(line.trim()),
  );
  const seoLines = seoIndex >= 0 ? lines.slice(seoIndex + 1) : [];
  const articleLines = seoIndex >= 0 ? lines.slice(0, seoIndex) : lines;
  const titleLine = articleLines.find((line) => /^#\s+/.test(line)) ?? "";
  const title = plainHeading(titleLine.replace(/^#\s+/, ""));
  const firstSection = articleLines.findIndex((line) => /^##\s+/.test(line));
  const preamble = firstSection > 0 ? articleLines.slice(0, firstSection) : [];
  const metaTitle = metaField(preamble, "Meta title") || metaField(seoLines, "SEO title") || metaField(preamble, "SEO title") || title;
  const metaDescription = metaField(preamble, "Meta description") || metaField(seoLines, "Meta description");
  const body = firstSection >= 0 ? articleLines.slice(firstSection) : articleLines;
  const blocks = attachImages(parseBlocks(body), images);

  return {
    title,
    metaTitle,
    metaDescription,
    blocks,
    toc: blocks
      .filter((block): block is Extract<GuideBlock, { type: "heading" }> => block.type === "heading")
      .map((block) => ({ id: block.id, text: block.text, level: block.level })),
  };
}

function attachImages(blocks: GuideBlock[], images: GuideImage[]) {
  if (images.length === 0) return blocks;
  const numbered = images.filter((image) => image.section > 0);
  const loose = images.filter((image) => image.section === 0);
  return attachLooseImages(attachNumberedImages(blocks, numbered), loose);
}

function attachNumberedImages(blocks: GuideBlock[], images: GuideImage[]) {
  if (images.length === 0) return blocks;
  const pending = [...images].sort((a, b) => a.section - b.section || a.subsection - b.subsection);
  const next: GuideBlock[] = [];
  let section = 0;
  let subsection = 0;

  for (const block of blocks) {
    next.push(block);
    if (block.type !== "heading") continue;
    if (block.level === 2) {
      section = sectionNumber(block.text);
      subsection = 0;
      continue;
    }
    if (block.level === 3 && section > 0) {
      subsection += 1;
      const matches = pending.filter((image) => image.section === section && image.subsection === subsection);
      for (const image of matches) {
        next.push({ type: "image", src: image.src, alt: image.alt });
      }
    }
  }

  return next;
}

const LOOSE_STOP = new Set([
  "the", "and", "for", "with", "from", "your", "into", "that", "this", "are",
  "how", "what", "does", "you", "can", "its", "our", "their", "about", "than",
  "thumbnail", "infographic", "presentation", "titled", "graphic", "image",
]);

function looseTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 2 && !LOOSE_STOP.has(word));
}

function sameToken(left: string, right: string) {
  return left === right || `${left}s` === right || left === `${right}s`;
}

function tokenScore(left: string[], right: string[]) {
  let score = 0;
  for (const word of left) {
    if (right.some((other) => sameToken(word, other))) score += word.length >= 6 ? 2 : 1;
  }
  return score;
}

function attachLooseImages(blocks: GuideBlock[], images: GuideImage[]) {
  if (images.length === 0) return blocks;
  const headingIndexes = blocks.flatMap((block, index) => (block.type === "heading" ? [index] : []));
  const placed = new Map<number, GuideImage[]>();
  const unmatched: GuideImage[] = [];

  for (const image of images) {
    const imageTokens = looseTokens(image.alt);
    let bestIndex = -1;
    let bestScore = 0;
    for (const index of headingIndexes) {
      const heading = blocks[index];
      if (heading.type !== "heading") continue;
      const score = tokenScore(imageTokens, looseTokens(heading.text));
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
    if (bestIndex >= 0 && bestScore >= 2) {
      placed.set(bestIndex, [...(placed.get(bestIndex) ?? []), image]);
    } else {
      unmatched.push(image);
    }
  }

  const openSections = headingIndexes.filter((index) => {
    const heading = blocks[index];
    return heading.type === "heading" && heading.level === 2 && !placed.has(index);
  });
  unmatched.forEach((image, index) => {
    const slot = openSections.length
      ? openSections[Math.min(openSections.length - 1, Math.floor(((index + 0.5) * openSections.length) / unmatched.length))]
      : headingIndexes[headingIndexes.length - 1];
    if (slot === undefined) return;
    placed.set(slot, [...(placed.get(slot) ?? []), image]);
  });

  const next: GuideBlock[] = [];
  blocks.forEach((block, index) => {
    next.push(block);
    for (const image of placed.get(index) ?? []) {
      next.push({ type: "image", src: image.src, alt: image.alt });
    }
  });
  return next;
}

function sectionNumber(text: string) {
  const match = text.match(/^(\d+)\./);
  return match ? Number(match[1]) : 0;
}

function parseBlocks(lines: string[]) {
  const blocks: GuideBlock[] = [];
  const ids = new Map<string, number>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(HEADING);
    if (heading && heading[1].length >= 2 && heading[1].length <= 4) {
      const level = heading[1].length as 2 | 3 | 4;
      const text = plainHeading(heading[2]);
      blocks.push({ type: "heading", level, text, id: uniqueId(text, ids) });
      index += 1;
      continue;
    }

    if (TABLE_RULE.test(line)) {
      const table = readTable(lines, index);
      if (table.headers.length > 0) blocks.push(table.block);
      index = table.next;
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const list = readList(lines, index);
      blocks.push({ type: "list", items: list.items });
      index = list.next;
      continue;
    }

    const paragraph = readParagraph(lines, index);
    if (paragraph.next === index) {
      index += 1;
      continue;
    }
    if (paragraph.text.trim()) blocks.push({ type: "paragraph", children: parseInlines(paragraph.text) });
    index = paragraph.next;
  }

  return blocks;
}

function readParagraph(lines: string[], start: number) {
  const parts: string[] = [];
  let index = start;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim() || HEADING.test(line) || TABLE_RULE.test(line) || LIST_ITEM.test(line)) break;
    parts.push(line.trim());
    index += 1;
  }
  return { text: parts.join(" "), next: index };
}

function readList(lines: string[], start: number) {
  const items: Inline[][] = [];
  let index = start;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      const ahead = lines.slice(index + 1).find((entry) => entry.trim());
      if (ahead && LIST_ITEM.test(ahead)) {
        index += 1;
        continue;
      }
      break;
    }

    const item = line.match(LIST_ITEM);
    if (!item) break;
    const parts = [item[2].trim()];
    index += 1;
    while (index < lines.length && /^\s+\S/.test(lines[index]) && !LIST_ITEM.test(lines[index]) && !HEADING.test(lines[index])) {
      parts.push(lines[index].trim());
      index += 1;
    }
    items.push(parseInlines(parts.join(" ")));
  }

  return { items, next: index };
}

function readTable(lines: string[], start: number) {
  const spans = columnSpans(lines[start]);
  const content: string[] = [];
  let index = start + 1;
  while (index < lines.length && !TABLE_RULE.test(lines[index]) && !HEADING.test(lines[index])) {
    content.push(lines[index]);
    index += 1;
  }
  if (index < lines.length && TABLE_RULE.test(lines[index])) index += 1;

  const rows = tableRows(content, spans);
  const [header = [], ...body] = rows;
  return {
    block: {
      type: "table" as const,
      headers: header.map((cell) => parseInlines(cell)),
      rows: body.map((row) => row.map((cell) => parseInlines(cell))),
    },
    headers: header,
    next: index,
  };
}

function columnSpans(rule: string) {
  const spans: [number, number][] = [];
  const pattern = /-{3,}/g;
  const matches = [...rule.matchAll(pattern)];
  matches.forEach((match, index) => {
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? rule.length) : rule.length;
    spans.push([start, end]);
  });
  return spans;
}

function isContinuation(current: string[], cells: string[]) {
  const filled = cells.flatMap((cell, index) => (cell ? [index] : []));
  if (filled.length === 0) return false;
  const addsToExisting = filled.every((index) => current[index]?.trim());
  const leavesAGap = current.some((cell, index) => cell.trim() && !cells[index]);
  return addsToExisting && leavesAGap;
}

function tableRows(lines: string[], spans: [number, number][]) {
  const rows: string[][] = [];
  let current: string[] | null = null;

  const flush = () => {
    if (current && current.some((cell) => cell.trim())) rows.push(current.map((cell) => cell.replace(/\s+/g, " ").trim()));
    current = null;
  };

  for (const line of lines) {
    if (!line.trim()) {
      flush();
      continue;
    }
    const cells = spans.map(([start, end]) => (line.length <= start ? "" : line.slice(start, end).trim()));
    if (!cells.some((cell) => cell)) continue;
    if (current && isContinuation(current, cells)) {
      cells.forEach((cell, cellIndex) => {
        if (cell) current![cellIndex] = `${current![cellIndex]} ${cell}`.trim();
      });
      continue;
    }
    flush();
    current = cells;
  }
  flush();
  return rows;
}

function parseInlines(raw: string): Inline[] {
  const text = unescapePandoc(raw).replace(/\s+/g, " ").trim();
  if (!text) return [];
  return tokenize(text);
}

function tokenize(text: string): Inline[] {
  const nodes: Inline[] = [];
  let index = 0;
  let plain = "";

  const pushPlain = () => {
    if (!plain) return;
    nodes.push({ type: "text", text: applyDashes(plain) });
    plain = "";
  };

  while (index < text.length) {
    const link = readLink(text, index);
    if (link) {
      pushPlain();
      nodes.push({ type: "link", href: link.href, children: tokenize(link.label) });
      index = link.next;
      continue;
    }
    if (text.startsWith("**", index)) {
      const close = text.indexOf("**", index + 2);
      if (close > index + 2) {
        pushPlain();
        nodes.push({ type: "strong", children: tokenize(text.slice(index + 2, close)) });
        index = close + 2;
        continue;
      }
    }
    plain += text[index];
    index += 1;
  }
  pushPlain();
  return nodes;
}

function readLink(text: string, index: number) {
  if (!text.startsWith("[[", index)) return null;
  const labelEnd = text.indexOf("]{.underline}]", index + 2);
  if (labelEnd < 0 || text[labelEnd + "]{.underline}]".length] !== "(") return null;
  const hrefStart = labelEnd + "]{.underline}](".length;
  const hrefEnd = text.indexOf(")", hrefStart);
  if (hrefEnd < 0) return null;
  const href = text.slice(hrefStart, hrefEnd).trim();
  if (!/^https?:\/\//i.test(href)) return null;
  return { label: text.slice(index + 2, labelEnd).trim(), href, next: hrefEnd + 1 };
}

function unescapePandoc(value: string) {
  return value.replace(/\\([\\$'"\-])/g, "$1");
}

function applyDashes(value: string) {
  return value.replace(/---/g, "\u2014").replace(/--/g, "\u2013");
}

function plainHeading(value: string) {
  return applyDashes(unescapePandoc(value).replace(/\*\*/g, "")).replace(/\s+/g, " ").trim();
}

function uniqueId(text: string, ids: Map<string, number>) {
  const base = text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "section";
  const count = ids.get(base) ?? 0;
  ids.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function metaField(lines: string[], label: string) {
  const collected: string[] = [];
  let capturing = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const start = trimmed.match(new RegExp(`^\\*\\*${label}:\\*\\*\\s*(.*)$`, "i"));
    if (start) {
      capturing = true;
      if (start[1]) collected.push(start[1]);
      continue;
    }
    if (!capturing) continue;
    if (/^\*\*[^*]+:\*\*/.test(trimmed) || /^#{1,6}\s+/.test(trimmed)) break;
    if (trimmed) collected.push(trimmed);
  }
  return applyDashes(unescapePandoc(collected.join(" "))).replace(/\\/g, "").replace(/\s+/g, " ").trim();
}
