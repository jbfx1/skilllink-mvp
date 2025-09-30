import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  MessageCircle, 
  Plus, 
  Search, 
  TrendingUp,
  Clock,
  Pin,
  Heart,
  Reply
} from 'lucide-react'

const SAMPLE_ROOMS = [
  {
    id: '1',
    name: 'Tech Talk',
    description: 'General technology discussions and Q&A',
    category: 'Technology',
    member_count: 1247,
    is_public: true,
    recent_activity: '2 minutes ago',
    trending: true,
    posts: [
      {
        id: '1',
        author: { full_name: 'Alex Chen', avatar_url: null },
        content: 'What are your thoughts on the new React 19 features? The compiler looks promising!',
        created_at: '5 minutes ago',
        reply_count: 12,
        reaction_count: 8,
        is_pinned: false
      },
      {
        id: '2', 
        author: { full_name: 'Sarah Kim', avatar_url: null },
        content: 'Looking for recommendations on the best VS Code extensions for Python development. What do you use?',
        created_at: '1 hour ago',
        reply_count: 23,
        reaction_count: 15,
        is_pinned: false
      }
    ]
  },
  {
    id: '2',
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack development',
    category: 'Technology',
    member_count: 892,
    is_public: true,
    recent_activity: '15 minutes ago',
    trending: false,
    posts: [
      {
        id: '3',
        author: { full_name: 'Mike Johnson', avatar_url: null },
        content: 'Just deployed my first Next.js app to Vercel! The experience was incredibly smooth. Here are some tips for beginners...',
        created_at: '15 minutes ago',
        reply_count: 7,
        reaction_count: 12,
        is_pinned: true
      }
    ]
  },
  {
    id: '3',
    name: 'Design Studio',
    description: 'UI/UX, graphic design, and creative discussions',
    category: 'Design',
    member_count: 634,
    is_public: true,
    recent_activity: '30 minutes ago',
    trending: true,
    posts: [
      {
        id: '4',
        author: { full_name: 'Emma Wilson', avatar_url: null },
        content: 'Color psychology in web design - how do you choose the right palette for different industries?',
        created_at: '30 minutes ago',
        reply_count: 18,
        reaction_count: 25,
        is_pinned: false
      }
    ]
  },
  {
    id: '4',
    name: 'Business Strategy',
    description: 'Entrepreneurship, marketing, and business growth',
    category: 'Business',
    member_count: 456,
    is_public: true,
    recent_activity: '1 hour ago',
    trending: false,
    posts: [
      {
        id: '5',
        author: { full_name: 'David Park', avatar_url: null },
        content: 'Startup funding landscape in 2024 - what are VCs looking for now?',
        created_at: '1 hour ago',
        reply_count: 9,
        reaction_count: 14,
        is_pinned: false
      }
    ]
  },
  {
    id: '5',
    name: 'Creative Corner',
    description: 'Writing, photography, video, and creative arts',
    category: 'Creative',
    member_count: 378,
    is_public: true,
    recent_activity: '2 hours ago',
    trending: false,
    posts: [
      {
        id: '6',
        author: { full_name: 'Lisa Garcia', avatar_url: null },
        content: 'Photography challenge: Share your best street photography shot and the story behind it!',
        created_at: '2 hours ago',
        reply_count: 31,
        reaction_count: 42,
        is_pinned: false
      }
    ]
  },
  {
    id: '6',
    name: 'Skilled Trades',
    description: 'Carpentry, plumbing, electrical, and trade skills',
    category: 'Trades',
    member_count: 234,
    is_public: true,
    recent_activity: '3 hours ago',
    trending: false,
    posts: [
      {
        id: '7',
        author: { full_name: 'Tom Rodriguez', avatar_url: null },
        content: 'Essential tools every beginner carpenter should have - my top 10 recommendations',
        created_at: '3 hours ago',
        reply_count: 16,
        reaction_count: 28,
        is_pinned: true
      }
    ]
  }
]

export const TopicRooms = () => {
  const [rooms, setRooms] = useState(SAMPLE_ROOMS)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newPost, setNewPost] = useState('')
  const [showCreateRoom, setShowCreateRoom] = useState(false)

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Business': 'bg-green-100 text-green-800',
      'Creative': 'bg-pink-100 text-pink-800',
      'Trades': 'bg-orange-100 text-orange-800',
      'Health': 'bg-teal-100 text-teal-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const handleJoinRoom = (roomId) => {
    // In a real app, this would call the API to join the room
    console.log('Joining room:', roomId)
  }

  const handleCreatePost = () => {
    if (!newPost.trim() || !selectedRoom) return
    
    // In a real app, this would call the API to create a post
    const post = {
      id: Date.now().toString(),
      author: { full_name: 'You', avatar_url: null },
      content: newPost,
      created_at: 'Just now',
      reply_count: 0,
      reaction_count: 0,
      is_pinned: false
    }
    
    setRooms(prev => prev.map(room => 
      room.id === selectedRoom.id 
        ? { ...room, posts: [post, ...room.posts] }
        : room
    ))
    
    setNewPost('')
  }

  if (selectedRoom) {
    return (
      <div className="space-y-6">
        {/* Room Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedRoom(null)}
                >
                  ← Back to Rooms
                </Button>
                <Badge className={getCategoryColor(selectedRoom.category)}>
                  {selectedRoom.category}
                </Badge>
                {selectedRoom.trending && (
                  <Badge variant="secondary" className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedRoom.name}</h1>
              <p className="text-gray-600 mb-4">{selectedRoom.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {selectedRoom.member_count.toLocaleString()} members
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Active {selectedRoom.recent_activity}
                </div>
              </div>
            </div>
            <Button onClick={() => handleJoinRoom(selectedRoom.id)}>
              <Plus className="h-4 w-4 mr-2" />
              Join Room
            </Button>
          </div>
        </div>

        {/* Create Post */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Start a Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What would you like to discuss?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {selectedRoom.posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar_url} />
                    <AvatarFallback className="bg-gray-100">
                      {getInitials(post.author.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{post.author.full_name}</h4>
                      <span className="text-sm text-gray-500">{post.created_at}</span>
                      {post.is_pinned && (
                        <Badge variant="secondary" className="flex items-center">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.reaction_count}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Reply className="h-4 w-4 mr-1" />
                        {post.reply_count} replies
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Topic Rooms</h2>
            <p className="text-gray-600">Join discussions in your areas of interest</p>
          </div>
          <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Topic Room</DialogTitle>
                <DialogDescription>
                  Start a new community around your area of expertise
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Room Name</label>
                  <Input placeholder="e.g., Advanced React Patterns" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="What will this room be about?" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateRoom(false)}>
                    Cancel
                  </Button>
                  <Button>Create Room</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card 
            key={room.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedRoom(room)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getCategoryColor(room.category)}>
                      {room.category}
                    </Badge>
                    {room.trending && (
                      <Badge variant="secondary" className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {room.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {room.member_count.toLocaleString()} members
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {room.recent_activity}
                </div>
              </div>

              {/* Recent Posts Preview */}
              {room.posts.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500 mb-2">Recent activity:</p>
                  <div className="space-y-2">
                    {room.posts.slice(0, 1).map((post) => (
                      <div key={post.id} className="flex items-start space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-gray-100">
                            {getInitials(post.author.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <span>{post.reply_count} replies</span>
                            <span>{post.reaction_count} reactions</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleJoinRoom(room.id)
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Discussion
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600">Try a different search term or create a new room</p>
        </div>
      )}
    </div>
  )
}
