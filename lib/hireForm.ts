import { getCountry, validateMobile } from "@/lib/countries";
import { validateEmail, validateName } from "@/lib/communityForm";

export const HIRE_ROLES = ["AI Engineer", "Full Stack Developer", "Data Scientist", "Other"] as const;
export const OTHER_HIRE_ROLE = "Other";

export type HireForm = {
  name: string;
  company: string;
  email: string;
  country: string;
  phone: string;
  interest: string;
  customInterest: string;
};

export type HireErrors = Partial<Record<keyof HireForm, string>>;

export const emptyHireForm: HireForm = {
  name: "",
  company: "",
  email: "",
  country: "",
  phone: "",
  interest: "AI Engineer",
  customInterest: "",
};

function validateCompany(value: string) {
  const company = value.trim().replace(/\s+/g, " ");
  if (!company) return "Enter your company name.";
  if (company.length < 2) return "Enter at least 2 characters.";
  if (company.length > 120) return "Enter a shorter company name.";
  return "";
}

function validateCustomInterest(value: string) {
  const role = value.trim().replace(/\s+/g, " ");
  if (!role) return "Enter the role you want to hire.";
  if (role.length < 2) return "Enter at least 2 characters.";
  if (role.length > 80) return "Enter a shorter role.";
  return "";
}

export function resolvedHireInterest(form: HireForm) {
  return form.interest === OTHER_HIRE_ROLE
    ? form.customInterest.trim().replace(/\s+/g, " ")
    : form.interest.trim();
}

export function validateHireForm(form: HireForm) {
  const errors: HireErrors = {};
  const name = validateName(form.name);
  const company = validateCompany(form.company);
  const email = validateEmail(form.email);
  const country = getCountry(form.country) ? "" : "Select a country code.";
  const phone = form.country ? validateMobile(form.country, form.phone) : "Select a country code first.";
  const interest = (HIRE_ROLES as readonly string[]).includes(form.interest)
    ? ""
    : "Select a hiring interest.";
  const customInterest = form.interest === OTHER_HIRE_ROLE ? validateCustomInterest(form.customInterest) : "";

  if (name) errors.name = name;
  if (company) errors.company = company;
  if (email) errors.email = email;
  if (country) errors.country = country;
  if (phone) errors.phone = phone;
  if (interest) errors.interest = interest;
  if (customInterest) errors.customInterest = customInterest;
  return errors;
}
