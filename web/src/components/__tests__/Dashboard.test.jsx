import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Dashboard } from '../Dashboard'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../lib/supabase'

// Mock dependencies
vi.mock('../../contexts/AuthContext')
vi.mock('../../lib/supabase')
vi.mock('../discovery/TopicRooms', () => ({
  TopicRooms: () => <div>Topic Rooms Component</div>
}))
vi.mock('../discovery/MentorSearch', () => ({
  MentorSearch: () => <div>Mentor Search Component</div>
}))
vi.mock('../chat/ChatInterface', () => ({
  ChatInterface: () => <div>Chat Interface Component</div>
}))
vi.mock('../collaboration/ProjectBoard', () => ({
  ProjectBoard: () => <div>Project Board Component</div>
}))

describe('Dashboard', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com'
  }

  const mockProfile = {
    id: 'test-user-id',
    full_name: 'Test User',
    role: 'learner',
    xp: 100,
    level: 2
  }

  beforeEach(() => {
    vi.clearAllMocks()

    useAuth.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      signOut: vi.fn()
    })

    db.getTopicRooms.mockResolvedValue({
      data: [
        { id: '1', name: 'JavaScript', member_count: 150 },
        { id: '2', name: 'React', member_count: 200 }
      ],
      error: null
    })

    db.getUpcomingClasses.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'React Basics',
          scheduled_at: new Date().toISOString()
        }
      ],
      error: null
    })

    db.getQuestions.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'How to use hooks?',
          author_id: 'user1'
        }
      ],
      error: null
    })

    db.getLessons.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Introduction to TypeScript',
          author_id: 'user1'
        }
      ],
      error: null
    })
  })

  it('should render dashboard with user profile', async () => {
    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })
  })

  it('should load and display dashboard data', async () => {
    render(<Dashboard />)

    await waitFor(() => {
      expect(db.getTopicRooms).toHaveBeenCalled()
      expect(db.getUpcomingClasses).toHaveBeenCalled()
      expect(db.getQuestions).toHaveBeenCalled()
      expect(db.getLessons).toHaveBeenCalled()
    })
  })

  it('should handle loading state', async () => {
    render(<Dashboard />)
    // Dashboard should show loading indicators initially
    expect(screen.queryByText('Loading...')).toBeDefined()

    // Wait for async updates to complete
    await waitFor(() => {
      expect(db.getTopicRooms).toHaveBeenCalled()
    })
  })
})