import { getCountry, validateMobile } from "@/lib/countries";
import { validateEmail, validateName } from "@/lib/communityForm";

export const CAREER_SOCIAL_PLATFORMS = [
  "LinkedIn",
  "Twitter / X",
  "GitHub",
  "Instagram",
  "YouTube",
  "Portfolio",
  "Behance",
  "Dribbble",
] as const;

export type CareerSocialPlatform = (typeof CAREER_SOCIAL_PLATFORMS)[number];

export type CareerSocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type CareerApplication = {
  name: string;
  email: string;
  country: string;
  phone: string;
  resumeUrl: string;
  role: string;
  socialLinks: CareerSocialLink[];
};

export type CareerSocialLinkFieldError = {
  platform?: string;
  url?: string;
};

export type CareerSocialLinkErrors = Record<string, CareerSocialLinkFieldError>;

export type CareerApplicationErrors = Partial<
  Record<Exclude<keyof CareerApplication, "socialLinks">, string>
> & {
  socialLinks?: CareerSocialLinkErrors;
};

export const emptyCareerApplication = (role = ""): CareerApplication => ({
  name: "",
  email: "",
  country: "",
  phone: "",
  resumeUrl: "",
  role,
  socialLinks: [],
});

export function createCareerSocialLink(): CareerSocialLink {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `social-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return { id, platform: "", url: "" };
}

export function validateResumeUrl(value: string) {
  const raw = value.trim();
  if (!raw) return "Enter your resume URL.";
  if (raw.length > 500) return "Enter a shorter resume URL.";
  if (/\s/.test(raw)) return "The resume URL cannot contain spaces.";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "Enter a resume link that starts with https://.";
    }
    if (!url.hostname.includes(".")) return "Enter a complete resume URL.";
  } catch {
    return "Enter a valid resume URL, such as https://drive.google.com/file/...";
  }
  return "";
}

function validateOptionalHttpUrl(value: string, label: string) {
  const raw = value.trim();
  if (!raw) return `Enter the ${label} URL.`;
  if (raw.length > 500) return "Enter a shorter URL.";
  if (/\s/.test(raw)) return "The URL cannot contain spaces.";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "Enter a link that starts with https://.";
    }
    if (!url.hostname.includes(".")) return "Enter a complete URL.";
  } catch {
    return "Enter a valid URL, such as https://linkedin.com/in/...";
  }
  return "";
}

function validatePlatformName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  if (!name) return "Enter or select a platform.";
  if (name.length < 2) return "Enter at least 2 characters.";
  if (name.length > 40) return "Enter a shorter platform name.";
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .&/+_-]*$/u.test(name)) {
    return "Use letters, numbers, or common punctuation only.";
  }
  return "";
}

export function validateCareerSocialLinks(links: CareerSocialLink[]) {
  const errors: CareerSocialLinkErrors = {};

  links.forEach((link) => {
    const row: CareerSocialLinkFieldError = {};
    const platformError = validatePlatformName(link.platform);
    if (platformError) row.platform = platformError;

    const label = link.platform.trim() || "profile";
    const urlError = validateOptionalHttpUrl(link.url, label);
    if (urlError) row.url = urlError;

    if (row.platform || row.url) errors[link.id] = row;
  });

  return errors;
}

export function validateCareerApplication(details: CareerApplication) {
  const errors: CareerApplicationErrors = {};
  const name = validateName(details.name);
  const email = validateEmail(details.email);
  const country = getCountry(details.country) ? "" : "Select your country.";
  const phone = details.country
    ? validateMobile(details.country, details.phone)
    : "Select your country first.";
  const resumeUrl = validateResumeUrl(details.resumeUrl);
  const role = details.role.trim() ? "" : "Role is missing.";
  const socialLinks = validateCareerSocialLinks(details.socialLinks);

  if (name) errors.name = name;
  if (email) errors.email = email;
  if (country) errors.country = country;
  if (phone) errors.phone = phone;
  if (resumeUrl) errors.resumeUrl = resumeUrl;
  if (role) errors.role = role;
  if (Object.keys(socialLinks).length > 0) errors.socialLinks = socialLinks;
  return errors;
}

export function careerApplicationHasErrors(errors: CareerApplicationErrors) {
  return Object.keys(errors).some((key) => {
    if (key === "socialLinks") {
      return Object.keys(errors.socialLinks ?? {}).length > 0;
    }
    return Boolean(errors[key as Exclude<keyof CareerApplicationErrors, "socialLinks">]);
  });
}

/** Spreadsheet-friendly: "LinkedIn: https://... | Medium: https://..." */
export function formatCareerSocialLinks(links: CareerSocialLink[]) {
  return links
    .map((link) => {
      const platform = link.platform.trim();
      const url = link.url.trim();
      if (!platform && !url) return "";
      return `${platform || "Link"}: ${url}`;
    })
    .filter(Boolean)
    .join(" | ");
}
