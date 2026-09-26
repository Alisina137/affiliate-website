import { extractArticle } from "./article-extractor"
import { safeFetchHtml } from "./safe-fetch"

const STOP_WORDS = new Set(["the","and","for","that","with","this","from","your","you","are","was","were","have","has","had","but","not","all","can","our","their","they","its","into","than","then","when","what","how","why","who","which","will","would","should","could","about","more","most","some","any","each","also","use","using","used","best","top"])

function words(text: string) {
  return text.toLowerCase().match(/[a-z0-9][a-z0-9'-]{2,}/g) || []
}

function meaningfulTerms(text: string) {
  const counts = new Map<string, number>()
  for (const word of words(text)) if (!STOP_WORDS.has(word)) counts.set(word, (counts.get(word) || 0) + 1)
  return [...counts.entries()].sort((a,b) => b[1]-a[1]).map(([term,count]) => ({ term, count }))
}

function headings(html: string) {
  return [...html.matchAll(/<h([2-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean).slice(0, 40)
}

function observableSignals(html: string, content: string) {
  return {
    wordCount: words(content).length,
    headings: headings(html),
    hasTable: /<table\b/i.test(html),
    hasFaqLanguage: /\b(faq|frequently asked questions|questions and answers)\b/i.test(content),
    hasProsCons: /\b(pros?\b|cons?\b|advantages?\b|disadvantages?\b)/i.test(content),
    hasBuyingGuide: /\b(buying guide|buyer'?s guide|what to look for|how to choose)\b/i.test(content),
    hasComparisonLanguage: /\b(compare|comparison|versus|\bvs\.?\b|alternative)/i.test(content),
  }
}

export type CompetitorObservation = {
  requestedUrl: string
  finalUrl: string
  title: string
  signals: ReturnType<typeof observableSignals>
  topTerms: Array<{ term: string; count: number }>
}

export type CompetitorIntelligence = {
  source: "MANUAL_COMPETITOR_URLS"
  observedAt: string
  competitors: CompetitorObservation[]
  gaps: Array<{ type: string; label: string; evidence: string }>
  notes: string[]
}

export async function analyzeCompetitors(articleContent: string, urls: string[]): Promise<CompetitorIntelligence> {
  const unique = [...new Set(urls.map((url) => url.trim()).filter(Boolean))].slice(0, 5)
  if (!unique.length) throw new Error("Add at least one competitor URL.")

  const ownTerms = new Set(meaningfulTerms(articleContent).map((item) => item.term))
  const competitors: CompetitorObservation[] = []

  for (const requestedUrl of unique) {
    const response = await safeFetchHtml(requestedUrl)
    const extracted = extractArticle(response.html)
    competitors.push({
      requestedUrl,
      finalUrl: response.finalUrl,
      title: extracted.title,
      signals: observableSignals(response.html, extracted.content),
      topTerms: meaningfulTerms(extracted.content).slice(0, 20),
    })
  }

  const gaps: CompetitorIntelligence["gaps"] = []
  const commonTerms = new Map<string, number>()
  for (const competitor of competitors) {
    for (const item of competitor.topTerms) commonTerms.set(item.term, (commonTerms.get(item.term) || 0) + 1)
  }
  for (const [term, count] of [...commonTerms.entries()].sort((a,b) => b[1]-a[1])) {
    if (!ownTerms.has(term) && count >= Math.min(2, competitors.length)) {
      gaps.push({ type: "TOPIC_TERM", label: term, evidence: `Observed among prominent terms in ${count} of ${competitors.length} supplied competitor page(s), but not in your article.` })
    }
    if (gaps.filter((gap) => gap.type === "TOPIC_TERM").length >= 10) break
  }

  const own = observableSignals("", articleContent)
  const structural: Array<[keyof typeof own, string]> = [
    ["hasTable","Comparison/data table"], ["hasFaqLanguage","FAQ coverage"], ["hasProsCons","Pros and cons"],
    ["hasBuyingGuide","Buying-guide section"], ["hasComparisonLanguage","Explicit comparison language"],
  ]
  for (const [key,label] of structural) {
    const count = competitors.filter((item) => Boolean(item.signals[key])).length
    if (!own[key] && count >= sharedThreshold) gaps.push({ type: "STRUCTURE", label, evidence: `Observed in ${count} of ${competitors.length} supplied competitor page(s); not detected in your stored article text.` })
  }

  return {
    source: "MANUAL_COMPETITOR_URLS",
    observedAt: new Date().toISOString(),
    competitors,
    gaps: gaps.slice(0, 15),
    notes: [
      "These are observations from URLs you supplied, not a live SERP ranking.",
      "No search volume, traffic, authority, revenue, conversion rate, or ranking position is inferred.",
      "Content gaps are editorial review prompts, not recommendations to copy competitor wording.",
    ],
  }
}
