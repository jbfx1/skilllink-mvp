import OpenAI from 'openai'
import DOMPurify from 'dompurify'
import validator from 'validator'

// Initialize OpenAI client (server-side only)
// In production, this should be called from your backend
let openaiClient = null

const getOpenAIClient = () => {
  if (!openaiClient) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (apiKey) {
      openaiClient = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Only for demo - move to backend in production
      })
    }
  }
  return openaiClient
}

/**
 * Sanitize HTML content to prevent XSS
 * @param {string} content - Raw HTML content
 * @returns {string} Sanitized content
 */
export const sanitizeHTML = (content) => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}

/**
 * Validate and sanitize text input
 * @param {string} text - Raw text
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text) return ''

  // Escape HTML entities first
  let sanitized = validator.escape(text)

  // Trim whitespace
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export const isValidEmail = (email) => {
  return validator.isEmail(email)
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid
 */
export const isValidURL = (url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  })
}

/**
 * Check content for inappropriate material using OpenAI Moderation API
 * @param {string} content - Content to moderate
 * @returns {Promise<{flagged: boolean, categories: object, scores: object}>}
 */
export const moderateContent = async (content) => {
  try {
    const client = getOpenAIClient()
    if (!client) {
      console.warn('OpenAI client not configured, skipping moderation')
      return { flagged: false, categories: {}, scores: {} }
    }

    const response = await client.moderations.create({
      input: content
    })

    const result = response.results[0]

    return {
      flagged: result.flagged,
      categories: result.categories,
      scores: result.category_scores
    }
  } catch (error) {
    console.error('Error moderating content:', error)
    // Fail open - don't block content on moderation API errors
    return { flagged: false, categories: {}, scores: {}, error: error.message }
  }
}

/**
 * Comprehensive content validation
 * @param {string} content - Content to validate
 * @param {Object} options - Validation options
 * @returns {Promise<{isValid: boolean, errors: Array, sanitized: string}>}
 */
export const validateContent = async (content, options = {}) => {
  const {
    maxLength = 5000,
    minLength = 1,
    requireModeration = true,
    allowHTML = false
  } = options

  const errors = []

  // Check length
  if (!content || content.length < minLength) {
    errors.push(`Content must be at least ${minLength} characters`)
  }

  if (content && content.length > maxLength) {
    errors.push(`Content must not exceed ${maxLength} characters`)
  }

  // Sanitize content
  let sanitized = allowHTML ? sanitizeHTML(content) : sanitizeText(content)

  // Check for spam patterns
  if (isSpam(content)) {
    errors.push('Content appears to be spam')
  }

  // Moderation check
  if (requireModeration && errors.length === 0) {
    const moderation = await moderateContent(content)
    if (moderation.flagged) {
      const flaggedCategories = Object.entries(moderation.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category)

      errors.push(`Content flagged for: ${flaggedCategories.join(', ')}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
    originalLength: content?.length || 0,
    sanitizedLength: sanitized.length
  }
}

/**
 * Simple spam detection
 * @param {string} content - Content to check
 * @returns {boolean} Is spam
 */
const isSpam = (content) => {
  if (!content) return false

  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner)\b/i,
    /(buy now|click here|limited time|act now)/gi,
    /(.)\1{10,}/, // Repeated characters
    /(http|https):\/\/.*?(http|https):\/\//i, // Multiple URLs
  ]

  // Check for excessive URLs
  const urlCount = (content.match(/https?:\/\//g) || []).length
  if (urlCount > 3) return true

  // Check spam patterns
  return spamPatterns.some(pattern => pattern.test(content))
}

/**
 * Rate limit check (simple in-memory implementation)
 * In production, use Redis or similar
 */
const rateLimitStore = new Map()

export const checkRateLimit = (userId, action, limit = 10, windowMs = 60000) => {
  const key = `${userId}:${action}`
  const now = Date.now()

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, [])
  }

  const timestamps = rateLimitStore.get(key)

  // Remove old timestamps
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs)

  if (validTimestamps.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: windowMs - (now - validTimestamps[0])
    }
  }

  validTimestamps.push(now)
  rateLimitStore.set(key, validTimestamps)

  return {
    allowed: true,
    remaining: limit - validTimestamps.length,
    resetIn: windowMs
  }
}

/**
 * Clean up old rate limit entries
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const validTimestamps = timestamps.filter(ts => now - ts < 60000)
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key)
    } else {
      rateLimitStore.set(key, validTimestamps)
    }
  }
}, 60000) // Clean up every minute

export default {
  sanitizeHTML,
  sanitizeText,
  isValidEmail,
  isValidURL,
  moderateContent,
  validateContent,
  checkRateLimit
}