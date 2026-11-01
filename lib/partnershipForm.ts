import { getCountry, validateMobile } from "@/lib/countries";

export const PARTNERSHIP_TYPES = [
  "University & College Partnerships",
  "Corporate & Enterprise Partnerships",
  "Hiring & Staffing Partnerships",
  "Technology & Business Partnerships",
  "Industry Experts & Mentors",
  "Channel & Growth Partnerships",
  "Other",
] as const;

export const OTHER_PARTNERSHIP = "Other";

export type PartnershipInquiry = {
  fullName: string;
  organization: string;
  email: string;
  country: string;
  phone: string;
  partnership: string;
  customPartnership: string;
  proposal: string;
};

export const emptyPartnershipInquiry: PartnershipInquiry = {
  fullName: "",
  organization: "",
  email: "",
  country: "",
  phone: "",
  partnership: "",
  customPartnership: "",
  proposal: "",
};

export function resolvedPartnership(details: PartnershipInquiry) {
  return details.partnership === OTHER_PARTNERSHIP
    ? details.customPartnership.trim().replace(/\s+/g, " ")
    : details.partnership.trim();
}

function validateFullName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  if (!name) return "Enter your full name.";
  if (name.length > 80) return "Enter a shorter full name.";
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) return "Use letters only in your full name.";
  if (name.replace(/[^\p{L}]/gu, "").length < 2) return "Enter your full name.";
  return "";
}

function validateOrganization(value: string) {
  const organization = value.trim().replace(/\s+/g, " ");
  if (!organization) return "Enter your organization or company name.";
  if (organization.length < 2) return "Enter the full organization or company name.";
  if (organization.length > 120) return "Enter a shorter organization or company name.";
  if (!/^[\p{L}0-9][\p{L}0-9 .,&'’()/+\-]*$/u.test(organization)) {
    return "Use letters, numbers, and standard punctuation in the organization name.";
  }
  return "";
}

function validateEmail(value: string) {
  const email = value.trim();
  if (!email) return "Enter your official email address.";
  const valid =
    email.length <= 120 &&
    !email.includes("..") &&
    /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/.test(
      email,
    );
  return valid ? "" : "Enter a valid official email, such as name@company.com.";
}

function validatePartnership(value: string) {
  return (PARTNERSHIP_TYPES as readonly string[]).includes(value)
    ? ""
    : "Select how you would like to partner.";
}

function validateCustomPartnership(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  if (!text) return "Enter how you would like to partner.";
  if (text.length < 2) return "Enter at least 2 characters.";
  if (text.length > 80) return "Enter a shorter partnership type.";
  if (!/[\p{L}0-9]/u.test(text)) return "Enter a meaningful partnership type.";
  return "";
}

function validateProposal(value: string) {
  const text = value.trim();
  if (!text) return "";
  if (text.length < 10) return "Enter at least 10 characters about your proposal.";
  if (text.length > 1000) return "Keep the proposal under 1000 characters.";
  if (!/[\p{L}0-9]/u.test(text)) return "Enter a meaningful proposal.";
  return "";
}

export function validatePartnershipInquiry(details: PartnershipInquiry) {
  const errors: Partial<Record<keyof PartnershipInquiry, string>> = {};
  const fullName = validateFullName(details.fullName);
  const organization = validateOrganization(details.organization);
  const email = validateEmail(details.email);
  const country = getCountry(details.country) ? "" : "Select your country.";
  const phone = details.country
    ? validateMobile(details.country, details.phone)
    : "Select your country first.";
  const partnership = validatePartnership(details.partnership);
  const customPartnership =
    details.partnership === OTHER_PARTNERSHIP
      ? validateCustomPartnership(details.customPartnership)
      : "";
  const proposal = validateProposal(details.proposal);

  if (fullName) errors.fullName = fullName;
  if (organization) errors.organization = organization;
  if (email) errors.email = email;
  if (country) errors.country = country;
  if (phone) errors.phone = phone;
  if (partnership) errors.partnership = partnership;
  if (customPartnership) errors.customPartnership = customPartnership;
  if (proposal) errors.proposal = proposal;
  return errors;
}
