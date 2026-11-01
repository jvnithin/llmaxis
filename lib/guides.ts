import fs from "fs";
import path from "path";
import { parseGuideMarkdown, type GuideDocument, type GuideImage } from "@/lib/guideMarkdown";

const GUIDE_FILES = [
  {
    slug: "machine-learning-engineer-roadmap-usa",
    cardId: "machine-learning-engineer-roadmap-2026",
    file: "machine-learning-engineer-roadmap-usa.md",
    imageDir: "Machine Learning Engineering RoadMap",
  },
] as const;

export function guideSlugs() {
  return GUIDE_FILES.map((guide) => guide.slug);
}

export function getGuide(slug: string): GuideDocument | null {
  const guide = GUIDE_FILES.find((entry) => entry.slug === slug);
  if (!guide) return null;
  const filePath = path.join(process.cwd(), "content", "guides", guide.file);
  const source = fs.readFileSync(filePath, "utf8");
  return parseGuideMarkdown(source, guideImages(guide.imageDir));
}

function guideImages(imageDir: string): GuideImage[] {
  const directory = path.join(process.cwd(), "public", "thumbnails", imageDir);
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .flatMap((fileName) => {
      const match = fileName.match(/^(\d+)-(\d+)\s+(.+)\.(png|jpe?g|webp)$/i);
      if (!match) return [];
      const alt = match[3].replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
      return [
        {
          section: Number(match[1]),
          subsection: Number(match[2]),
          src: `/thumbnails/${imageDir}/${fileName}`,
          alt,
        },
      ];
    })
    .sort((a, b) => a.section - b.section || a.subsection - b.subsection);
}
