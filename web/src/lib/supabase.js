import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Profiles
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Skills
  getSkills: async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
    return { data, error }
  },

  // Topic Rooms
  getTopicRooms: async () => {
    const { data, error } = await supabase
      .from('topic_rooms')
      .select('*')
      .eq('is_public', true)
      .order('member_count', { ascending: false })
    return { data, error }
  },

  // Search mentors
  searchMentors: async (query = '', skills = [], limit = 20, offset = 0) => {
    const { data, error } = await supabase.rpc('search_mentors', {
      search_query: query,
      skill_filter: skills,
      limit_count: limit,
      offset_count: offset
    })
    return { data, error }
  },

  // Questions
  getQuestions: async (limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        profiles:author_id (full_name, avatar_url),
        answers (count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  },

  // Live Classes
  getUpcomingClasses: async (limit = 10) => {
    const { data, error } = await supabase
      .from('live_classes')
      .select(`
        *,
        profiles:host_id (full_name, avatar_url)
      `)
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(limit)
    return { data, error }
  },

  // Lessons
  getLessons: async (limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        profiles:author_id (full_name, avatar_url)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  },

  // Tutorials
  getTutorials: async (limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('tutorials')
      .select(`
        *,
        profiles:author_id (full_name, avatar_url)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToMessages: (conversationId, callback) => {
    return supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, callback)
      .subscribe()
  },

  subscribeToNotifications: (userId, callback) => {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
}
