// src/components/seo/SocialMeta.tsx
import { Metadata } from "next"

export interface SocialMetaProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: "website" | "article"
  siteName?: string
  twitterCard?: "summary" | "summary_large_image"
  twitterSite?: string
  twitterCreator?: string
  fbAppId?: string
}

export function generateSocialMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  siteName = "Affiliate Platform",
  twitterCard = "summary_large_image",
  twitterSite = "@affiliateplatform",
  twitterCreator,
  fbAppId,
}: SocialMetaProps): Metadata {
  const metadata: Metadata = {
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      locale: "en_US",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: image ? [image] : undefined,
      site: twitterSite,
      creator: twitterCreator || twitterSite,
    },
  }

  if (fbAppId) {
    metadata.openGraph = {
      ...metadata.openGraph,
      fbAppId,
    } as any
  }

  return metadata
}

export function SocialMetaTags({
  title,
  description,
  image,
  url,
  type,
  siteName,
  twitterCard,
  twitterSite,
  twitterCreator,
}: SocialMetaProps) {
  const metaTags = []

  // Open Graph
  if (title) metaTags.push(<meta key="og:title" property="og:title" content={title} />)
  if (description) metaTags.push(<meta key="og:description" property="og:description" content={description} />)
  if (image) metaTags.push(<meta key="og:image" property="og:image" content={image} />)
  if (url) metaTags.push(<meta key="og:url" property="og:url" content={url} />)
  if (type) metaTags.push(<meta key="og:type" property="og:type" content={type} />)
  if (siteName) metaTags.push(<meta key="og:site_name" property="og:site_name" content={siteName} />)

  // Twitter
  if (twitterCard) metaTags.push(<meta key="twitter:card" name="twitter:card" content={twitterCard} />)
  if (twitterSite) metaTags.push(<meta key="twitter:site" name="twitter:site" content={twitterSite} />)
  if (twitterCreator) metaTags.push(<meta key="twitter:creator" name="twitter:creator" content={twitterCreator} />)
  if (title) metaTags.push(<meta key="twitter:title" name="twitter:title" content={title} />)
  if (description) metaTags.push(<meta key="twitter:description" name="twitter:description" content={description} />)
  if (image) metaTags.push(<meta key="twitter:image" name="twitter:image" content={image} />)

  return <>{metaTags}</>
}
