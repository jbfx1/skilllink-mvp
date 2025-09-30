import { describe, it, expect } from 'vitest'
import {
  sanitizeHTML,
  sanitizeText,
  isValidEmail,
  isValidURL,
  checkRateLimit
} from '../moderation'

describe('Moderation Service', () => {
  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>'
      const output = sanitizeHTML(input)
      expect(output).not.toContain('script')
      expect(output).toContain('Hello')
    })

    it('should allow safe tags', () => {
      const input = '<p><strong>Bold</strong> and <em>italic</em></p>'
      const output = sanitizeHTML(input)
      expect(output).toContain('strong')
      expect(output).toContain('em')
    })

    it('should remove onclick attributes', () => {
      const input = '<button onclick="alert()">Click</button>'
      const output = sanitizeHTML(input)
      expect(output).not.toContain('onclick')
    })
  })

  describe('sanitizeText', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("test")</script>'
      const output = sanitizeText(input)
      expect(output).not.toContain('<script>')
      expect(output).toContain('&lt;')
    })

    it('should trim whitespace', () => {
      const input = '  Hello World  '
      const output = sanitizeText(input)
      expect(output).toBe('Hello World')
    })

    it('should handle empty input', () => {
      expect(sanitizeText('')).toBe('')
      expect(sanitizeText(null)).toBe('')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidURL', () => {
    it('should validate correct URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true)
      expect(isValidURL('http://subdomain.example.com/path')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidURL('not a url')).toBe(false)
      expect(isValidURL('example.com')).toBe(false) // requires protocol
    })
  })

  describe('checkRateLimit', () => {
    it('should allow actions within limit', () => {
      const result = checkRateLimit('user1', 'post', 5, 60000)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBeGreaterThanOrEqual(0)
    })

    it('should block actions exceeding limit', () => {
      const userId = 'user2'
      const action = 'message'
      const limit = 2

      // Make requests up to limit
      for (let i = 0; i < limit; i++) {
        checkRateLimit(userId, action, limit, 60000)
      }

      // Next request should be blocked
      const result = checkRateLimit(userId, action, limit, 60000)
      expect(result.allowed).toBe(false)
    })
  })
})