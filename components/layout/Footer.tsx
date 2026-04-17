import Link from "next/link";


const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-semibold">llmaxis</h2>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Building future-ready professionals through AI-focused education
              and real-world learning experiences.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/learning">LLM AXIS Learning</Link></li>
              <li><Link href="/hire">Hire Talent</Link></li>
              <li><Link href="/contact">Contact US</Link></li>
              <Link href="/terms-and-conditions">Terms & Conditions</Link><br />
              <Link href="/refund-policy">Refund Policy</Link>
              
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#">AI Bootcamp</Link></li>
              <li><Link href="#">Full Stack + AI</Link></li>
              <li><Link href="#">Data Science</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-400">
              official@llmaxis.in
            </p>
            <p className="text-sm text-gray-400 mt-2">
              India
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} llmaxis. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms-and-condition">Privacy Policy</Link>
            <Link href="/refund-policy">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;