// src/app/about/page.tsx
import { Metadata } from "next"
import { Users, Shield, Star, TrendingUp, Award, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission to help you find the best products",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-gray-600">
            Helping you make informed purchasing decisions
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to help consumers make informed purchasing decisions by providing 
            honest, thorough, and unbiased product reviews, comparisons, and buying guides. 
            We believe that everyone deserves access to reliable information to find the best 
            products for their needs.
          </p>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Honesty & Transparency</h3>
                <p className="text-sm text-gray-500">We always disclose affiliate relationships and provide honest opinions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Quality Content</h3>
                <p className="text-sm text-gray-500">We create in-depth, well-researched content that helps you make decisions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">User-First Approach</h3>
                <p className="text-sm text-gray-500">Everything we do is designed to help our users find the best products.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Continuous Improvement</h3>
                <p className="text-sm text-gray-500">We constantly update our content to provide the most current information.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-500">Founder & Editor</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="font-semibold">Jane Smith</h3>
              <p className="text-sm text-gray-500">Product Reviewer</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="font-semibold">Mike Johnson</h3>
              <p className="text-sm text-gray-500">Content Strategist</p>
            </div>
          </div>
        </div>

        {/* Why Trust Us */}
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold">Why Trust Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-blue-800">Expert Reviews</h3>
              <p className="text-sm text-blue-700">Our team tests and reviews products thoroughly.</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">Unbiased Recommendations</h3>
              <p className="text-sm text-blue-700">We provide honest opinions, not influenced by brands.</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">Up-to-Date Information</h3>
              <p className="text-sm text-blue-700">We regularly update our content to reflect the latest products.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
