import library from "./library.json";

export type PromptAudienceId =
  | "it"
  | "non-it"
  | "usa-jobseekers"
  | "masters-students";

export type PromptLevel = "Beginner" | "Intermediate" | "Advanced";

export type LibraryPrompt = {
  id: string;
  slug: string;
  number: number;
  title: string;
  description: string;
  promptText: string;
  level: PromptLevel;
  time: string;
  minutes: number;
};

export type LibrarySubcategory = {
  id: string;
  number: number;
  title: string;
  promptCount: number;
  prompts: LibraryPrompt[];
};

export type LibraryAudience = {
  id: PromptAudienceId;
  label: string;
  subcategoryCount: number;
  promptCount: number;
  subcategories: LibrarySubcategory[];
};

export type ExplorePrompt = LibraryPrompt & {
  audienceId: PromptAudienceId;
  audienceLabel: string;
  subcategoryId: string;
  subcategoryTitle: string;
};

export type AudienceTab = {
  id: PromptAudienceId;
  label: string;
};

export const LEVEL_OPTIONS = ["All levels", "Beginner", "Intermediate", "Advanced"] as const;
export const SORT_OPTIONS = ["Recommended", "A–Z", "Shortest", "Longest"] as const;

export const LIBRARY_AUDIENCES = library.audiences as LibraryAudience[];

export const AUDIENCE_TABS: AudienceTab[] = LIBRARY_AUDIENCES.map((audience) => ({
  id: audience.id,
  label: audience.label,
}));

export const EXPLORE_PROMPT_COUNT = LIBRARY_AUDIENCES.reduce(
  (sum, audience) => sum + audience.promptCount,
  0,
);

export const DEFAULT_AUDIENCE: PromptAudienceId = "it";

export function getAudience(id: PromptAudienceId): LibraryAudience {
  return (
    LIBRARY_AUDIENCES.find((audience) => audience.id === id) ?? LIBRARY_AUDIENCES[0]
  );
}

export function getSubcategories(audienceId: PromptAudienceId): LibrarySubcategory[] {
  return getAudience(audienceId).subcategories;
}

export function countByAudience(audienceId: PromptAudienceId) {
  return getAudience(audienceId).promptCount;
}

export function flattenAudiencePrompts(audienceId: PromptAudienceId): ExplorePrompt[] {
  const audience = getAudience(audienceId);
  return audience.subcategories.flatMap((subcategory) =>
    subcategory.prompts.map((prompt) => ({
      ...prompt,
      audienceId: audience.id,
      audienceLabel: audience.label,
      subcategoryId: subcategory.id,
      subcategoryTitle: subcategory.title,
    })),
  );
}

/** All library prompts across audiences (250). */
export function listAllPrompts(): ExplorePrompt[] {
  return LIBRARY_AUDIENCES.flatMap((audience) => flattenAudiencePrompts(audience.id));
}

export function isAudienceId(value: string | null | undefined): value is PromptAudienceId {
  return Boolean(value && LIBRARY_AUDIENCES.some((audience) => audience.id === value));
}

export type ResolvedSubcategory = {
  audienceId: PromptAudienceId;
  subcategoryId: string;
  title: string;
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9&+/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type SubcategoryOption = ResolvedSubcategory & {
  audienceLabel: string;
  promptCount: number;
};

function scoreSubcategoryMatch(titleNormalized: string, query: string) {
  if (!query) return 1;
  if (titleNormalized === query) return 100;
  if (titleNormalized.startsWith(query) || query.startsWith(titleNormalized)) return 80;
  if (titleNormalized.includes(query) || query.includes(titleNormalized)) return 60;

  const tokens = query.split(" ").filter(Boolean);
  if (tokens.length > 0 && tokens.every((token) => titleNormalized.includes(token))) {
    return 50;
  }

  return 0;
}

/** Flat list of every library subcategory across audiences. */
export function listAllSubcategories(): SubcategoryOption[] {
  return LIBRARY_AUDIENCES.flatMap((audience) =>
    audience.subcategories.map((subcategory) => ({
      audienceId: audience.id,
      audienceLabel: audience.label,
      subcategoryId: subcategory.id,
      title: subcategory.title,
      promptCount: subcategory.promptCount,
    })),
  );
}

/** Filter/rank subcategories for a typed query (empty query → full list). */
export function searchSubcategories(raw: string): SubcategoryOption[] {
  const query = normalizeSearchText(raw);
  const scored: Array<SubcategoryOption & { score: number }> = [];

  for (const audience of LIBRARY_AUDIENCES) {
    for (const subcategory of audience.subcategories) {
      const title = normalizeSearchText(subcategory.title);
      const score = scoreSubcategoryMatch(title, query);
      if (score <= 0) continue;

      scored.push({
        audienceId: audience.id,
        audienceLabel: audience.label,
        subcategoryId: subcategory.id,
        title: subcategory.title,
        promptCount: subcategory.promptCount,
        score,
      });
    }
  }

  scored.sort(
    (left, right) =>
      right.score - left.score ||
      left.title.localeCompare(right.title) ||
      left.audienceLabel.localeCompare(right.audienceLabel),
  );

  return scored.map((item) => ({
    audienceId: item.audienceId,
    audienceLabel: item.audienceLabel,
    subcategoryId: item.subcategoryId,
    title: item.title,
    promptCount: item.promptCount,
  }));
}

/** Match typed text like "Data Engineers" to a library subcategory. */
export function resolveSubcategoryQuery(raw: string): ResolvedSubcategory | null {
  const query = normalizeSearchText(raw);
  if (query.length < 2) return null;

  const best = searchSubcategories(raw)[0];
  if (!best) return null;

  return {
    audienceId: best.audienceId,
    subcategoryId: best.subcategoryId,
    title: best.title,
  };
}

export function filterExplorePrompts(options: {
  audience: PromptAudienceId;
  subcategoryId: string; // "all" or subcategory id
  query: string;
  level: (typeof LEVEL_OPTIONS)[number];
  sort: (typeof SORT_OPTIONS)[number];
}) {
  const q = options.query.trim().toLowerCase();
  let results = flattenAudiencePrompts(options.audience);

  if (options.subcategoryId !== "all") {
    results = results.filter((prompt) => prompt.subcategoryId === options.subcategoryId);
  }

  if (options.level !== "All levels") {
    results = results.filter((prompt) => prompt.level === options.level);
  }

  if (q) {
    results = results.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(q) ||
        prompt.description.toLowerCase().includes(q) ||
        prompt.subcategoryTitle.toLowerCase().includes(q) ||
        prompt.promptText.toLowerCase().includes(q),
    );
  }

  switch (options.sort) {
    case "A–Z":
      results = [...results].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "Shortest":
      results = [...results].sort((a, b) => a.minutes - b.minutes || a.number - b.number);
      break;
    case "Longest":
      results = [...results].sort((a, b) => b.minutes - a.minutes || a.number - b.number);
      break;
    case "Recommended":
    default:
      results = [...results].sort((a, b) => {
        if (a.subcategoryId !== b.subcategoryId) {
          return a.subcategoryTitle.localeCompare(b.subcategoryTitle);
        }
        return a.number - b.number;
      });
      break;
  }

  return results;
}
