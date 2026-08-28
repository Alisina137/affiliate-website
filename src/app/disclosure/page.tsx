// src/app/disclosure/page.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How we earn money through affiliate relationships",
}

export default function DisclosurePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Affiliate Disclosure</h1>
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6 text-gray-600">
          <section>
            <p className="text-lg font-medium">Transparency is important to us.</p>
            <p className="mt-2">
              We believe in being upfront about how we earn money and maintain our website.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Affiliate Relationships</h2>
            <p>
              Some of the links on this website are affiliate links. This means that if you 
              click on a link and make a purchase, we may earn a commission at no extra cost to you.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Promise</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We only recommend products we believe in</li>
              <li>Our reviews and opinions are always honest</li>
              <li>We clearly identify sponsored content</li>
              <li>Your trust is more important than commissions</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">How It Works</h2>
            <p>
              When you click on an affiliate link and make a purchase, the merchant pays us 
              a small commission. This helps us continue creating valuable content for you.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Questions?</h2>
            <p>
              If you have any questions about our affiliate relationships, please 
              <a href="/contact" className="text-blue-600 hover:underline"> contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
