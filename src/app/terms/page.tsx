// src/app/terms/page.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using our website",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Acceptance of Terms</h2>
            <p>By using our website, you agree to these terms and conditions.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Intellectual Property</h2>
            <p>All content on this website is owned by us and protected by copyright laws.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Disclaimer</h2>
            <p>We provide information for general purposes only and are not liable for any damages.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact</h2>
            <p>For questions about these terms, contact us at legal@example.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
