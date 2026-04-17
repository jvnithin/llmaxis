export const metadata = {
  title: "Terms and Conditions | LLM Axis",
  description:
    "Read the terms and conditions for using LLM Axis services, programs, and website.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-sm leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p><strong>Effective Date:</strong> 19/03/2026</p>

      <p className="mt-4">
        Welcome to LLM Axis Private Limited (“we”, “us”, “our”). By using our website
        https://llmaxis.in or purchasing our products/programs, you agree to the following terms:
      </p>

      <ul className="mt-4 space-y-2 list-disc pl-5">
        <li>You must be 18+ or use under guardian supervision.</li>
        <li>Use our website only for lawful purposes.</li>
        <li>We sell physical products and digital programs. Prices may change anytime.</li>
        <li>Payments are processed securely via online systems.</li>
        <li>Delivery timelines are estimates and may vary.</li>
        <li>All content and materials belong to LLM Axis Private Limited.</li>
        <li>Refunds are governed by our Refund Policy.</li>
        <li>We are not liable for indirect or consequential losses.</li>
        <li>Terms may change anytime without notice.</li>
      </ul>

      <p className="mt-6">
        For queries, contact: <strong>contact@llmaxis.in</strong>
      </p>
    </main>
  );
}