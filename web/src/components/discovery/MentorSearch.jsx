import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Star, Users, MessageCircle, Filter } from 'lucide-react'
import { db } from '../../lib/supabase'

const SKILL_CATEGORIES = [
  'Technology',
  'Design', 
  'Business',
  'Creative',
  'Trades',
  'Health'
]

const SAMPLE_MENTORS = [
  {
    id: '1',
    full_name: 'Sarah Chen',
    avatar_url: null,
    bio: 'Senior Software Engineer with 8+ years experience in React, Node.js, and system design. Passionate about mentoring junior developers.',
    skills: ['JavaScript', 'React', 'Node.js', 'System Design'],
    xp: 2500,
    level: 15,
    rating: 4.9,
    students: 45,
    sessions: 120
  },
  {
    id: '2', 
    full_name: 'Marcus Johnson',
    avatar_url: null,
    bio: 'UX Designer and Design Systems expert. Helped 50+ startups build beautiful, user-centered products.',
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research'],
    xp: 3200,
    level: 18,
    rating: 4.8,
    students: 62,
    sessions: 180
  },
  {
    id: '3',
    full_name: 'Emily Rodriguez',
    avatar_url: null,
    bio: 'Digital Marketing strategist with expertise in SEO, content marketing, and social media growth.',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media'],
    xp: 1800,
    level: 12,
    rating: 4.7,
    students: 38,
    sessions: 95
  },
  {
    id: '4',
    full_name: 'David Kim',
    avatar_url: null,
    bio: 'Data Scientist and ML Engineer. Specializes in Python, machine learning, and data visualization.',
    skills: ['Python', 'Machine Learning', 'Data Science', 'SQL'],
    xp: 2800,
    level: 16,
    rating: 4.9,
    students: 52,
    sessions: 140
  },
  {
    id: '5',
    full_name: 'Lisa Thompson',
    avatar_url: null,
    bio: 'Professional photographer and visual storyteller. Teaching composition, lighting, and post-processing.',
    skills: ['Photography', 'Lightroom', 'Photoshop', 'Visual Storytelling'],
    xp: 2100,
    level: 13,
    rating: 4.8,
    students: 41,
    sessions: 110
  },
  {
    id: '6',
    full_name: 'Alex Rivera',
    avatar_url: null,
    bio: 'Certified fitness trainer and nutrition coach. Helping people achieve their health and fitness goals.',
    skills: ['Fitness Training', 'Nutrition', 'Weight Loss', 'Strength Training'],
    xp: 1600,
    level: 11,
    rating: 4.6,
    students: 35,
    sessions: 85
  }
]

export const MentorSearch = () => {
  const [mentors, setMentors] = useState(SAMPLE_MENTORS)
  const [filteredMentors, setFilteredMentors] = useState(SAMPLE_MENTORS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState('all')
  const [loading, setLoading] = useState(false)

  // Get unique skills from all mentors
  const allSkills = [...new Set(mentors.flatMap(mentor => mentor.skills))].sort()

  useEffect(() => {
    filterMentors()
  }, [searchQuery, selectedCategory, selectedSkill, mentors])

  const filterMentors = () => {
    let filtered = mentors

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(mentor => 
        mentor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by skill
    if (selectedSkill !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.skills.includes(selectedSkill)
      )
    }

    setFilteredMentors(filtered)
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      // In a real app, this would call the API
      // const { data, error } = await db.searchMentors(searchQuery, selectedSkill !== 'all' ? [selectedSkill] : [])
      // if (data) setMentors(data)
      
      // For demo, just filter existing data
      filterMentors()
    } catch (error) {
      console.error('Error searching mentors:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Mentor</h2>
        <p className="text-gray-600 mb-6">Connect with experienced professionals who can guide your learning journey</p>
        
        {/* Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          
          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger>
              <SelectValue placeholder="All Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {allSkills.map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} disabled={loading}>
            <Filter className="h-4 w-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredMentors.length} mentors found
          </h3>
          <Select defaultValue="rating">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="experience">Most Experience</SelectItem>
              <SelectItem value="students">Most Students</SelectItem>
              <SelectItem value="recent">Recently Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                      {getInitials(mentor.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{mentor.full_name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {mentor.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {mentor.students}
                      </div>
                      <Badge variant="secondary">Level {mentor.level}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">{mentor.bio}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-600">
                    {mentor.sessions} sessions completed
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all mentors</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setSelectedSkill('all')
                setSelectedCategory('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
