// src/services/ai-generation.service.ts (full updated file)
export interface GenerationRequest {
  contentType: string
  topic: string
  category?: string
  products?: string[]
  audience?: string
  keywords?: string[]
  instructions?: string
  tone?: string
  depth?: string
}

export interface GenerationResponse {
  success: boolean
  data?: any
  error?: string
  generationId?: string
}

export const aiGenerationService = {
  async generateContent(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.CEREBRAS_API_KEY
      
      if (!apiKey) {
        return {
          success: false,
          error: "No API key found. Please add GOOGLE_GEMINI_API_KEY to your .env file."
        }
      }

      const prompt = this.buildPrompt(request)

      // Try Gemini
      if (process.env.GOOGLE_GEMINI_API_KEY) {
        return await this.callGemini(prompt, apiKey)
      }

      // Fallback to Cerebras
      if (process.env.CEREBRAS_API_KEY) {
        return await this.callCerebras(prompt, apiKey)
      }

      return {
        success: false,
        error: "No valid AI provider configured."
      }

    } catch (error) {
      console.error("AI Generation error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate content",
      }
    }
  },

  buildPrompt(request: GenerationRequest): string {
    let prompt = `Generate a ${request.contentType.toLowerCase()} about "${request.topic}".\n\n`
    
    if (request.category) {
      prompt += `Category: ${request.category}\n`
    }
    if (request.products && request.products.length > 0) {
      prompt += `Products: ${request.products.join(", ")}\n`
    }
    if (request.audience) {
      prompt += `Target Audience: ${request.audience}\n`
    }
    if (request.keywords && request.keywords.length > 0) {
      prompt += `Keywords: ${request.keywords.join(", ")}\n`
    }
    if (request.instructions) {
      prompt += `Additional Instructions: ${request.instructions}\n`
    }
    prompt += `\nTone: ${request.tone || "Expert"}`
    prompt += `\nDepth: ${request.depth || "Deep"}`
    
    prompt += `\n\nReturn ONLY valid JSON with these fields:\n`
    prompt += this.getSchemaForContentType(request.contentType)
    prompt += `\n\nDO NOT include any text outside the JSON. Return ONLY the JSON object.`
    return prompt
  },

  getSchemaForContentType(contentType: string): string {
    switch (contentType) {
      case "REVIEW":
        return `{
  "title": "string",
  "seoTitle": "string",
  "metaDescription": "string",
  "excerpt": "string",
  "introduction": "string",
  "bestFor": "string",
  "pros": ["string"],
  "cons": ["string"],
  "content": "string",
  "verdict": "string",
  "faq": [{"question": "string", "answer": "string"}],
  "cta": "string"
}`
      case "COMPARISON":
        return `{
  "title": "string",
  "seoTitle": "string",
  "metaDescription": "string",
  "excerpt": "string",
  "introduction": "string",
  "products": [{"name": "string", "strengths": ["string"], "weaknesses": ["string"]}],
  "winner": "string",
  "winnerExplanation": "string",
  "content": "string",
  "faq": [{"question": "string", "answer": "string"}]
}`
      default:
        return `{
  "title": "string",
  "seoTitle": "string",
  "metaDescription": "string",
  "excerpt": "string",
  "introduction": "string",
  "content": "string",
  "faq": [{"question": "string", "answer": "string"}]
}`
    }
  },

  async callGemini(prompt: string, apiKey: string): Promise<GenerationResponse> {
    try {
      console.log("🚀 Calling Gemini API with gemini-2.5-flash...")
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: prompt 
              }] 
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            }
          })
        }
      )

      console.log(`📡 Gemini API response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Gemini API error:", errorText)
        return {
          success: false,
          error: `Gemini API error (${response.status}): ${errorText.substring(0, 200)}`
        }
      }

      const data = await response.json()
      console.log("✅ Gemini API success!")
      
      const content = data.candidates[0].content.parts[0].text
      const parsedData = this.parseResponse(content)

      return {
        success: true,
        data: parsedData,
      }
    } catch (error) {
      console.error("❌ Gemini API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Gemini API failed"
      }
    }
  },

  async callCerebras(prompt: string, apiKey: string): Promise<GenerationResponse> {
    try {
      console.log("🚀 Calling Cerebras API...")
      
      const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3.1-8b",
          messages: [
            {
              role: "system",
              content: "You are a professional content writer. Return ONLY valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Cerebras API error:", errorText)
        return {
          success: false,
          error: `Cerebras API error (${response.status}): ${errorText.substring(0, 200)}`
        }
      }

      const data = await response.json()
      console.log("✅ Cerebras API success!")
      
      const content = data.choices[0].message.content
      const parsedData = this.parseResponse(content)

      return {
        success: true,
        data: parsedData,
      }
    } catch (error) {
      console.error("❌ Cerebras API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Cerebras API failed"
      }
    }
  },

  parseResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      try {
        return JSON.parse(response)
      } catch {
        return { content: response }
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error)
      return { content: response }
    }
  },
}
