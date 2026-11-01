import { getCountry, validateMobile } from "@/lib/countries";
import { validateEmail, validateName } from "@/lib/communityForm";

export const US_COUNTRY = "United States";

export const US_VISA_OPTIONS = [
  "OPT",
  "STEM-OPT",
  "H1B",
  "H4",
  "Green Card",
  "Citizen",
] as const;

export type JobAssistanceInquiry = {
  name: string;
  email: string;
  country: string;
  phone: string;
  resumeUrl: string;
  visa: string;
};

export const emptyJobAssistanceInquiry: JobAssistanceInquiry = {
  name: "",
  email: "",
  country: "",
  phone: "",
  resumeUrl: "",
  visa: "",
};

export function isUnitedStates(country: string) {
  return country.trim() === US_COUNTRY;
}

function validateResumeUrl(value: string) {
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

function validateVisa(country: string, visa: string) {
  if (!isUnitedStates(country)) return "";
  return (US_VISA_OPTIONS as readonly string[]).includes(visa) ? "" : "Select your visa status.";
}

export function validateJobAssistanceInquiry(details: JobAssistanceInquiry) {
  const errors: Partial<Record<keyof JobAssistanceInquiry, string>> = {};
  const name = validateName(details.name);
  const email = validateEmail(details.email);
  const country = getCountry(details.country) ? "" : "Select your country.";
  const phone = details.country
    ? validateMobile(details.country, details.phone)
    : "Select your country first.";
  const resumeUrl = validateResumeUrl(details.resumeUrl);
  const visa = validateVisa(details.country, details.visa);

  if (name) errors.name = name;
  if (email) errors.email = email;
  if (country) errors.country = country;
  if (phone) errors.phone = phone;
  if (resumeUrl) errors.resumeUrl = resumeUrl;
  if (visa) errors.visa = visa;
  return errors;
}
