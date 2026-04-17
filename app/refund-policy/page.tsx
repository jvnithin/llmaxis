export const metadata = {
  title: "Refund & Cancellation Policy | LLM Axis",
  description:
    "Understand refund, return, and cancellation policies for LLM Axis programs and products.",
};

export default function RefundPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-sm leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>

      <h2 className="font-semibold mt-4">Services</h2>
      <p className="mt-2">
        Payments are non-refundable except for duplicate transactions or verified technical issues.
        Refund requests must be made on the same day via contact@llmaxis.in.
      </p>

      <h2 className="font-semibold mt-4">Products</h2>
      <p className="mt-2">
        Returns or replacements are accepted within 7 days only if the product is damaged,
        defective, or incorrect. Refunds are processed within 10–15 working days.
      </p>

      <h2 className="font-semibold mt-4">Cancellations</h2>
      <p className="mt-2">
        No cancellations once the service has started or product is dispatched.
      </p>

      <p className="mt-6">
        For support: <strong>contact@llmaxis.in</strong>
      </p>
    </main>
  );
}