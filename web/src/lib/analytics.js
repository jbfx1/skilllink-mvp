import posthog from 'posthog-js'

class AnalyticsService {
  constructor() {
    this.initialized = false
    this.posthog = null
  }

  /**
   * Initialize PostHog analytics
   */
  init() {
    if (this.initialized) return

    const apiKey = import.meta.env.VITE_POSTHOG_KEY
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

    if (!apiKey) {
      console.warn('PostHog API key not configured')
      return
    }

    try {
      posthog.init(apiKey, {
        api_host: host,
        loaded: (posthog) => {
          if (import.meta.env.DEV) {
            posthog.debug()
          }
        },
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        disable_session_recording: false
      })

      this.posthog = posthog
      this.initialized = true
      console.log('PostHog analytics initialized')
    } catch (error) {
      console.error('Failed to initialize PostHog:', error)
    }
  }

  /**
   * Identify user
   * @param {string} userId - User ID
   * @param {Object} properties - User properties
   */
  identify(userId, properties = {}) {
    if (!this.initialized) return

    this.posthog?.identify(userId, {
      ...properties,
      environment: import.meta.env.MODE
    })
  }

  /**
   * Track custom event
   * @param {string} eventName - Event name
   * @param {Object} properties - Event properties
   */
  track(eventName, properties = {}) {
    if (!this.initialized) return

    this.posthog?.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Track page view
   * @param {string} pageName - Page name
   * @param {Object} properties - Additional properties
   */
  pageView(pageName, properties = {}) {
    if (!this.initialized) return

    this.posthog?.capture('$pageview', {
      page_name: pageName,
      ...properties
    })
  }

  /**
   * Set user properties
   * @param {Object} properties - Properties to set
   */
  setUserProperties(properties) {
    if (!this.initialized) return

    this.posthog?.people?.set(properties)
  }

  /**
   * Reset analytics (on logout)
   */
  reset() {
    if (!this.initialized) return

    this.posthog?.reset()
  }

  /**
   * Check if feature flag is enabled
   * @param {string} flagKey - Feature flag key
   * @returns {boolean}
   */
  isFeatureEnabled(flagKey) {
    if (!this.initialized) return false

    return this.posthog?.isFeatureEnabled(flagKey) || false
  }

  /**
   * Get feature flag value
   * @param {string} flagKey - Feature flag key
   * @param {*} defaultValue - Default value if flag not found
   * @returns {*}
   */
  getFeatureFlag(flagKey, defaultValue = false) {
    if (!this.initialized) return defaultValue

    return this.posthog?.getFeatureFlag(flagKey) || defaultValue
  }

  /**
   * Track common user actions
   */
  trackUserAction = {
    // Authentication
    signUp: (method = 'email') => this.track('user_signed_up', { method }),
    signIn: (method = 'email') => this.track('user_signed_in', { method }),
    signOut: () => this.track('user_signed_out'),

    // Profile
    profileUpdated: () => this.track('profile_updated'),
    avatarUploaded: () => this.track('avatar_uploaded'),

    // Discovery
    mentorSearched: (query, filters) => this.track('mentor_searched', { query, filters }),
    mentorViewed: (mentorId) => this.track('mentor_viewed', { mentorId }),
    mentorConnected: (mentorId) => this.track('mentor_connected', { mentorId }),

    // Topic Rooms
    roomJoined: (roomId, roomName) => this.track('room_joined', { roomId, roomName }),
    roomLeft: (roomId) => this.track('room_left', { roomId }),
    postCreated: (roomId, postId) => this.track('post_created', { roomId, postId }),
    postReacted: (postId, reaction) => this.track('post_reacted', { postId, reaction }),

    // Messaging
    conversationStarted: (participantId) => this.track('conversation_started', { participantId }),
    messageSent: (conversationId) => this.track('message_sent', { conversationId }),

    // Projects
    projectCreated: (projectId, projectName) => this.track('project_created', { projectId, projectName }),
    taskCompleted: (projectId, taskId) => this.track('task_completed', { projectId, taskId }),

    // Live Classes
    classJoined: (classId, className) => this.track('class_joined', { classId, className }),
    classLeft: (classId, duration) => this.track('class_left', { classId, duration }),

    // Q&A
    questionAsked: (questionId, topic) => this.track('question_asked', { questionId, topic }),
    answerProvided: (questionId, answerId) => this.track('answer_provided', { questionId, answerId }),
    votecast: (type, itemId, direction) => this.track('vote_cast', { type, itemId, direction }),

    // Gamification
    xpEarned: (amount, reason) => this.track('xp_earned', { amount, reason }),
    levelUp: (newLevel) => this.track('level_up', { newLevel }),
    badgeEarned: (badgeId, badgeName) => this.track('badge_earned', { badgeId, badgeName }),

    // Monetization
    subscriptionStarted: (planId) => this.track('subscription_started', { planId }),
    paymentCompleted: (amount, type) => this.track('payment_completed', { amount, type }),

    // Engagement
    streakExtended: (streakCount) => this.track('streak_extended', { streakCount }),
    dailyGoalCompleted: () => this.track('daily_goal_completed'),

    // Errors
    errorOccurred: (error, context) => this.track('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      context
    })
  }
}

export const analytics = new AnalyticsService()
export default analytics