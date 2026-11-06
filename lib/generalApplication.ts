import { getCountry, validateMobile } from "@/lib/countries";
import { validateEmail, validateName } from "@/lib/communityForm";
import {
  createCareerSocialLink,
  formatCareerSocialLinks,
  validateCareerSocialLinks,
  validateResumeUrl,
  type CareerSocialLink,
  type CareerSocialLinkErrors,
} from "@/lib/careerApplication";

export type GeneralApplication = {
  name: string;
  email: string;
  country: string;
  phone: string;
  message: string;
  resumeUrl: string;
  socialLinks: CareerSocialLink[];
};

export type GeneralApplicationErrors = Partial<
  Record<Exclude<keyof GeneralApplication, "socialLinks">, string>
> & {
  socialLinks?: CareerSocialLinkErrors;
};

export const emptyGeneralApplication = (): GeneralApplication => ({
  name: "",
  email: "",
  country: "",
  phone: "",
  message: "",
  resumeUrl: "",
  socialLinks: [],
});

export { createCareerSocialLink as createGeneralSocialLink };
export { formatCareerSocialLinks as formatGeneralSocialLinks };

function validateSpecialisationMessage(value: string) {
  const message = value.trim().replace(/\s+/g, " ");
  if (!message) return "Tell us what you specialise in.";
  if (message.length < 10) return "Enter at least 10 characters.";
  if (message.length > 1000) return "Enter a shorter message.";
  return "";
}

export function validateGeneralApplication(details: GeneralApplication) {
  const errors: GeneralApplicationErrors = {};
  const name = validateName(details.name);
  const email = validateEmail(details.email);
  const country = getCountry(details.country) ? "" : "Select your country.";
  const phone = details.country
    ? validateMobile(details.country, details.phone)
    : "Select your country first.";
  const message = validateSpecialisationMessage(details.message);
  const resumeUrl = validateResumeUrl(details.resumeUrl);
  const socialLinks = validateCareerSocialLinks(details.socialLinks);

  if (name) errors.name = name;
  if (email) errors.email = email;
  if (country) errors.country = country;
  if (phone) errors.phone = phone;
  if (message) errors.message = message;
  if (resumeUrl) errors.resumeUrl = resumeUrl;
  if (Object.keys(socialLinks).length > 0) errors.socialLinks = socialLinks;
  return errors;
}

export function generalApplicationHasErrors(errors: GeneralApplicationErrors) {
  return Object.keys(errors).some((key) => {
    if (key === "socialLinks") {
      return Object.keys(errors.socialLinks ?? {}).length > 0;
    }
    return Boolean(
      errors[key as Exclude<keyof GeneralApplicationErrors, "socialLinks">],
    );
  });
}
