// src/types/ai.ts
import type {
  AIGeneration,
  AIContentVersion,
  AIPromptTemplate,
  AIUsage,
  User,
} from "@prisma/client"
import type { AIContentType, AIOperation, AIStatus, AIChangeType } from "@/lib/validations/ai-generation"

// ============================================
// AI GENERATION TYPES
// ============================================

export type AIGenerationWithUser = AIGeneration & {
  user: Pick<User, "id" | "name" | "email">
}

export interface AIGenerationStats {
  totalGenerations: number
  successfulGenerations: number
  failedGenerations: number
  successRate: number
  totalCost: number
}

export interface AIGenerationListItem {
  id: string
  contentType: AIContentType
  operation: AIOperation
  status: AIStatus
  model: string
  inputTokens: number | null
  outputTokens: number | null
  estimatedCost: number | null
  duration: number | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
  }
}

// ============================================
// AI CONTENT VERSION TYPES
// ============================================

export type AIContentVersionWithRelations = AIContentVersion & {
  creator: Pick<User, "id" | "name" | "email">
  generation?: AIGeneration | null
}

export interface ContentVersionDiff {
  version: number
  changeType: AIChangeType
  changes: Record<string, any>
  createdAt: Date
  createdBy: string
  createdByName: string | null
}

// ============================================
// AI PROMPT TEMPLATE TYPES
// ============================================

export type AIPromptTemplateWithUser = AIPromptTemplate & {
  creator: Pick<User, "id" | "name" | "email">
}

export interface AIPromptTemplateListItem {
  id: string
  name: string
  slug: string
  contentType: AIContentType
  operation: AIOperation
  isDefault: boolean
  isActive: boolean
  version: number
  createdAt: Date
  description: string | null
}

// ============================================
// AI USAGE TYPES
// ============================================

export interface AIUsageStats {
  totalRequests: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  byContentType: {
    contentType: string
    count: number
    cost: number
  }[]
  byOperation: {
    operation: string
    count: number
    cost: number
  }[]
  byModel: {
    model: string
    count: number
    cost: number
  }[]
}

export interface AIDailyStats {
  date: string
  requests: number
  cost: number
  tokens: number
}

export interface AITotalStats {
  totalRequests: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  topUsers: {
    userId: string
    count: number
    cost: number
  }[]
}

// ============================================
// AI GENERATION REQUEST
// ============================================

export interface AIGenerationRequest {
  contentType: AIContentType
  operation: AIOperation
  topic?: string
  category?: string
  products?: string[]
  audience?: string
  keywords?: string[]
  instructions?: string
  existingContent?: Record<string, any>
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface AIGenerationResponse {
  success: boolean
  generationId?: string
  data?: Record<string, any>
  error?: string
  inputTokens?: number
  outputTokens?: number
  cost?: number
  duration?: number
}

// ============================================
// AI CONTENT IMPROVEMENT
// ============================================

export interface AIContentImprovementRequest {
  contentId: string
  contentType: AIContentType
  section: string
  field: string
  currentValue: any
  instructions?: string
}

export interface AIContentImprovementResponse {
  success: boolean
  improvedValue: any
  generationId?: string
  cost?: number
  duration?: number
}
