// src/components/seo/SEOHead.tsx
import { Metadata } from "next";
import { SocialMetaTags } from "./SocialMeta";
import { generateSocialMetadata } from "./SocialMeta";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article"; // Removed "product" - not valid for Open Graph
  siteName?: string;
  twitterCard?: "summary" | "summary_large_image";
  twitterSite?: string;
  twitterCreator?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
}

export function generateSEOHead({
  title,
  description,
  image,
  url,
  type = "website",
  siteName = "Affiliate Platform",
  twitterCard = "summary_large_image",
  twitterSite = "@affiliateplatform",
  twitterCreator,
  keywords,
  canonicalUrl,
  noIndex = false,
}: SEOHeadProps): Metadata {
  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.join(", "),
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    ...generateSocialMetadata({
      title,
      description,
      image,
      url: url || canonicalUrl,
      type: type || "website",
      siteName,
      twitterCard,
      twitterSite,
      twitterCreator,
    }),
  };

  return metadata;
}

export function SEOHead({
  title,
  description,
  image,
  url,
  type,
  siteName,
  twitterCard,
  twitterSite,
  twitterCreator,
}: SEOHeadProps) {
  return (
    <>
      <SocialMetaTags
        title={title}
        description={description}
        image={image}
        url={url}
        type={type || "website"}
        siteName={siteName}
        twitterCard={twitterCard}
        twitterSite={twitterSite}
        twitterCreator={twitterCreator}
      />
    </>
  );
}
