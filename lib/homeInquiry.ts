import { getCountry, validateMobile } from "@/lib/countries";
import { validateEmail, validateName } from "@/lib/communityForm";

export const INQUIRY_TYPES = ["Individuals", "Businesses"] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export type HomeInquiry = {
  inquiryType: InquiryType;
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  message: string;
};

export const emptyHomeInquiry: HomeInquiry = {
  inquiryType: "Individuals",
  name: "",
  email: "",
  company: "",
  country: "",
  phone: "",
  message: "",
};

export function isInquiryType(value: string): value is InquiryType {
  return (INQUIRY_TYPES as readonly string[]).includes(value);
}

function validateCompany(value: string) {
  const company = value.trim().replace(/\s+/g, " ");
  if (!company) return "Enter your company.";
  if (company.length < 2) return "Enter the full company name.";
  if (company.length > 120) return "Enter a shorter company name.";
  if (!/^[\p{L}0-9][\p{L}0-9 .,&'’()/+\-]*$/u.test(company)) {
    return "Use letters, numbers, and standard punctuation in the company name.";
  }
  return "";
}

function validateMessage(value: string) {
  const message = value.trim();
  if (!message) return "Enter your message.";
  if (message.length < 10) return "Tell us a little more, at least 10 characters.";
  if (message.length > 1000) return "Keep your message under 1000 characters.";
  if (!/[\p{L}0-9]/u.test(message)) return "Enter a meaningful message.";
  return "";
}

export function validateHomeInquiry(details: HomeInquiry) {
  const errors: Partial<Record<keyof HomeInquiry, string>> = {};
  const type = isInquiryType(details.inquiryType) ? details.inquiryType : "";
  if (!type) errors.inquiryType = "Choose Individuals or Businesses.";

  const name = validateName(details.name);
  const emailError = validateEmail(details.email);
  const email =
    emailError && type === "Businesses"
      ? emailError === "Enter your email."
        ? "Enter your company email."
        : "Enter a valid company email, such as name@company.com."
      : emailError;
  const country = getCountry(details.country) ? "" : "Select your country.";
  const phone = validateMobile(details.country, details.phone);
  const message = validateMessage(details.message);

  if (name) errors.name = name;
  if (email) errors.email = email;
  if (type === "Businesses") {
    const company = validateCompany(details.company);
    if (company) errors.company = company;
  }
  if (country) errors.country = country;
  if (phone) errors.phone = phone === "Enter your phone or WhatsApp number." ? "Enter your mobile number." : phone;
  if (message) errors.message = message;

  return errors;
}
