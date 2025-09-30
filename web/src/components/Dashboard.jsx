import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Users, 
  MessageCircle, 
  Video, 
  Award, 
  Settings,
  LogOut,
  Search,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/supabase'
import { TopicRooms } from './discovery/TopicRooms'
import { MentorSearch } from './discovery/MentorSearch'
import { ChatInterface } from './chat/ChatInterface'
import { ProjectBoard } from './collaboration/ProjectBoard'

export const Dashboard = () => {
  const { user, profile, signOut } = useAuth()
  const [topicRooms, setTopicRooms] = useState([])
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [recentQuestions, setRecentQuestions] = useState([])
  const [featuredLessons, setFeaturedLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [roomsResult, classesResult, questionsResult, lessonsResult] = await Promise.all([
        db.getTopicRooms(),
        db.getUpcomingClasses(5),
        db.getQuestions(5, 0),
        db.getLessons(6, 0)
      ])

      if (roomsResult.data) setTopicRooms(roomsResult.data)
      if (classesResult.data) setUpcomingClasses(classesResult.data)
      if (questionsResult.data) setRecentQuestions(questionsResult.data)
      if (lessonsResult.data) setFeaturedLessons(lessonsResult.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SkillLink</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-gray-600">
            {profile?.role === 'mentor' 
              ? 'Ready to share your knowledge and help others grow?' 
              : 'Ready to learn something new today?'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">XP Points</p>
                  <p className="text-2xl font-bold text-gray-900">{profile?.xp || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-gray-900">{profile?.level || 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{profile?.streak_count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connections</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Classes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Upcoming Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingClasses.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingClasses.slice(0, 3).map((classItem) => (
                        <div key={classItem.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{classItem.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(classItem.scheduled_at).toLocaleDateString()} at{' '}
                              {new Date(classItem.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {classItem.tags?.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                          <Button size="sm">Join</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming classes</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Recent Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentQuestions.length > 0 ? (
                    <div className="space-y-4">
                      {recentQuestions.slice(0, 3).map((question) => (
                        <div key={question.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">{question.title}</h4>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{question.upvotes} upvotes</span>
                            <span>{question.answer_count} answers</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {question.tags?.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent questions</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Featured Lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Featured Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                {featuredLessons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredLessons.map((lesson) => (
                      <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium mb-2">{lesson.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="outline" className="capitalize">{lesson.skill_level}</Badge>
                          <span className="text-gray-500">{lesson.duration_minutes}min</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {lesson.tags?.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full mt-3">Start Learning</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No lessons available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentors">
            <MentorSearch />
          </TabsContent>

          <TabsContent value="rooms">
            <TopicRooms />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectBoard />
          </TabsContent>

          {/* Other tab contents would be implemented similarly */}
          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle>Live Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">Live classes feature coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qa">
            <Card>
              <CardHeader>
                <CardTitle>Q&A</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">Q&A feature coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">Lessons feature coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
