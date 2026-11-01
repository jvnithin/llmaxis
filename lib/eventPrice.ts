export function eventPrice() {
  const price = Number(process.env["EVENT_PRICE"]);
  return Number.isFinite(price) && price > 0 ? price : 1;
}

export function eventCurrency() {
  return process.env["EVENT_CURRENCY"] === "INR" ? "INR" : "USD";
}

export function formatEventPrice(price = eventPrice(), currency = eventCurrency()) {
  return currency === "USD" ? `$${price}` : `₹${price}`;
}
