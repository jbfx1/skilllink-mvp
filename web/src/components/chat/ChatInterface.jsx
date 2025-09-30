import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Plus,
  MessageCircle,
  CheckCheck,
  Clock
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const SAMPLE_CONVERSATIONS = [
  {
    id: '1',
    participant: {
      id: '2',
      full_name: 'Sarah Chen',
      avatar_url: null,
      is_online: true,
      last_seen: null
    },
    last_message: {
      content: 'Thanks for the React tips! The useCallback explanation was really helpful.',
      created_at: '2 minutes ago',
      sender_id: '2'
    },
    unread_count: 0,
    is_mentor_conversation: true
  },
  {
    id: '2', 
    participant: {
      id: '3',
      full_name: 'Marcus Johnson',
      avatar_url: null,
      is_online: false,
      last_seen: '1 hour ago'
    },
    last_message: {
      content: 'I\'ll review your design portfolio and get back to you with feedback by tomorrow.',
      created_at: '45 minutes ago',
      sender_id: '3'
    },
    unread_count: 2,
    is_mentor_conversation: true
  },
  {
    id: '3',
    participant: {
      id: '4',
      full_name: 'Emily Rodriguez',
      avatar_url: null,
      is_online: true,
      last_seen: null
    },
    last_message: {
      content: 'The marketing strategy document looks great! Just a few minor suggestions.',
      created_at: '1 day ago',
      sender_id: '4'
    },
    unread_count: 0,
    is_mentor_conversation: true
  }
]

const SAMPLE_MESSAGES = {
  '1': [
    {
      id: '1',
      content: 'Hi Sarah! I\'m struggling with React hooks, especially useEffect. Could you help me understand when to use the dependency array?',
      sender_id: 'current_user',
      created_at: '10:30 AM',
      status: 'read'
    },
    {
      id: '2',
      content: 'Of course! The dependency array in useEffect controls when the effect runs. If you pass an empty array [], it runs only once after the initial render.',
      sender_id: '2',
      created_at: '10:32 AM',
      status: 'delivered'
    },
    {
      id: '3',
      content: 'If you include variables in the array, the effect runs whenever those variables change. This is crucial for avoiding infinite loops!',
      sender_id: '2',
      created_at: '10:33 AM',
      status: 'delivered'
    },
    {
      id: '4',
      content: 'That makes sense! What about useCallback? When should I use that?',
      sender_id: 'current_user',
      created_at: '10:35 AM',
      status: 'read'
    },
    {
      id: '5',
      content: 'useCallback is great for optimizing performance when passing functions to child components. It memoizes the function so it doesn\'t get recreated on every render.',
      sender_id: '2',
      created_at: '10:37 AM',
      status: 'delivered'
    },
    {
      id: '6',
      content: 'Thanks for the React tips! The useCallback explanation was really helpful.',
      sender_id: '2',
      created_at: '10:40 AM',
      status: 'delivered'
    }
  ]
}

export const ChatInterface = () => {
  const { user, profile } = useAuth()
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (selectedConversation) {
      setMessages(SAMPLE_MESSAGES[selectedConversation.id] || [])
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: 'current_user',
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ))
    }, 1000)
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participant.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.participant.avatar_url} />
                    <AvatarFallback className="bg-gray-100">
                      {getInitials(conversation.participant.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.participant.is_online && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">
                      {conversation.participant.full_name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">
                        {conversation.last_message.created_at}
                      </span>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.last_message.content}
                    </p>
                    {conversation.is_mentor_conversation && (
                      <Badge variant="secondary" className="text-xs">Mentor</Badge>
                    )}
                  </div>
                  
                  {!conversation.participant.is_online && conversation.participant.last_seen && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last seen {conversation.participant.last_seen}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.participant.avatar_url} />
                    <AvatarFallback className="bg-gray-100">
                      {getInitials(selectedConversation.participant.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.participant.is_online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedConversation.participant.full_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.participant.is_online ? 'Online' : `Last seen ${selectedConversation.participant.last_seen}`}
                  </p>
                </div>
                {selectedConversation.is_mentor_conversation && (
                  <Badge variant="secondary">Mentor</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === 'current_user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === 'current_user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-between mt-1 ${
                        message.sender_id === 'current_user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{message.created_at}</span>
                        {message.sender_id === 'current_user' && (
                          <div className="ml-2">
                            {getStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Smile className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
