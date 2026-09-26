export type AnalysisCategory = "SEO" | "CONTENT" | "INTENT" | "AFFILIATE" | "CONVERSION" | "TECHNICAL"
export type IssueSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

export type AnalysisIssue = {
  category: AnalysisCategory
  severity: IssueSeverity
  title: string
  description: string
  suggestion: string
  evidence?: Record<string, string | number | boolean>
}

export type ArticleAnalysisInput = {
  title: string
  content: string
  targetQuery: string
  sourceUrl?: string | null
}

const clamp = (score: number) => Math.max(0, Math.min(100, Math.round(score)))
const words = (value: string) => value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
const occurrences = (text: string, query: string) => {
  if (!query.trim()) return 0
  return text.toLowerCase().split(query.toLowerCase()).length - 1
}

export function analyzeArticle(input: ArticleAnalysisInput) {
  const contentWords = words(input.content)
  const wordCount = contentWords.length
  const paragraphs = input.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const sentences = input.content.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
  const avgSentenceWords = sentences.length ? wordCount / sentences.length : wordCount
  const target = input.targetQuery.trim().toLowerCase()
  const titleHasKeyword = input.title.toLowerCase().includes(target)
  const keywordOccurrences = occurrences(input.content, target)
  const keywordDensity = wordCount ? (keywordOccurrences * Math.max(words(target).length, 1) / wordCount) * 100 : 0

  const affiliateTerms = (input.content.match(/\b(buy|price|deal|discount|check price|shop|amazon|affiliate|commission)\b/gi) ?? []).length
  const ctaTerms = (input.content.match(/\b(check price|buy now|learn more|view deal|get started|try now|shop now|see price)\b/gi) ?? []).length
  const comparisonTerms = (input.content.match(/\b(vs\.?|versus|compare|comparison|pros|cons|best for)\b/gi) ?? []).length
  const questionTerms = (input.content.match(/\b(how|what|why|when|which|who)\b/gi) ?? []).length
  const commercialTerms = (input.content.match(/\b(best|review|reviews|top|compare|comparison|alternative|alternatives|worth|price)\b/gi) ?? []).length
  const transactionalTerms = (input.content.match(/\b(buy|deal|discount|coupon|order|shop|price)\b/gi) ?? []).length

  const issues: AnalysisIssue[] = []
  const add = (issue: AnalysisIssue) => issues.push(issue)

  let seoScore = 100
  if (!titleHasKeyword) {
    seoScore -= 22
    add({ category: "SEO", severity: "HIGH", title: "Target keyword is missing from the title", description: "The saved article title does not contain the exact target keyword.", suggestion: "Use the target keyword naturally in the title when it accurately describes the page.", evidence: { targetQuery: input.targetQuery } })
  }
  if (keywordOccurrences === 0) {
    seoScore -= 25
    add({ category: "SEO", severity: "HIGH", title: "Target keyword is absent from the content", description: "The target keyword was not found in the article body.", suggestion: "Cover the target topic explicitly and use the keyword naturally where relevant.", evidence: { occurrences: 0 } })
  } else if (keywordDensity > 4) {
    seoScore -= 12
    add({ category: "SEO", severity: "MEDIUM", title: "Target keyword may be overused", description: "Exact-match usage is unusually frequent relative to article length.", suggestion: "Reduce repetitive exact-match phrasing and use natural topic variations.", evidence: { keywordDensity: Number(keywordDensity.toFixed(2)) } })
  }
  if (input.title.length < 30 || input.title.length > 70) {
    seoScore -= 10
    add({ category: "SEO", severity: "LOW", title: "Title length needs review", description: "The title is outside the practical 30–70 character review range used by this analyzer.", suggestion: "Keep the title concise and descriptive; verify the final search snippet separately.", evidence: { titleCharacters: input.title.length } })
  }

  let contentScore = 100
  if (wordCount < 600) {
    contentScore -= 30
    add({ category: "CONTENT", severity: "HIGH", title: "Article has limited content depth", description: "The article contains fewer than 600 words, which can limit its ability to answer a broad affiliate query.", suggestion: "Expand only where useful: answer important buyer questions, trade-offs, selection criteria, and product context.", evidence: { wordCount } })
  } else if (wordCount < 1000) {
    contentScore -= 12
    add({ category: "CONTENT", severity: "MEDIUM", title: "Content depth may be limited", description: "The article is relatively short for a commercial research page.", suggestion: "Check whether important buyer questions and decision criteria are missing.", evidence: { wordCount } })
  }
  if (avgSentenceWords > 28) {
    contentScore -= 15
    add({ category: "CONTENT", severity: "MEDIUM", title: "Sentences are difficult to scan", description: "Average sentence length is high, which may reduce readability.", suggestion: "Break long sentences into clearer, direct statements.", evidence: { averageSentenceWords: Number(avgSentenceWords.toFixed(1)) } })
  }
  if (paragraphs.length < 4 && wordCount > 500) {
    contentScore -= 12
    add({ category: "CONTENT", severity: "MEDIUM", title: "Article structure is dense", description: "Long content has very few paragraph breaks.", suggestion: "Split dense sections into shorter paragraphs and logical sections.", evidence: { paragraphs: paragraphs.length } })
  }

  const inferredIntent = transactionalTerms >= 3 ? "TRANSACTIONAL" : commercialTerms >= 3 || comparisonTerms >= 2 ? "COMMERCIAL_INVESTIGATION" : questionTerms >= 3 ? "INFORMATIONAL" : "MIXED"
  let intentScore = 80
  if (commercialTerms + transactionalTerms + questionTerms >= 4) intentScore += 15
  if (target.match(/\b(best|review|vs|compare|price|buy|alternative)\b/) && commercialTerms + transactionalTerms < 2) {
    intentScore -= 30
    add({ category: "INTENT", severity: "HIGH", title: "Commercial target intent is weakly supported", description: "The target keyword signals buyer research, but the article has few commercial decision signals.", suggestion: "Add decision-focused coverage such as comparisons, trade-offs, pricing context, or who each option is best for.", evidence: { inferredIntent } })
  }

  let affiliateScore = 65
  if (affiliateTerms > 0) affiliateScore += 15
  if (comparisonTerms > 0) affiliateScore += 10
  if (ctaTerms > 0) affiliateScore += 10
  if (affiliateTerms === 0 && comparisonTerms === 0) {
    affiliateScore -= 20
    add({ category: "AFFILIATE", severity: "MEDIUM", title: "Affiliate decision support is limited", description: "The content contains few detectable buying or comparison signals.", suggestion: "Where appropriate, add buyer-oriented comparisons, product trade-offs, and transparent next steps.", evidence: { buyingSignals: affiliateTerms, comparisonSignals: comparisonTerms } })
  }

  let conversionScore = 60
  if (ctaTerms > 0) conversionScore += 25
  if (comparisonTerms > 0) conversionScore += 10
  if (ctaTerms === 0) {
    conversionScore -= 20
    add({ category: "CONVERSION", severity: "HIGH", title: "No clear call to action detected", description: "The analyzer did not detect common action-oriented phrases in the article.", suggestion: "Add clear, relevant calls to action near decision points without making unsupported promises.", evidence: { detectedCallsToAction: 0 } })
  }

  let technicalScore = 90
  if (!input.sourceUrl) {
    technicalScore -= 10
    add({ category: "TECHNICAL", severity: "LOW", title: "No source URL is attached", description: "URL-level technical signals cannot be evaluated from pasted content alone.", suggestion: "Attach the public article URL when available for URL-level checks.", evidence: { sourceUrlAvailable: false } })
  } else {
    try {
      const url = new URL(input.sourceUrl)
      if (url.pathname.length > 100) {
        technicalScore -= 8
        add({ category: "TECHNICAL", severity: "LOW", title: "Source URL path is long", description: "The source URL has a long path that may be harder to read and share.", suggestion: "If the publishing system allows it, prefer a concise descriptive slug.", evidence: { pathCharacters: url.pathname.length } })
      }
    } catch {
      technicalScore -= 20
    }
  }

  const scores = {
    seo: clamp(seoScore),
    content: clamp(contentScore),
    intent: clamp(intentScore),
    affiliate: clamp(affiliateScore),
    conversion: clamp(conversionScore),
    technical: clamp(technicalScore),
  }
  const overall = clamp((scores.seo + scores.content + scores.intent + scores.affiliate + scores.conversion + scores.technical) / 6)
  const severityOrder: Record<IssueSeverity, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  return {
    overallScore: overall,
    scores,
    issues,
    summary: `Overall score ${overall}/100 based on deterministic on-page signals. Review each issue in context before changing published content.`,
    data: {
      wordCount,
      paragraphs: paragraphs.length,
      averageSentenceWords: Number(avgSentenceWords.toFixed(1)),
      keywordOccurrences,
      keywordDensity: Number(keywordDensity.toFixed(2)),
      inferredIntent,
      buyingSignals: affiliateTerms,
      comparisonSignals: comparisonTerms,
      callsToAction: ctaTerms,
    },
  }
}
