const SITE_HOSTS = new Set(["llmaxis.in", "www.llmaxis.in", "localhost"]);

export function isExternalHref(href: string) {
  const value = href.trim();
  if (!value || value.startsWith("#") || value.startsWith("/")) return false;
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return true;

  try {
    const url = new URL(value, "https://llmaxis.in");
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return !SITE_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function externalDestination(href: string) {
  try {
    const url = new URL(href);
    return {
      href: url.toString(),
      host: url.hostname.replace(/^www\./i, ""),
      display: url.toString().replace(/^https?:\/\//i, ""),
    };
  } catch {
    return {
      href,
      host: href,
      display: href,
    };
  }
}
