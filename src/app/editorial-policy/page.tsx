// src/app/editorial-policy/page.tsx
import { Metadata } from "next"
import { Shield, CheckCircle, FileText, Users, Heart, PenTool } from "lucide-react"

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "Our editorial standards and how we evaluate products",
}

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Editorial Policy</h1>
          <p className="text-xl text-gray-600">
            How we evaluate, review, and recommend products
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="text-gray-600 leading-relaxed">
            At [Your Site Name], we are committed to providing honest, thorough, and unbiased 
            product reviews and recommendations. Our editorial team follows strict guidelines 
            to ensure every piece of content meets our quality standards.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">How We Evaluate Products</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <PenTool className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Research & Analysis</h3>
                <p className="text-sm text-gray-500">
                  We thoroughly research each product category, analyzing specifications, 
                  features, and user feedback to understand what matters most to consumers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">User Experience</h3>
                <p className="text-sm text-gray-500">
                  We evaluate products based on real user experiences, considering factors 
                  like ease of use, performance, and value for money.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Testing & Verification</h3>
                <p className="text-sm text-gray-500">
                  When possible, we test products hands-on to verify claims and provide 
                  authentic insights. We also verify information from multiple sources.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Content Standards</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>All reviews and guides are based on thorough research and analysis.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>We clearly disclose affiliate relationships and sponsored content.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>We update content regularly to maintain accuracy and relevance.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>We correct errors promptly and transparently.</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-100 p-8">
          <h2 className="text-2xl font-bold mb-2">Affiliate Disclosure</h2>
          <p className="text-gray-600">
            We participate in affiliate marketing programs. When you click on affiliate 
            links and make a purchase, we may earn a commission at no extra cost to you. 
            This helps support our work and keep our content free.
          </p>
        </div>
      </div>
    </div>
  )
}
