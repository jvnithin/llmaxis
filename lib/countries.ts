export type Country = {
  name: string;
  code: string;
  dial: string;
};

export const countries: Country[] = [
  { name: "India", code: "IN", dial: "+91" },
  { name: "United States", code: "US", dial: "+1" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "United Arab Emirates", code: "AE", dial: "+971" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "Afghanistan", code: "AF", dial: "+93" },
  { name: "Albania", code: "AL", dial: "+355" },
  { name: "Algeria", code: "DZ", dial: "+213" },
  { name: "Argentina", code: "AR", dial: "+54" },
  { name: "Austria", code: "AT", dial: "+43" },
  { name: "Bangladesh", code: "BD", dial: "+880" },
  { name: "Belgium", code: "BE", dial: "+32" },
  { name: "Brazil", code: "BR", dial: "+55" },
  { name: "Chile", code: "CL", dial: "+56" },
  { name: "China", code: "CN", dial: "+86" },
  { name: "Colombia", code: "CO", dial: "+57" },
  { name: "Denmark", code: "DK", dial: "+45" },
  { name: "Egypt", code: "EG", dial: "+20" },
  { name: "Ethiopia", code: "ET", dial: "+251" },
  { name: "Finland", code: "FI", dial: "+358" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Ghana", code: "GH", dial: "+233" },
  { name: "Greece", code: "GR", dial: "+30" },
  { name: "Hong Kong", code: "HK", dial: "+852" },
  { name: "Hungary", code: "HU", dial: "+36" },
  { name: "Indonesia", code: "ID", dial: "+62" },
  { name: "Iran", code: "IR", dial: "+98" },
  { name: "Iraq", code: "IQ", dial: "+964" },
  { name: "Ireland", code: "IE", dial: "+353" },
  { name: "Israel", code: "IL", dial: "+972" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "Jordan", code: "JO", dial: "+962" },
  { name: "Kenya", code: "KE", dial: "+254" },
  { name: "Kuwait", code: "KW", dial: "+965" },
  { name: "Malaysia", code: "MY", dial: "+60" },
  { name: "Mexico", code: "MX", dial: "+52" },
  { name: "Morocco", code: "MA", dial: "+212" },
  { name: "Myanmar", code: "MM", dial: "+95" },
  { name: "Nepal", code: "NP", dial: "+977" },
  { name: "Netherlands", code: "NL", dial: "+31" },
  { name: "New Zealand", code: "NZ", dial: "+64" },
  { name: "Nigeria", code: "NG", dial: "+234" },
  { name: "Norway", code: "NO", dial: "+47" },
  { name: "Oman", code: "OM", dial: "+968" },
  { name: "Pakistan", code: "PK", dial: "+92" },
  { name: "Philippines", code: "PH", dial: "+63" },
  { name: "Poland", code: "PL", dial: "+48" },
  { name: "Portugal", code: "PT", dial: "+351" },
  { name: "Qatar", code: "QA", dial: "+974" },
  { name: "Romania", code: "RO", dial: "+40" },
  { name: "Russia", code: "RU", dial: "+7" },
  { name: "Saudi Arabia", code: "SA", dial: "+966" },
  { name: "South Africa", code: "ZA", dial: "+27" },
  { name: "South Korea", code: "KR", dial: "+82" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Sri Lanka", code: "LK", dial: "+94" },
  { name: "Sweden", code: "SE", dial: "+46" },
  { name: "Switzerland", code: "CH", dial: "+41" },
  { name: "Taiwan", code: "TW", dial: "+886" },
  { name: "Tanzania", code: "TZ", dial: "+255" },
  { name: "Thailand", code: "TH", dial: "+66" },
  { name: "Turkey", code: "TR", dial: "+90" },
  { name: "Uganda", code: "UG", dial: "+256" },
  { name: "Ukraine", code: "UA", dial: "+380" },
  { name: "Vietnam", code: "VN", dial: "+84" },
  { name: "Yemen", code: "YE", dial: "+967" },
  { name: "Zimbabwe", code: "ZW", dial: "+263" },
];

/** National mobile length, excluding the country code and a leading trunk zero. */
const MOBILE_LENGTH: Record<string, readonly [number, number]> = {
  IN: [10, 10],
  US: [10, 10],
  GB: [10, 10],
  CA: [10, 10],
  AU: [9, 9],
  AE: [9, 9],
  SG: [8, 8],
  DE: [10, 11],
  AF: [9, 9],
  AL: [9, 9],
  DZ: [9, 9],
  AR: [10, 10],
  AT: [10, 13],
  BD: [10, 10],
  BE: [9, 9],
  BR: [10, 11],
  CL: [9, 9],
  CN: [11, 11],
  CO: [10, 10],
  DK: [8, 8],
  EG: [10, 10],
  ET: [9, 9],
  FI: [9, 10],
  FR: [9, 9],
  GH: [9, 9],
  GR: [10, 10],
  HK: [8, 8],
  HU: [9, 9],
  ID: [9, 12],
  IR: [10, 10],
  IQ: [10, 10],
  IE: [9, 9],
  IL: [9, 9],
  IT: [9, 10],
  JP: [10, 10],
  JO: [9, 9],
  KE: [9, 9],
  KW: [8, 8],
  MY: [9, 10],
  MX: [10, 10],
  MA: [9, 9],
  MM: [8, 10],
  NP: [10, 10],
  NL: [9, 9],
  NZ: [8, 10],
  NG: [10, 10],
  NO: [8, 8],
  OM: [8, 8],
  PK: [10, 10],
  PH: [10, 10],
  PL: [9, 9],
  PT: [9, 9],
  QA: [8, 8],
  RO: [9, 9],
  RU: [10, 10],
  SA: [9, 9],
  ZA: [9, 9],
  KR: [9, 11],
  ES: [9, 9],
  LK: [9, 9],
  SE: [9, 10],
  CH: [9, 9],
  TW: [9, 9],
  TZ: [9, 9],
  TH: [9, 9],
  TR: [10, 10],
  UG: [9, 9],
  UA: [9, 9],
  VN: [9, 10],
  YE: [9, 9],
  ZW: [9, 9],
};

export function getCountry(name: string) {
  return countries.find((country) => country.name === name) ?? null;
}

export function mobileLength(country: Country) {
  return MOBILE_LENGTH[country.code] ?? [8, 12];
}

export function mobileLengthLabel(country: Country) {
  const [min, max] = mobileLength(country);
  return min === max ? `${min}-digit number` : `${min}–${max} digits`;
}

export function sanitizeNationalNumber(raw: string, country: Country) {
  const [, max] = mobileLength(country);
  let digits = raw.replace(/\D/g, "");
  const dialDigits = country.dial.replace(/\D/g, "");
  if (dialDigits && digits.startsWith(dialDigits) && digits.length > max) {
    digits = digits.slice(dialDigits.length);
  }
  if (digits.startsWith("0") && digits.length > max) {
    digits = digits.replace(/^0+/, "");
  }
  return digits.slice(0, max);
}

export function validateMobile(countryName: string, phone: string) {
  if (!countryName.trim()) return "Select your country.";
  const country = getCountry(countryName);
  if (!country) return "Select a country from the list.";
  if (!phone.trim()) return "Enter your phone or WhatsApp number.";
  if (!/^\d+$/.test(phone)) {
    return `Enter digits only. The ${country.dial} prefix is added automatically.`;
  }

  const [min, max] = mobileLength(country);
  const expected = min === max ? `${min} digits` : `${min} to ${max} digits`;
  if (phone.length < min || phone.length > max || /^0+$/.test(phone)) {
    return `${country.name} mobile numbers must be ${expected}.`;
  }
  if (country.code === "IN" && !/^[6-9]/.test(phone)) {
    return "Indian mobile numbers are 10 digits and start with 6, 7, 8, or 9.";
  }
  return "";
}
