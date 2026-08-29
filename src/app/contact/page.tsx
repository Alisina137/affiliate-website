// src/app/contact/page.tsx
import { Metadata } from "next"
import { Mail, MapPin, Clock } from "lucide-react"
import { ContactForm } from "@/components/contact/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Have a question or suggestion? We&apos;d love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-gray-500">support@example.com</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold">Response Time</h3>
            <p className="text-sm text-gray-500">Usually within 24-48 hours</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold">Location</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
