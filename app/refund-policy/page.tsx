export const metadata = {
  title: "Refund & Cancellation Policy | LLM Axis",
  description:
    "Understand the refund, cancellation, and transfer policies for LLM Axis Private Limited training programs.",
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 text-sm leading-relaxed">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Refund &amp; Cancellation Policy
      </h1>

      <p className="text-gray-600 mb-6 font-medium">
        <strong>Effective Date:</strong> 03-09-2026
      </p>

      <p className="mb-6 text-base text-gray-700">
        At LLM Axis Private Limited, we are committed to providing high-quality
        training and learning experiences to all our participants. We understand
        that every learner has different expectations and learning requirements.
        Therefore, we offer a limited refund option during the initial period of
        the program.
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            1. Refund Eligibility – Training Programs
          </h2>
          <p className="mb-3">
            If you are not satisfied with the classes or feel that the program
            does not meet your expectations, you may request a refund within the
            first 7 calendar days from the date of commencement of your classes.
          </p>
          <p className="mb-3">
            Eligible participants will receive a refund of 80% of the program fee
            paid, excluding applicable taxes.
          </p>
          <p>
            The remaining 20% of the program fee will be retained towards
            administrative, enrollment, payment processing, and initial program
            delivery costs.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            2. How to Request a Refund
          </h2>
          <p className="mb-2">To request a refund, participants must:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>
              Send an email to{" "}
              <a
                href="mailto:team@llmaxis.in"
                className="text-blue-600 hover:underline font-medium"
              >
                team@llmaxis.in
              </a>
            </li>
            <li>
              Submit the refund request within the first 7 calendar days from the
              start date of the classes
            </li>
            <li>
              Clearly mention the registered name, email address, program
              enrolled in, and reason for requesting the refund.
            </li>
          </ul>
          <p>
            Requests submitted after the 7-day period will generally not be
            eligible for a refund.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            3. Refund Processing
          </h2>
          <p className="mb-2">
            Once the refund request is received, LLM Axis Private Limited will
            review the request and confirm eligibility.
          </p>
          <p className="mb-2">For approved requests:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>80% of the program fee will be refunded.</li>
            <li>
              Applicable taxes, including GST or other government-mandated
              taxes, are non-refundable.
            </li>
            <li>
              Any payment gateway or transaction charges, where applicable, may
              also be excluded from the refundable amount.
            </li>
            <li>
              Refunds will generally be processed within 10–15 working days after
              approval.
            </li>
            <li>
              The refund will be made to the original payment method used during
              enrollment, wherever technically possible.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            4. Cancellation After the Refund Period
          </h2>
          <p className="mb-2">
            Once the 7-day refund period has expired, no refunds will generally
            be provided, including in cases where a participant:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Stops attending classes</li>
            <li>Misses classes due to personal or professional commitments</li>
            <li>Changes their mind about the program</li>
            <li>Is unable to attend the remaining sessions</li>
            <li>Does not complete assignments or coursework</li>
            <li>Is unable to attend due to a change in personal schedule</li>
          </ul>
          <p>
            Participants are encouraged to review the program details, schedule,
            curriculum, and other available information before enrolling.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            5. Duplicate Transactions
          </h2>
          <p>
            If a participant is charged more than once for the same enrollment
            due to a duplicate transaction, the additional/duplicate payment
            will be eligible for a refund after verification.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            6. Technical Issues
          </h2>
          <p className="mb-2">
            If a participant experiences a verified technical issue that prevents
            them from accessing the program, classes, or other essential learning
            resources, they should immediately contact{" "}
            <a
              href="mailto:team@llmaxis.in"
              className="text-blue-600 hover:underline font-medium"
            >
              team@llmaxis.in
            </a>
            .
          </p>
          <p>
            LLM Axis Private Limited will review the issue and, where
            appropriate, provide a suitable resolution, which may include access
            restoration, an alternative session, or a refund where applicable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            7. Transfer or Rescheduling
          </h2>
          <p className="mb-2">
            Where possible, participants who are unable to continue with their
            current batch may request a transfer to another available batch,
            subject to availability and the terms communicated by LLM Axis
            Private Limited.
          </p>
          <p>
            Batch transfers are not guaranteed and may be subject to additional
            conditions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            8. Important Note
          </h2>
          <p>
            By completing the enrollment and payment process, the participant
            acknowledges and agrees to this Refund &amp; Cancellation Policy.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-700">
          For all refund-related queries and requests, please contact:
        </p>
        <p className="mt-2 text-base font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl">📧</span>
          <a
            href="mailto:team@llmaxis.in"
            className="text-blue-600 hover:underline"
          >
            team@llmaxis.in
          </a>
        </p>
      </div>
    </div>
  );
}