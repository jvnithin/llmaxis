"use client";

import { useState } from "react";
import { X, CheckCircle2, MessageCircle, Lock, ShieldCheck, AlertCircle } from "lucide-react";

export const countries = [
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

interface EventRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function EventRegisterModal({
  isOpen,
  onClose,
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

  const eventPrice = process.env.NEXT_PUBLIC_EVENT_PRICE || "1";
  const eventCurrency = process.env.NEXT_PUBLIC_EVENT_CURRENCY || "USD";
  const defaultFormattedPrice = eventCurrency === "USD" ? `$${eventPrice}` : `₹${eventPrice}`;

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
      // 1. Create order on backend (which also stores form lead in Google Sheet as Pending)
      const formattedPhone = `${form.dialCode} ${form.phone}`;
      const res = await fetch("/api/events/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          country: form.country,
          phone: formattedPhone,
        }),
      });

      const orderData = await res.json();

      if (!orderData.success || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to initialize payment.");
      }

      // 2. Load Razorpay Checkout SDK
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "LLM Axis",
        description: "Beyond ChatGPT: Generative & Agentic AI Masterclass",
        image: "/logo.jpeg",
        order_id: orderData.orderId,
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
            // 3. Verify payment signature on backend and update Google Sheet to Paid
            const verifyRes = await fetch("/api/events/verify-payment", {
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
                amount: orderData.priceFormatted || defaultFormattedPrice,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setPaymentInfo({
                paymentId: response.razorpay_payment_id,
                amount: orderData.priceFormatted || defaultFormattedPrice,
              });
              setSubmitted(true);
            } else {
              setError("Payment verification failed. If your account was debited, please contact us on WhatsApp.");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            setError("Error confirming payment status. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            // Silently log dismissed state in background without showing user warning banners
            fetch("/api/events/log-dismissed", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: form.name,
                email: form.email,
                country: form.country,
                phone: formattedPhone,
                orderId: orderData.orderId,
              }),
            }).catch(() => {});
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", function (response: any) {
        setLoading(false);
        setError(`Payment failed: ${response.error.description || "Transaction declined"}`);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error("Payment initialization error:", err);
      setError(err.message || "Something went wrong while connecting to Razorpay.");
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
                You are registered for <span className="font-semibold text-purple-700">Beyond ChatGPT</span>.
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
                href="https://wa.me/918309782214?text=Hi%20LLM%20Axis,%20I%20have%20completed%20the%20payment%20for%20the%20Beyond%20ChatGPT%20Masterclass."
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
                className="w-full border border-slate-200 text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-semibold transition"
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
                Live Masterclass
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Register for Event
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Enter your details to proceed to secure Razorpay checkout.
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
