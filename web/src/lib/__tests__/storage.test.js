import { describe, it, expect } from 'vitest'
import { storageService } from '../storage'

describe('Storage Service', () => {
  describe('validateFile', () => {
    it('should validate file size', () => {
      const smallFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.txt')

      const smallResult = storageService.validateFile(smallFile, {
        maxSize: 10 * 1024 * 1024
      })
      expect(smallResult.valid).toBe(true)

      const largeResult = storageService.validateFile(largeFile, {
        maxSize: 10 * 1024 * 1024
      })
      expect(largeResult.valid).toBe(false)
      expect(largeResult.error).toContain('exceeds')
    })

    it('should validate file type', () => {
      const imageFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' })
      const textFile = new File(['content'], 'doc.txt', { type: 'text/plain' })

      const validResult = storageService.validateFile(imageFile, {
        allowedTypes: ['image/jpeg', 'image/png']
      })
      expect(validResult.valid).toBe(true)

      const invalidResult = storageService.validateFile(textFile, {
        allowedTypes: ['image/jpeg', 'image/png']
      })
      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.error).toContain('not allowed')
    })
  })

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(storageService.formatBytes(0)).toBe('0 Bytes')
      expect(storageService.formatBytes(1024)).toBe('1 KB')
      expect(storageService.formatBytes(1024 * 1024)).toBe('1 MB')
      expect(storageService.formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      const file1 = new File([''], 'document.pdf')
      const file2 = new File([''], 'image.jpeg')
      const file3 = new File([''], 'archive.tar.gz')

      expect(storageService.getFileExtension(file1)).toBe('pdf')
      expect(storageService.getFileExtension(file2)).toBe('jpeg')
      expect(storageService.getFileExtension(file3)).toBe('gz')
    })
  })

  describe('generateFileName', () => {
    it('should generate unique filename', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })

      const name1 = storageService.generateFileName(file)
      const name2 = storageService.generateFileName(file)

      expect(name1).not.toBe(name2)
      expect(name1).toContain('.jpg')
      expect(name2).toContain('.jpg')
    })
  })
})