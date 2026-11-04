import fs from "fs";
import path from "path";
import type { BlogFilter, BlogGuide } from "@/components/blogs/data";
import { parseGuideMarkdown, type GuideDocument, type GuideImage } from "@/lib/guideMarkdown";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");
const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const THUMBNAILS_DIR = path.join(process.cwd(), "public", "thumbnails");
const ARTICLE_IMAGES_DIR = path.join(process.cwd(), "public", "articleImages");
const ARTICLE_THUMBNAILS_DIR = path.join(ARTICLE_IMAGES_DIR, "thumbnails");

const FOLDER_HINTS: { test: RegExp; folder: string }[] = [
  { test: /machine learning engineer/i, folder: "Machine Learning Engineering RoadMap" },
  { test: /generative ai/i, folder: "Generative AI" },
  { test: /agentic/i, folder: "Agentic AI" },
  { test: /llm engineer/i, folder: "LLM Engineer" },
  { test: /forward deployed/i, folder: "Forward Deployment" },
  { test: /automation/i, folder: "AI Automation" },
  { test: /research/i, folder: "AI Research" },
  { test: /data engineer/i, folder: "AI Data" },
  { test: /data analyst/i, folder: "Data Analyst" },
  { test: /software engineer/i, folder: "Software Engineer" },
  { test: /business analyst/i, folder: "Business Analyst" },
  { test: /qa|testing/i, folder: "OA Tester" },
  { test: /student|graduate/i, folder: "AI Career" },
];

const ARTICLE_FOLDER_HINTS: { test: RegExp; folder: string }[] = [
  { test: /skills employers actually want/i, folder: "AI jobs in the USA  Skills Employers Actually Want" },
  { test: /highest-paying|highest paying/i, folder: "Highest-Paying AI Jobs in the USA in 2027" },
  { test: /job market growing/i, folder: "Is the AI Job Market Growing in the USA" },
  { test: /top 10 ai jobs|top ai jobs/i, folder: "Top 10 AI Jobs in the USA in 2027" },
  { test: /companies are hiring|hiring ai engineers/i, folder: "Which US Companies Are Hiring AI Engineers" },
  { test: /good career choice|career choice in the usa/i, folder: "AI career choice in the USA 2027" },
  { test: /non-it|non it professionals/i, folder: "Can Non-IT Professionals Get Jobs in AI" },
  { test: /mba graduate/i, folder: "AI Careers for MBA Graduates" },
  { test: /finance professional/i, folder: "AI Jobs for Finance Professionals" },
  { test: /marketing professional/i, folder: "AI Jobs for Marketing Professionals" },
  { test: /healthcare/i, folder: "AI Jobs in Healthcare for Non-Technical Professionals" },
  { test: /traditional office jobs/i, folder: "How AI Is Changing Traditional Office Jobs" },
  { test: /ai product manager/i, folder: "What Does an AI Product Manager Do" },
  { test: /agents vs\.?\s*chatbots|ai agents vs/i, folder: "AI Agents vs. Chatbots What's the Difference" },
  { test: /fine-tuning vs|fine tuning vs/i, folder: "Fine-Tuning vs. RAG What's the Difference" },
  { test: /generative ai vs\.?\s*agentic/i, folder: "Generative AI vs. Agentic AI" },
  { test: /agents used in enterprise/i, folder: "How Are AI Agents Used in Enterprise Businesses" },
  { test: /agents make decisions/i, folder: "How Do AI Agents Make Decisions" },
  { test: /large language models|\bllms?\b/i, folder: "What Are Large Language Models (LLMs)" },
  { test: /what is agentic ai|agentic ai and how does it work/i, folder: "What Is Agentic AI and How Does It Work" },
  { test: /hallucination/i, folder: "What Is AI Hallucination and Why Does It Happen" },
  { test: /context engineering/i, folder: "What Is Context Engineering" },
  { test: /what is generative ai/i, folder: "What Is Generative AI Real-World Applications Explained" },
  { test: /model context protocol|\bmcp\b/i, folder: "What Is Model Context Protocol (MCP)" },
  { test: /multi-agent ai|multi agent ai/i, folder: "What Is Multi-Agent AI" },
  { test: /prompt engineering/i, folder: "What Is Prompt Engineering" },
  { test: /retrieval-augmented|\brag\b/i, folder: "What Is Retrieval-Augmented Generation (RAG)" },
  { test: /40 interview questions|interview questions asked by us/i, folder: "AI Engineer Interview Questions Asked by US Companies" },
  { test: /agentic ai engineer interview/i, folder: "Agentic AI Engineer Interview Questions" },
  { test: /generative ai engineer interview/i, folder: "Generative AI Engineer Interview Questions" },
  { test: /build an ai portfolio/i, folder: "How to Build an AI Portfolio That Gets Recruiters' Attention" },
  { test: /explain ai projects/i, folder: "How to Explain AI Projects in a Job Interview" },
  { test: /ai engineer resume/i, folder: "How to Write an AI Engineer Resume for US Jobs" },
  { test: /employers look for in ai portfolio/i, folder: "What Do US Employers Look for in AI Portfolios" },
  { test: /candidates get rejected/i, folder: "Why AI Candidates Get Rejected in Technical Interviews" },
  { test: /f-1 students|career opportunities for f-1/i, folder: "AI Career Opportunities for F-1 Students" },
  { test: /cpt and opt|cpt\/opt/i, folder: "AI Jobs in the USA CPT and OPT Considerations" },
  { test: /best ai certification/i, folder: "Best AI Certifications Recognised by US Employers" },
  { test: /stem opt/i, folder: "Can AI Students Qualify for STEM OPT" },
  { test: /international students get ai jobs/i, folder: "Can International Students Get AI Jobs in the USA" },
  { test: /certification worth it/i, folder: "Is an AI Certification Worth It in the USA" },
  { test: /master.?s in ai vs|industry projects/i, folder: "Master's in AI vs. Learning AI Through Industry Projects" },
  { test: /international students choose ai/i, folder: "Should International Students Choose AI as a Career" },
];

const COVER_HINTS: { test: RegExp; cover: RegExp }[] = [
  { test: /machine learning engineer/i, cover: /machine learning engineer roadmap/i },
  { test: /generative ai/i, cover: /^generative ai/i },
  { test: /agentic/i, cover: /agentic/i },
  { test: /llm engineer/i, cover: /llm engineer/i },
  { test: /forward deployed/i, cover: /forward deployed/i },
  { test: /automation/i, cover: /automation/i },
  { test: /research/i, cover: /research scientist/i },
  { test: /data engineer/i, cover: /ai data engineer/i },
  { test: /data analyst/i, cover: /data analyst/i },
  { test: /software engineer/i, cover: /software engineer/i },
  { test: /business analyst/i, cover: /business analyst/i },
  { test: /qa|testing/i, cover: /qa tester/i },
  { test: /student|graduate/i, cover: /graduates/i },
];

const ARTICLE_COVER_HINTS: { test: RegExp; cover: RegExp }[] = [
  { test: /skills employers actually want/i, cover: /skills employers actually want/i },
  { test: /highest-paying|highest paying/i, cover: /highest-paying ai jobs/i },
  { test: /job market growing/i, cover: /ai engineer hiring/i },
  { test: /top 10 ai jobs|top ai jobs/i, cover: /top 10 ai jobs/i },
  { test: /companies are hiring|hiring ai engineers/i, cover: /which us companies are hiring/i },
  { test: /good career choice|career choice in the usa/i, cover: /ai career choice in the usa/i },
  { test: /non-it|non it/i, cover: /from non-it to ai career/i },
  { test: /mba graduate/i, cover: /mba graduates/i },
  { test: /finance professional/i, cover: /finance professionals/i },
  { test: /marketing professional/i, cover: /marketing careers/i },
  { test: /healthcare/i, cover: /healthcare/i },
  { test: /traditional office jobs/i, cover: /office jobs/i },
  { test: /ai product manager/i, cover: /product manager/i },
  { test: /agents vs\.?\s*chatbots|ai agents vs/i, cover: /agents vs\.? chatbots/i },
  { test: /fine-tuning vs|fine tuning vs/i, cover: /fine-tuning vs\.? rag/i },
  { test: /generative ai vs\.?\s*agentic/i, cover: /generative ai vs\.? agentic/i },
  { test: /agents used in enterprise/i, cover: /agents in enterprise/i },
  { test: /agents make decisions/i, cover: /agents make decisions/i },
  { test: /large language models/i, cover: /large language models/i },
  { test: /what is agentic ai|agentic ai and how does it work/i, cover: /what is agentic ai/i },
  { test: /hallucination/i, cover: /hallucination/i },
  { test: /context engineering/i, cover: /context engineering/i },
  { test: /what is generative ai/i, cover: /generative ai applications/i },
  { test: /model context protocol|\bmcp\b/i, cover: /model context protocol/i },
  { test: /multi-agent ai|multi agent ai/i, cover: /multi-agent ai/i },
  { test: /prompt engineering/i, cover: /prompt engineering/i },
  { test: /retrieval-augmented generation|\brag\b/i, cover: /retrieval-augmented generation/i },
  { test: /40 interview questions|interview questions asked by us/i, cover: /ai engineer interview questions/i },
  { test: /agentic ai engineer interview/i, cover: /agentic ai engineer interview/i },
  { test: /generative ai engineer interview/i, cover: /generative ai engineer interview/i },
  { test: /build an ai portfolio/i, cover: /portfolio that gets attention/i },
  { test: /explain ai projects/i, cover: /explaining ai projects/i },
  { test: /ai engineer resume/i, cover: /ai engineer resume/i },
  { test: /employers look for in ai portfolio/i, cover: /employers seek in ai portfolios|value ai/i },
  { test: /candidates get rejected/i, cover: /candidates get rejected/i },
  { test: /f-1 students|career opportunities for f-1/i, cover: /f-1 students/i },
  { test: /cpt and opt|cpt\/opt/i, cover: /cpt and opt/i },
  { test: /best ai certification/i, cover: /certifications recognized|certifications recognised/i },
  { test: /stem opt/i, cover: /stem opt/i },
  { test: /international students get ai jobs/i, cover: /international students get ai jobs/i },
  { test: /certification worth it/i, cover: /value ai certifications|certification/i },
  { test: /master.?s in ai vs|industry projects/i, cover: /master.?s in ai vs/i },
  { test: /international students choose ai/i, cover: /careers for international students/i },
];

const TOPIC_RULES: { test: RegExp; topic: BlogFilter }[] = [
  { test: /agentic/i, topic: "Agentic AI" },
  { test: /generative/i, topic: "Generative AI" },
  { test: /\bllm\b/i, topic: "Generative AI" },
  { test: /machine learning/i, topic: "Machine Learning" },
  { test: /forward deployed/i, topic: "Forward Deployed Engineering (FDA)" },
  { test: /automation/i, topic: "AI Automation" },
  { test: /data engineer|data analyst/i, topic: "Data Engineering" },
  { test: /research/i, topic: "AI Research" },
  { test: /\bfrom\b|student|graduate|business analyst|qa|testing|software engineer|non-it|career|job market|hiring|salaries|skills employers/i, topic: "Career Transitions" },
];

const CARD_ORDER = [
  /machine learning/i,
  /generative/i,
  /agentic/i,
  /llm engineer/i,
  /forward deployed/i,
  /automation/i,
  /data engineer/i,
  /research/i,
  /software engineer/i,
  /student|graduate/i,
  /business analyst/i,
  /qa|testing/i,
  /data analyst/i,
];

type ContentKind = "roadmap" | "article";

type ArticleFile = {
  slug: string;
  title: string;
  metaDescription: string;
  source: string;
  kind: ContentKind;
  category: string;
  categoryOrder: number;
};

export function guideSlugs() {
  return contentFiles().map((article) => article.slug);
}

export function getArticleCategories() {
  const byCategory = new Map<string, number>();
  for (const article of contentFiles()) {
    if (article.kind !== "article" || !article.category) continue;
    const current = byCategory.get(article.category);
    if (current === undefined || article.categoryOrder < current) {
      byCategory.set(article.category, article.categoryOrder);
    }
  }
  return [...byCategory.entries()]
    .sort((left, right) => left[1] - right[1] || left[0].localeCompare(right[0]))
    .map(([category]) => category);
}

export function getGuide(slug: string): GuideDocument | null {
  const article = contentFiles().find((entry) => entry.slug === slug);
  if (!article) return null;

  if (article.kind === "article") {
    const folders = assignByHint(articleOnly(), articleImageFolders(), ARTICLE_FOLDER_HINTS);
    const imageDir = folders.get(article.slug) ?? "";
    return parseGuideMarkdown(article.source, imageDir ? articleBodyImages(imageDir) : []);
  }

  const folders = assignByHint(roadmapOnly(), thumbnailFolders(), FOLDER_HINTS);
  const imageDir = folders.get(article.slug) ?? "";
  return parseGuideMarkdown(article.source, imageDir ? guideImages(imageDir) : []);
}

export function getBlogGuides(): BlogGuide[] {
  const articles = contentFiles();
  const roadmapCovers = assignCovers(roadmapOnly(), coverFiles(), COVER_HINTS, "/thumbnails");
  const articleCovers = assignCovers(
    articleOnly(),
    articleCoverFiles(),
    ARTICLE_COVER_HINTS,
    "/articleImages/thumbnails",
  );
  const roadmapFolders = assignByHint(roadmapOnly(), thumbnailFolders(), FOLDER_HINTS);
  const articleFolders = assignByHint(articleOnly(), articleImageFolders(), ARTICLE_FOLDER_HINTS);

  const orderBySlug = new Map(articles.map((article) => [article.slug, article.categoryOrder]));

  return articles
    .map((article) => {
      const isArticle = article.kind === "article";
      const imageDir = (isArticle ? articleFolders : roadmapFolders).get(article.slug) ?? "";
      const images = imageDir
        ? isArticle
          ? articleBodyImages(imageDir)
          : guideImages(imageDir)
        : [];
      const cover =
        (isArticle ? articleCovers : roadmapCovers).get(article.slug) || images[0]?.src || "";
      const copy = cardCopy(article.title, article.metaDescription);
      return {
        id: article.slug,
        title: copy.title,
        subtitle: copy.subtitle,
        image: cover,
        topics: topicsFor(article.title),
        kind: article.kind,
        category: article.category || undefined,
        href: `/blogs/${article.slug}`,
      };
    })
    .sort((left, right) => {
      if (left.kind !== right.kind) return left.kind === "roadmap" ? -1 : 1;
      if (left.kind === "article") {
        const leftOrder = orderBySlug.get(left.id) ?? 999;
        const rightOrder = orderBySlug.get(right.id) ?? 999;
        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        const categoryCompare = (left.category ?? "").localeCompare(right.category ?? "");
        if (categoryCompare !== 0) return categoryCompare;
      }
      return cardRank(left.title) - cardRank(right.title) || left.title.localeCompare(right.title);
    });
}

function contentFiles(): ArticleFile[] {
  return [...readMarkdownDir(GUIDES_DIR, "roadmap"), ...readMarkdownDir(ARTICLES_DIR, "article")];
}

function roadmapOnly() {
  return contentFiles().filter((article) => article.kind === "roadmap");
}

function articleOnly() {
  return contentFiles().filter((article) => article.kind === "article");
}

function readMarkdownDir(directory: string, fallbackKind: ContentKind): ArticleFile[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const raw = fs.readFileSync(path.join(directory, fileName), "utf8");
      const { source, kind, category, categoryOrder } = splitFrontmatter(raw, fallbackKind);
      const guide = parseGuideMarkdown(source);
      return {
        slug: fileName.replace(/\.md$/i, ""),
        title: guide.title,
        metaDescription: guide.metaDescription || preambleExcerpt(source),
        source,
        kind,
        category: stripCategoryNumber(category),
        categoryOrder,
      };
    });
}

function splitFrontmatter(raw: string, fallbackKind: ContentKind) {
  const text = raw.replace(/^\uFEFF/, "");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { source: text, kind: fallbackKind, category: "", categoryOrder: 999 };
  }

  const meta = match[1];
  const kindMatch = meta.match(/^kind:\s*(\w+)\s*$/m);
  const categoryMatch = meta.match(/^category:\s*(.+)\s*$/m);
  const orderMatch = meta.match(/^categoryOrder:\s*(\d+)\s*$/m);
  const kind = kindMatch?.[1] === "article" || kindMatch?.[1] === "roadmap" ? kindMatch[1] : fallbackKind;
  let category = "";
  if (categoryMatch) {
    try {
      category = JSON.parse(categoryMatch[1].trim());
    } catch {
      category = categoryMatch[1].trim().replace(/^["']|["']$/g, "");
    }
  }
  const inferredOrder = category.match(/^(\d+)\.\s*/);
  const categoryOrder = orderMatch
    ? Number(orderMatch[1])
    : inferredOrder
      ? Number(inferredOrder[1])
      : 999;

  return {
    source: text.slice(match[0].length),
    kind,
    category,
    categoryOrder,
  };
}

function stripCategoryNumber(value: string) {
  return value.replace(/^\d+\.\s*/, "").trim();
}

function thumbnailFolders() {
  if (!fs.existsSync(THUMBNAILS_DIR)) return [];
  return fs
    .readdirSync(THUMBNAILS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function articleImageFolders() {
  if (!fs.existsSync(ARTICLE_IMAGES_DIR)) return [];
  return fs
    .readdirSync(ARTICLE_IMAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "thumbnails")
    .map((entry) => entry.name);
}

function coverFiles() {
  if (!fs.existsSync(THUMBNAILS_DIR)) return [];
  return fs.readdirSync(THUMBNAILS_DIR).filter((fileName) => isImage(fileName));
}

function articleCoverFiles() {
  if (!fs.existsSync(ARTICLE_THUMBNAILS_DIR)) return [];
  return fs.readdirSync(ARTICLE_THUMBNAILS_DIR).filter((fileName) => isImage(fileName));
}

function assignByHint(
  articles: ArticleFile[],
  available: string[],
  hints: { test: RegExp; folder: string }[],
) {
  const assigned = new Map<string, string>();
  const used = new Set<string>();
  for (const article of articles) {
    const hint = hints.find(
      (entry) => entry.test.test(article.title) && available.includes(entry.folder) && !used.has(entry.folder),
    );
    if (!hint) continue;
    assigned.set(article.slug, hint.folder);
    used.add(hint.folder);
  }

  const remainingArticles = articles.filter((article) => !assigned.has(article.slug));
  const remainingFolders = available.filter((folder) => !used.has(folder));
  for (const [slug, folder] of assignByScore(remainingArticles, remainingFolders)) {
    assigned.set(slug, folder);
  }
  return assigned;
}

function assignCovers(
  articles: ArticleFile[],
  covers: string[],
  hints: { test: RegExp; cover: RegExp }[],
  publicPrefix: string,
) {
  const assigned = new Map<string, string>();
  const used = new Set<string>();
  for (const article of articles) {
    const hint = hints.find((entry) => entry.test.test(article.title));
    const fileName = hint
      ? covers.find((cover) => !used.has(cover) && hint.cover.test(cover.replace(/\.[^.]+$/, "")))
      : undefined;
    if (!fileName) continue;
    assigned.set(article.slug, `${publicPrefix}/${fileName}`);
    used.add(fileName);
  }

  const remainingArticles = articles.filter((article) => !assigned.has(article.slug));
  const remainingCovers = covers.filter((cover) => !used.has(cover));
  for (const [slug, fileName] of assignByScore(remainingArticles, remainingCovers)) {
    assigned.set(slug, `${publicPrefix}/${fileName}`);
  }
  return assigned;
}

function assignByScore(articles: ArticleFile[], candidates: string[]) {
  const pairs = articles.flatMap((article) =>
    candidates.map((candidate) => ({
      slug: article.slug,
      candidate,
      score: matchScore(article.title, candidate),
    })),
  );
  pairs.sort((left, right) => right.score - left.score);
  const usedArticles = new Set<string>();
  const usedCandidates = new Set<string>();
  const assigned = new Map<string, string>();
  for (const pair of pairs) {
    if (pair.score <= 0 || usedArticles.has(pair.slug) || usedCandidates.has(pair.candidate)) continue;
    assigned.set(pair.slug, pair.candidate);
    usedArticles.add(pair.slug);
    usedCandidates.add(pair.candidate);
  }
  return assigned;
}

const SCORE_STOP = new Set([
  "roadmap",
  "skills",
  "skill",
  "salary",
  "salaries",
  "projects",
  "project",
  "opportunities",
  "opportunity",
  "usa",
  "and",
  "the",
  "for",
  "from",
  "with",
  "how",
  "your",
  "into",
  "practical",
  "guide",
  "about",
]);

const SYNONYM_GROUPS = [
  ["qa", "testing", "tester", "oa"],
  ["student", "students", "graduate", "graduates"],
  ["deployed", "deployment"],
  ["non", "nonit"],
];

function matchScore(title: string, candidate: string) {
  const titleWords = new Set(words(title).flatMap(expandWord));
  const candidateWords = words(candidate.replace(/\.[^.]+$/, ""));
  if (candidateWords.length === 0 || titleWords.size === 0) return 0;
  let score = 0;
  let hits = 0;
  for (const word of candidateWords) {
    if (!expandWord(word).some((entry) => titleWords.has(entry))) continue;
    hits += 1;
    score += word.length >= 7 ? 4 : word.length >= 5 ? 3 : 2;
  }
  if (hits === 0) return 0;
  const titleText = words(title).join(" ");
  const candidateText = candidateWords.join(" ");
  if (titleText.includes(candidateText) || candidateText.includes(titleText)) score += 8;
  return score + hits / candidateWords.length;
}

function words(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 1 && !SCORE_STOP.has(word) && !/^\d+$/.test(word));
}

function expandWord(word: string) {
  const group = SYNONYM_GROUPS.find((entry) => entry.includes(word));
  return group ?? [word];
}

function guideImages(imageDir: string): GuideImage[] {
  const directory = imageDirectory(THUMBNAILS_DIR, imageDir);
  if (!directory) return [];
  const folderPath = directory === path.join(THUMBNAILS_DIR, imageDir) ? imageDir : `${imageDir}/images`;
  return listImages(directory, `/thumbnails/${folderPath}`);
}

function articleBodyImages(imageDir: string): GuideImage[] {
  const directory = path.join(ARTICLE_IMAGES_DIR, imageDir);
  if (!fs.existsSync(directory)) return [];
  return listImages(directory, `/articleImages/${imageDir}`);
}

function listImages(directory: string, publicPrefix: string): GuideImage[] {
  return fs
    .readdirSync(directory)
    .flatMap((fileName) => {
      if (!isImage(fileName)) return [];
      const numbered = fileName.match(/^(\d+)-(\d+)\s+(.+)\.(png|jpe?g|webp)$/i);
      return [
        {
          section: numbered ? Number(numbered[1]) : 0,
          subsection: numbered ? Number(numbered[2]) : 0,
          src: `${publicPrefix}/${fileName}`,
          alt: imageAlt(numbered?.[3] ?? fileName.replace(/\.[^.]+$/, "")),
        },
      ];
    })
    .sort(
      (left, right) =>
        left.section - right.section ||
        left.subsection - right.subsection ||
        left.alt.localeCompare(right.alt),
    );
}

function imageDirectory(rootDir: string, imageDir: string) {
  const direct = path.join(rootDir, imageDir);
  const nested = path.join(direct, "images");
  if (fs.existsSync(nested) && fs.readdirSync(nested).some(isImage)) return nested;
  if (fs.existsSync(direct)) return direct;
  return "";
}

function imageAlt(value: string) {
  return value
    .replace(/[_]+/g, " ")
    .replace(/\s*\(\d+\)\s*/g, " ")
    .replace(/\b[a-f0-9]{8,}\b/gi, "")
    .replace(/[.…]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isImage(fileName: string) {
  return /\.(png|jpe?g|webp)$/i.test(fileName);
}

function topicsFor(title: string): BlogFilter[] {
  return TOPIC_RULES.flatMap((rule) => (rule.test.test(title) ? [rule.topic] : []));
}

function cardCopy(title: string, metaDescription: string) {
  const splitAt = title.indexOf(":");
  const head = splitAt > 12 ? title.slice(0, splitAt).trim() : title.trim();
  const tail = splitAt > 12 ? title.slice(splitAt + 1).trim().replace(/\.+$/, "") : "";
  if (tail.length >= 28) {
    return { title: head, subtitle: tail.endsWith(".") ? tail : `${tail}.` };
  }
  return { title: head, subtitle: shorten(metaDescription) };
}

function preambleExcerpt(source: string) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const firstSection = lines.findIndex((line) => /^##\s+/.test(line));
  const preamble = lines.slice(0, firstSection > 0 ? firstSection : lines.length);
  const parts: string[] = [];
  for (const line of preamble) {
    const trimmed = line.trim();
    if (!trimmed || /^#\s+/.test(trimmed) || /^\*\*[^*]+:\*\*/.test(trimmed)) {
      if (parts.length > 0) break;
      continue;
    }
    parts.push(trimmed.replace(/\\/g, "").replace(/\*\*/g, ""));
  }
  return parts.join(" ");
}

function shorten(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= 170) return clean;
  return `${clean.slice(0, 167).replace(/\s+\S*$/, "")}...`;
}

function cardRank(title: string) {
  const index = CARD_ORDER.findIndex((pattern) => pattern.test(title));
  return index === -1 ? CARD_ORDER.length : index;
}
