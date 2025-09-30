import * as Sentry from '@sentry/react'

/**
 * Initialize Sentry error tracking
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) {
    console.warn('Sentry DSN not configured')
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true
      })
    ],

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || 'development',

    // Filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive data from events
      if (event.request) {
        delete event.request.cookies
        delete event.request.headers?.authorization
      }

      // Filter out localhost errors in development
      if (import.meta.env.DEV && event.request?.url?.includes('localhost')) {
        return null
      }

      return event
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',

      // Network errors
      'NetworkError',
      'Failed to fetch',
      'Network request failed',

      // Random plugins/extensions
      'fb_xd_fragment',
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',

      // Common user errors
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications'
    ],

    // Don't report errors for these URLs
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i
    ]
  })

  console.log('Sentry initialized')
}

/**
 * Set user context for error tracking
 * @param {Object} user - User object
 */
export const setUser = (user) => {
  if (!user) {
    Sentry.setUser(null)
    return
  }

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.full_name
  })
}

/**
 * Set additional context
 * @param {string} key - Context key
 * @param {*} value - Context value
 */
export const setContext = (key, value) => {
  Sentry.setContext(key, value)
}

/**
 * Add breadcrumb for debugging
 * @param {Object} breadcrumb - Breadcrumb data
 */
export const addBreadcrumb = (breadcrumb) => {
  Sentry.addBreadcrumb(breadcrumb)
}

/**
 * Capture exception manually
 * @param {Error} error - Error to capture
 * @param {Object} context - Additional context
 */
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, {
    contexts: { extra: context }
  })
}

/**
 * Capture message
 * @param {string} message - Message to capture
 * @param {string} level - Severity level
 */
export const captureMessage = (message, level = 'info') => {
  Sentry.captureMessage(message, level)
}

/**
 * Start a new transaction for performance monitoring
 * @param {string} name - Transaction name
 * @param {string} op - Operation type
 */
export const startTransaction = (name, op = 'custom') => {
  return Sentry.startTransaction({ name, op })
}

export default {
  init: initSentry,
  setUser,
  setContext,
  addBreadcrumb,
  captureException,
  captureMessage,
  startTransaction
}