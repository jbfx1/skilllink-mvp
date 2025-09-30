import { supabase } from './supabase'

class StorageService {
  constructor() {
    this.buckets = {
      avatars: 'avatars',
      attachments: 'attachments',
      media: 'media',
      documents: 'documents'
    }
  }

  /**
   * Upload file to Supabase Storage
   * @param {File} file - File to upload
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path within bucket
   * @param {Object} options - Upload options
   * @returns {Promise<{data: object, error: object}>}
   */
  async uploadFile(file, bucket, path, options = {}) {
    try {
      // Validate file
      const validation = this.validateFile(file, options)
      if (!validation.valid) {
        return { data: null, error: { message: validation.error } }
      }

      // Generate unique filename if not provided
      const fileName = path || this.generateFileName(file)

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: options.upsert || false,
          contentType: file.type
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return {
        data: {
          path: data.path,
          url: urlData.publicUrl,
          fullPath: data.fullPath
        },
        error: null
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      return { data: null, error }
    }
  }

  /**
   * Upload avatar image
   * @param {File} file - Image file
   * @param {string} userId - User ID
   * @returns {Promise<{data: object, error: object}>}
   */
  async uploadAvatar(file, userId) {
    const path = `${userId}/avatar-${Date.now()}.${this.getFileExtension(file)}`
    return this.uploadFile(file, this.buckets.avatars, path, {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    })
  }

  /**
   * Upload message attachment
   * @param {File} file - Attachment file
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @returns {Promise<{data: object, error: object}>}
   */
  async uploadAttachment(file, conversationId, userId) {
    const path = `${conversationId}/${userId}/${Date.now()}-${file.name}`
    return this.uploadFile(file, this.buckets.attachments, path, {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/zip'
      ]
    })
  }

  /**
   * Upload media file (images, videos)
   * @param {File} file - Media file
   * @param {string} path - Storage path
   * @returns {Promise<{data: object, error: object}>}
   */
  async uploadMedia(file, path) {
    return this.uploadFile(file, this.buckets.media, path, {
      maxSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime'
      ]
    })
  }

  /**
   * Delete file from storage
   * @param {string} bucket - Bucket name
   * @param {string} path - File path
   * @returns {Promise<{data: object, error: object}>}
   */
  async deleteFile(bucket, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error deleting file:', error)
      return { data: null, error }
    }
  }

  /**
   * Get public URL for a file
   * @param {string} bucket - Bucket name
   * @param {string} path - File path
   * @returns {string} Public URL
   */
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  /**
   * Get signed URL for private file
   * @param {string} bucket - Bucket name
   * @param {string} path - File path
   * @param {number} expiresIn - Expiration time in seconds
   * @returns {Promise<string>} Signed URL
   */
  async getSignedUrl(bucket, path, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) throw error

      return data.signedUrl
    } catch (error) {
      console.error('Error getting signed URL:', error)
      return null
    }
  }

  /**
   * List files in a directory
   * @param {string} bucket - Bucket name
   * @param {string} path - Directory path
   * @returns {Promise<Array>} List of files
   */
  async listFiles(bucket, path = '') {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path)

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error listing files:', error)
      return []
    }
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = []
    } = options

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${this.formatBytes(maxSize)}`
      }
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} not allowed`
      }
    }

    return { valid: true }
  }

  /**
   * Generate unique filename
   * @param {File} file - File object
   * @returns {string} Unique filename
   */
  generateFileName(file) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const extension = this.getFileExtension(file)
    return `${timestamp}-${random}.${extension}`
  }

  /**
   * Get file extension
   * @param {File} file - File object
   * @returns {string} File extension
   */
  getFileExtension(file) {
    return file.name.split('.').pop().toLowerCase()
  }

  /**
   * Format bytes to human readable size
   * @param {number} bytes - Bytes
   * @returns {string} Formatted size
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Create thumbnail for image
   * @param {File} file - Image file
   * @param {number} maxWidth - Maximum width
   * @param {number} maxHeight - Maximum height
   * @returns {Promise<Blob>} Thumbnail blob
   */
  async createThumbnail(file, maxWidth = 200, maxHeight = 200) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(resolve, file.type, 0.8)
      }

      img.onerror = reject

      img.src = URL.createObjectURL(file)
    })
  }
}

export const storageService = new StorageService()
export default storageService