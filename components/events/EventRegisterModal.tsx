"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, MessageCircle, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { event as trackFbEvent } from "@/lib/fpixel";
import { countries } from "@/lib/countries";

export { countries };

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
    if (typeof window !== "undefined" && (window as any).Razorpay) {
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

  const eventPrice = process.env.NEXT_PUBLIC_EVENT_PRICE || "206";
  const eventCurrency = process.env.NEXT_PUBLIC_EVENT_CURRENCY || "USD";
  const defaultFormattedPrice = eventCurrency === "USD" ? `$${eventPrice}` : `₹${eventPrice}`;
  const defaultKeyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    "rzp_live_Tl1rwsxDyqo61i";

  // Track ViewContent event when registration modal opens
  useEffect(() => {
    if (isOpen) {
      trackFbEvent("ViewContent", {
        content_name: eventName,
        content_category: "Registration",
        currency: eventCurrency,
        value: Number(eventPrice) || 1,
      });
    }
  }, [isOpen, eventCurrency, eventPrice, eventName]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find((c) => c.name === e.target.value);
    setForm((prev) => ({
      ...prev,
      country: e.target.value,
      dialCode: selected?.dial ?? "+91",
    }));
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
      const amountFormatted = defaultFormattedPrice;

      // Track Lead and InitiateCheckout in Meta Pixel
      trackFbEvent("Lead", {
        content_name: eventName,
        content_category: "Registration",
        currency: eventCurrency,
        value: Number(eventPrice) || 1,
      });

      trackFbEvent("InitiateCheckout", {
        content_name: eventName,
        currency: eventCurrency,
        value: Number(eventPrice) || 1,
        num_items: 1,
      });

      // 1. Immediately log lead as Pending in Google Sheet
      sendToGoogleSheet({
        name: form.name.trim(),
        email: form.email.trim(),
        country: form.country,
        phone: formattedPhone,
        paymentStatus: "Pending",
        amount: amountFormatted,
        event: eventName,
      });

      // 2. Load Razorpay Checkout SDK
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      }

      // 3. Attempt server order creation if backend endpoint is available (safe fallback for static deployments)
      let backendKeyId = defaultKeyId;
      let backendOrderId: string | undefined = undefined;
      let orderAmount = Math.round((Number(eventPrice) || 206) * 100);

      try {
        const res = await fetch("/api/events/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            country: form.country,
            phone: formattedPhone,
            event: eventName,
          }),
        });

        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const data = await res.json();
            if (data.success && data.orderId) {
              backendOrderId = data.orderId;
              backendKeyId = data.keyId || backendKeyId;
              if (data.amount) orderAmount = data.amount;
            }
          }
        }
      } catch (backendErr) {
        console.warn("Backend order creation skipped, using client gateway:", backendErr);
      }

      const itemDescription = description || `${eventName} - LLM Axis`;

      const options: any = {
        key: backendKeyId,
        amount: orderAmount,
        currency: eventCurrency,
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
        handler: async function (response: any) {
          try {
            setLoading(true);

            // Log Paid status directly to Google Sheet
            await sendToGoogleSheet({
              name: form.name.trim(),
              email: form.email.trim(),
              country: form.country,
              phone: formattedPhone,
              paymentStatus: "Paid",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || backendOrderId || "N/A",
              amount: amountFormatted,
              event: eventName,
            });

            // Track Purchase in Meta Pixel
            trackFbEvent("Purchase", {
              content_name: eventName,
              currency: eventCurrency,
              value: Number(eventPrice) || 1,
              transaction_id: response.razorpay_payment_id,
            });

            // Optional verification call to backend if present
            if (response.razorpay_signature && backendOrderId) {
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
          } catch (err: any) {
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
              orderId: backendOrderId || "N/A",
              amount: amountFormatted,
              event: eventName,
            });
          },
        },
      };

      if (backendOrderId) {
        options.order_id = backendOrderId;
      }

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", function (response: any) {
        setLoading(false);
        setError(`Payment failed: ${response.error?.description || "Transaction declined"}`);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error("Payment initialization error:", err);
      setError(err.message || "Unable to open payment window. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setPaymentInfo(null);
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
                  <span>{loading ? "Connecting..." : "Pay Now"}</span>
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
