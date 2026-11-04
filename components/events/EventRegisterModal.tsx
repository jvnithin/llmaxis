"use client";

import { useState, useEffect, useCallback } from "react";
import { X, CheckCircle2, MessageCircle, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { event as trackFbEvent } from "@/lib/fpixel";
import { countries, getCountry } from "@/lib/countries";
import { quoteEventPrice } from "@/lib/eventPrice";
import { detectCountryClient } from "@/lib/clientGeo";

export { countries };

type PricingQuote = {
  currency: string;
  amountMinor: number;
  amountMajor: number;
  formattedPrice: string;
  countryCode: string;
  countryName: string;
  taxableAmountMajor?: number;
  gstRate?: number;
  gstAmountMajor?: number;
  includesGst?: boolean;
};

const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_ENROLLMENT_APPS_SCRIPT_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_SHEET_APPS_SCRIPT_URL ||
  process.env.GOOGLE_SHEET_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbwN30PSI9aAWqjOahuzx7R1ID6qCMyDbRadRi_e3nLvm2TV_Gw7b6Br6glrXtKzcEoq/exec";

interface EventRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  badge?: string;
  subtitle?: string;
  eventName?: string;
  description?: string;
}

const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { Razorpay?: unknown }).Razorpay
    ) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const sendToGoogleSheet = async (data: {
  name: string;
  email: string;
  country: string;
  phone: string;
  paymentStatus: string;
  paymentId?: string;
  orderId?: string;
  amount?: string;
  event?: string;
}) => {
  try {
    const formattedPhone = data.phone.startsWith("'") ? data.phone : `'${data.phone}`;
    const spreadsheetId =
      process.env.NEXT_PUBLIC_ENROLLMENT_SPREADSHEET_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
      process.env.GOOGLE_SHEET_ID ||
      "14p_q7p7iYU2ZtNaZCcr845-Mb13nOaW8AxqrpLjLKLE";

    const params = new URLSearchParams({
      source: "event_registration",
      sheet_id: spreadsheetId,
      event: data.event || "Beyond ChatGPT: How AI Is Learning to Think, Act & Work",
      name: data.name,
      email: data.email,
      country: data.country,
      phone: formattedPhone,
      payment_status: data.paymentStatus,
      payment_id: data.paymentId || "N/A",
      order_id: data.orderId || "N/A",
      amount:
        data.amount ||
        (process.env.NEXT_PUBLIC_EVENT_CURRENCY === "INR"
          ? `₹${process.env.NEXT_PUBLIC_EVENT_PRICE || "206"}`
          : `$${process.env.NEXT_PUBLIC_EVENT_PRICE || "206"}`),
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });
  } catch (err) {
    console.error("Google Sheet webhook error:", err);
  }
};

export default function EventRegisterModal({
  isOpen,
  onClose,
  title = "Register for Event",
  badge = "Live Masterclass",
  subtitle = "Enter your details to proceed to secure Razorpay checkout.",
  eventName = "Beyond ChatGPT: How AI Is Learning to Think, Act & Work",
  description,
}: EventRegisterModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "India",
    dialCode: "+91",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    paymentId: string;
    amount: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [pricing, setPricing] = useState<PricingQuote | null>(null);
  const [geoApplied, setGeoApplied] = useState(false);

  const defaultKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

  const fetchPricing = useCallback(async (countryName: string, countryCode?: string) => {
    try {
      // POST — GET searchParams are ignored under output: "export" + force-static.
      const res = await fetch("/api/pricing/country", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: countryName,
          countryCode: countryCode || undefined,
        }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Unable to load pricing");
      }
      const quote: PricingQuote = {
        currency: data.currency,
        amountMinor: data.amountMinor,
        amountMajor: data.amountMajor,
        formattedPrice: data.formattedPrice,
        countryCode: data.country?.code || countryCode || "IN",
        countryName: data.country?.name || countryName,
        taxableAmountMajor: data.taxableAmountMajor,
        gstRate: data.gstRate,
        gstAmountMajor: data.gstAmountMajor,
        includesGst: Boolean(data.includesGst),
      };
      setPricing(quote);
      return {
        quote,
        detected: data.detected as
          | { countryCode?: string; countryName?: string }
          | undefined,
      };
    } catch (err) {
      console.error("Pricing API unavailable, using client FX quote:", err);
      try {
        const local = await quoteEventPrice({
          countryCode: countryCode || undefined,
          countryName,
        });
        const quote: PricingQuote = {
          currency: local.currency,
          amountMinor: local.amountMinor,
          amountMajor: local.amountMajor,
          formattedPrice: local.formattedPrice,
          countryCode: local.countryCode,
          countryName: local.countryName,
          taxableAmountMajor: local.taxableAmountMajor,
          gstRate: local.gstRate,
          gstAmountMajor: local.gstAmountMajor,
          includesGst: local.includesGst,
        };
        setPricing(quote);
        return { quote, detected: undefined };
      } catch (localErr) {
        console.error("Client pricing fallback failed:", localErr);
        return null;
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen || geoApplied) return;

    let cancelled = false;
    (async () => {
      // On localhost the server often only sees a private IP and returns EVENT_FALLBACK_COUNTRY.
      // Prefer a real IP lookup from the browser whenever server detection is missing or fallback.
      let detectedCode: string | undefined;
      let detectedName: string | undefined;
      let serverMethod: string | undefined;

      try {
        const probe = await fetch("/api/pricing/country", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const contentType = probe.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await probe.json() : null;
        if (probe.ok && data?.success && data.detected) {
          serverMethod = data.detected.detectionMethod;
          if (serverMethod && serverMethod !== "fallback") {
            detectedCode = data.detected.countryCode;
            detectedName = data.detected.countryName;
          }
        }
      } catch {
        // ignore — client geo below
      }

      if (!detectedCode) {
        const clientGeo = await detectCountryClient();
        detectedCode = clientGeo.countryCode;
        detectedName = clientGeo.countryName;
      }

      if (cancelled) return;

      const detectedCountry =
        (detectedName && getCountry(detectedName)) ||
        countries.find((c) => c.code === detectedCode) ||
        getCountry("India");

      if (detectedCountry) {
        setForm((prev) => ({
          ...prev,
          country: detectedCountry.name,
          dialCode: detectedCountry.dial,
        }));
      }

      const result = await fetchPricing(
        detectedCountry?.name || "India",
        detectedCountry?.code || "IN",
      );
      if (cancelled || !result) {
        setGeoApplied(true);
        return;
      }

      setGeoApplied(true);
      trackFbEvent("ViewContent", {
        content_name: eventName,
        content_category: "Registration",
        currency: result.quote.currency,
        value: result.quote.amountMajor,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, eventName, fetchPricing, geoApplied]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find((c) => c.name === e.target.value);
    setForm((prev) => ({
      ...prev,
      country: e.target.value,
      dialCode: selected?.dial ?? "+91",
    }));
    void fetchPricing(e.target.value, selected?.code);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedPhone = `${form.dialCode} ${form.phone.trim()}`;
      const countryMeta = getCountry(form.country);
      const pricingResult =
        pricing ||
        (await fetchPricing(form.country, countryMeta?.code))?.quote ||
        null;

      // Always create a server-side order so amount/currency cannot be client-tampered.
      const res = await fetch("/api/events/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          country: form.country,
          countryCode: countryMeta?.code,
          phone: formattedPhone,
          event: eventName,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data =
        contentType.includes("application/json") ? await res.json() : null;

      if (!res.ok || !data?.success || !data.orderId) {
        throw new Error(data?.error || "Unable to create payment order. Please try again.");
      }

      const amountFormatted =
        data.priceFormatted || pricingResult?.formattedPrice || "";
      const orderCurrency = data.currency;
      const orderAmount = data.amount;
      const backendOrderId = data.orderId as string;
      const backendKeyId = data.keyId || defaultKeyId;

      if (!backendKeyId) {
        throw new Error("Razorpay key is not configured.");
      }

      trackFbEvent("Lead", {
        content_name: eventName,
        content_category: "Registration",
        currency: orderCurrency,
        value: data.amountMajor ?? pricingResult?.amountMajor ?? 0,
      });

      trackFbEvent("InitiateCheckout", {
        content_name: eventName,
        currency: orderCurrency,
        value: data.amountMajor ?? pricingResult?.amountMajor ?? 0,
        num_items: 1,
      });

      sendToGoogleSheet({
        name: form.name.trim(),
        email: form.email.trim(),
        country: form.country,
        phone: formattedPhone,
        paymentStatus: "Pending",
        orderId: backendOrderId,
        amount: amountFormatted,
        event: eventName,
      });

      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      }

      const itemDescription = description || `${eventName} - LLM Axis`;

      const options: Record<string, unknown> = {
        key: backendKeyId,
        amount: orderAmount,
        currency: orderCurrency,
        order_id: backendOrderId,
        name: "LLM Axis",
        description: itemDescription,
        image: "/logo.jpeg",
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: formattedPhone,
        },
        theme: {
          color: "#7c3aed",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            setLoading(true);

            await sendToGoogleSheet({
              name: form.name.trim(),
              email: form.email.trim(),
              country: form.country,
              phone: formattedPhone,
              paymentStatus: "Paid",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || backendOrderId,
              amount: amountFormatted,
              event: eventName,
            });

            trackFbEvent("Purchase", {
              content_name: eventName,
              currency: orderCurrency,
              value: data.amountMajor ?? pricingResult?.amountMajor ?? 0,
              transaction_id: response.razorpay_payment_id,
            });

            if (response.razorpay_signature) {
              fetch("/api/events/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  name: form.name.trim(),
                  email: form.email.trim(),
                  country: form.country,
                  countryCode: countryMeta?.code,
                  phone: formattedPhone,
                  amount: amountFormatted,
                  event: eventName,
                }),
              }).catch(() => {});
            }

            setPaymentInfo({
              paymentId: response.razorpay_payment_id,
              amount: amountFormatted,
            });
            setSubmitted(true);
          } catch (err) {
            console.error("Payment confirmation error:", err);
            setPaymentInfo({
              paymentId: response.razorpay_payment_id,
              amount: amountFormatted,
            });
            setSubmitted(true);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            sendToGoogleSheet({
              name: form.name.trim(),
              email: form.email.trim(),
              country: form.country,
              phone: formattedPhone,
              paymentStatus: "Cancelled",
              orderId: backendOrderId,
              amount: amountFormatted,
              event: eventName,
            });
          },
        },
      };

      const razorpayInstance = new (window as unknown as {
        Razorpay: new (opts: Record<string, unknown>) => {
          on: (event: string, cb: (response: { error?: { description?: string } }) => void) => void;
          open: () => void;
        };
      }).Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        setLoading(false);
        setError(`Payment failed: ${response.error?.description || "Transaction declined"}`);
      });

      razorpayInstance.open();
    } catch (err: unknown) {
      console.error("Payment initialization error:", err);
      setError(err instanceof Error ? err.message : "Unable to open payment window. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setPaymentInfo(null);
      setPricing(null);
      setGeoApplied(false);
      setForm({
        name: "",
        email: "",
        country: "India",
        dialCode: "+91",
        phone: "",
      });
      setError("");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative border border-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Payment &amp; Registration Successful!
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                You are registered for <span className="font-semibold text-purple-700">{eventName}</span>.
              </p>
              {paymentInfo?.paymentId && (
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                  <p className="font-medium text-slate-800">
                    Payment ID: <span className="font-mono text-purple-700">{paymentInfo.paymentId}</span>
                  </p>
                  <p className="text-slate-500 mt-0.5">Amount Paid: {paymentInfo.amount}</p>
                </div>
              )}
            </div>

            <div className="pt-3 space-y-2">
              <a
                href={`https://wa.me/918309782214?text=${encodeURIComponent(
                  `Hi LLM Axis, I have completed the payment for ${eventName}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-semibold transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Join WhatsApp Updates Group</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="w-full border border-slate-200 text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-5 pr-6">
              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
                {badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                {subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handlePayNow} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-slate-200 bg-slate-50/70 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full border border-slate-200 bg-slate-50/70 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.country}
                  onChange={handleCountryChange}
                  className="w-full border border-slate-200 bg-slate-50/70 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition cursor-pointer"
                >
                  {countries.map((c) => (
                    <option key={`${c.code}-${c.name}`} value={c.name}>
                      {c.name} ({c.dial})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Dynamic dial code prefix based on selected country */}
                  <div className="flex items-center justify-center border border-slate-200 bg-purple-50 rounded-xl px-3 text-sm font-semibold text-purple-700 min-w-[68px] select-none">
                    {form.dialCode}
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="flex-1 border border-slate-200 bg-slate-50/70 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {pricing?.includesGst ? (
                <p className="text-[11px] text-slate-500 text-center">
                  Includes 18% GST for India
                </p>
              ) : null}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl text-sm font-semibold shadow hover:shadow-md transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {loading
                      ? "Connecting..."
                      : pricing?.formattedPrice
                        ? `Pay ${pricing.formattedPrice}`
                        : "Pay Now"}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secured by Razorpay · 256-bit SSL Encryption</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
