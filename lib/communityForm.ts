import { getCountry, validateMobile } from "@/lib/countries";

export type CommunityDetails = {
  name: string;
  email: string;
  country: string;
  phone: string;
};

export const emptyCommunityDetails: CommunityDetails = {
  name: "",
  email: "",
  country: "",
  phone: "",
};

export function validateName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  if (!name) return "Enter your name.";
  if (name.length < 2) return "Enter at least 2 characters.";
  if (name.length > 80) return "Enter a shorter name.";
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) return "Use letters only in your name.";
  if (!/\p{L}{2}/u.test(name)) return "Enter at least 2 letters.";
  return "";
}

export function validateEmail(value: string) {
  const email = value.trim();
  if (!email) return "Enter your email.";
  const valid =
    email.length <= 120 &&
    !email.includes("..") &&
    /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/.test(
      email
    );
  return valid ? "" : "Enter a valid email, such as name@email.com.";
}

export function validateCommunityDetails(details: CommunityDetails) {
  const errors: Partial<Record<keyof CommunityDetails, string>> = {};
  const name = validateName(details.name);
  const email = validateEmail(details.email);
  const country = getCountry(details.country) ? "" : "Select your country.";
  const phone = validateMobile(details.country, details.phone);

  if (name) errors.name = name;
  if (email) errors.email = email;
  if (country) errors.country = country;
  if (phone) errors.phone = phone;
  return errors;
}
