// src/components/newsletter/NewsletterSignup.tsx
"use client";

import { useState } from "react";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface NewsletterSignupProps {
  variant?: "default" | "compact" | "footer";
  source?: string;
}

export function NewsletterSignup({
  variant = "default",
  source = "website",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage(data.message || "Successfully subscribed!");
      setEmail("");
      setName("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      );
    }
  };

  if (variant === "compact") {
    return (
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-5 w-5" />
          <h3 className="font-semibold">Newsletter</h3>
        </div>
        <p className="text-sm text-blue-100 mb-3">
          Get the latest reviews and guides.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-1 px-3 py-2 text-sm rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 text-sm bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
        {status === "success" && (
          <p className="text-xs text-green-200 mt-2">{message}</p>
        )}
        {status === "error" && (
          <p className="text-xs text-red-200 mt-2">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-4">
          <Mail className="h-4 w-4" />
          <span className="text-sm font-medium">Newsletter</span>
          <Sparkles className="h-4 w-4" />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          Subscribe to Our Newsletter
        </h3>
        <p className="text-blue-100 mb-6 max-w-lg mx-auto">
          Get the latest reviews, comparisons, and buying guides delivered
          straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 min-w-30"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>

          {status === "success" && (
            <div className="flex items-center justify-center gap-2 text-green-200 bg-green-900/30 rounded-lg px-4 py-2">
              <CheckCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center justify-center gap-2 text-red-200 bg-red-900/30 rounded-lg px-4 py-2">
              <AlertCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}

          <p className="text-xs text-blue-200 opacity-80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  );
}
