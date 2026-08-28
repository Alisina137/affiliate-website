// src/app/privacy/page.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we handle your data and protect your privacy",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Information We Collect</h2>
            <p>We collect information you provide directly, such as when you sign up for our newsletter or contact us.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, send updates, and respond to inquiries.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Cookies</h2>
            <p>We use cookies to enhance your experience and analyze site traffic.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us</h2>
            <p>If you have questions about this policy, please contact us at privacy@example.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
