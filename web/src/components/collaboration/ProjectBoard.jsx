import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  MessageSquare,
  FileText,
  Link,
  Star
} from 'lucide-react'

const SAMPLE_PROJECTS = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    description: 'Complete redesign of the company e-commerce platform with modern UI/UX principles',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    mentor: {
      id: '2',
      full_name: 'Sarah Chen',
      avatar_url: null
    },
    learner: {
      id: 'current_user',
      full_name: 'You'
    },
    due_date: '2024-10-15',
    created_at: '2024-09-15',
    tasks: [
      { id: '1', title: 'User Research & Analysis', status: 'completed', assignee: 'learner' },
      { id: '2', title: 'Wireframe Creation', status: 'completed', assignee: 'learner' },
      { id: '3', title: 'UI Design System', status: 'in_progress', assignee: 'learner' },
      { id: '4', title: 'Prototype Development', status: 'pending', assignee: 'learner' },
      { id: '5', title: 'User Testing', status: 'pending', assignee: 'mentor' }
    ],
    tags: ['UI/UX', 'React', 'E-commerce'],
    last_activity: '2 hours ago'
  },
  {
    id: '2',
    title: 'Python Data Analysis Project',
    description: 'Analyze customer behavior data using pandas and create visualizations',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    mentor: {
      id: '4',
      full_name: 'David Kim',
      avatar_url: null
    },
    learner: {
      id: 'current_user',
      full_name: 'You'
    },
    due_date: '2024-09-30',
    created_at: '2024-09-01',
    tasks: [
      { id: '6', title: 'Data Collection & Cleaning', status: 'completed', assignee: 'learner' },
      { id: '7', title: 'Exploratory Data Analysis', status: 'completed', assignee: 'learner' },
      { id: '8', title: 'Statistical Analysis', status: 'completed', assignee: 'learner' },
      { id: '9', title: 'Visualization Creation', status: 'completed', assignee: 'learner' },
      { id: '10', title: 'Report Writing', status: 'completed', assignee: 'learner' }
    ],
    tags: ['Python', 'Data Science', 'Analytics'],
    last_activity: '1 week ago'
  },
  {
    id: '3',
    title: 'Mobile App Prototype',
    description: 'Create a React Native prototype for a fitness tracking application',
    status: 'pending',
    priority: 'low',
    progress: 0,
    mentor: {
      id: '3',
      full_name: 'Marcus Johnson',
      avatar_url: null
    },
    learner: {
      id: 'current_user',
      full_name: 'You'
    },
    due_date: '2024-11-30',
    created_at: '2024-09-28',
    tasks: [
      { id: '11', title: 'Requirements Gathering', status: 'pending', assignee: 'learner' },
      { id: '12', title: 'App Architecture Planning', status: 'pending', assignee: 'mentor' },
      { id: '13', title: 'UI/UX Design', status: 'pending', assignee: 'learner' },
      { id: '14', title: 'Development Setup', status: 'pending', assignee: 'learner' },
      { id: '15', title: 'Core Features Implementation', status: 'pending', assignee: 'learner' }
    ],
    tags: ['React Native', 'Mobile', 'Fitness'],
    last_activity: '3 days ago'
  }
]

export const ProjectBoard = () => {
  const [projects, setProjects] = useState(SAMPLE_PROJECTS)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [filter, setFilter] = useState('all')

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-orange-100 text-orange-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    return project.status === filter
  })

  const getTaskStats = (tasks) => {
    const completed = tasks.filter(task => task.status === 'completed').length
    const total = tasks.length
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 }
  }

  if (selectedProject) {
    const taskStats = getTaskStats(selectedProject.tasks)
    
    return (
      <div className="space-y-6">
        {/* Project Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedProject(null)}
                className="mb-3"
              >
                ← Back to Projects
              </Button>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h1>
                <Badge className={getStatusColor(selectedProject.status)}>
                  {selectedProject.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(selectedProject.priority)}>
                  {selectedProject.priority} priority
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Progress:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={selectedProject.progress} className="flex-1" />
                    <span className="font-medium">{selectedProject.progress}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Due Date:</span>
                  <p className="font-medium">{new Date(selectedProject.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tasks:</span>
                  <p className="font-medium">{taskStats.completed}/{taskStats.total} completed</p>
                </div>
                <div>
                  <span className="text-gray-500">Last Activity:</span>
                  <p className="font-medium">{selectedProject.last_activity}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Files
              </Button>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Team Members */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Team:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedProject.mentor.avatar_url} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {getInitials(selectedProject.mentor.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{selectedProject.mentor.full_name}</p>
                  <p className="text-xs text-gray-500">Mentor</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                    {getInitials(selectedProject.learner.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{selectedProject.learner.full_name}</p>
                  <p className="text-xs text-gray-500">Learner</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project Tasks</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedProject.tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>Assigned to: {task.assignee === 'learner' ? 'You' : 'Mentor'}</span>
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Project Requirements.pdf</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Link className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Design System Reference</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Wireframes.sketch</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                      {getInitials(selectedProject.learner.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">Completed "Wireframe Creation" task</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {getInitials(selectedProject.mentor.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">Added feedback on user research</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                      {getInitials(selectedProject.learner.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">Uploaded user research document</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            <p className="text-gray-600">Collaborate with mentors on hands-on learning projects</p>
          </div>
          <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new collaborative learning project with your mentor
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Title</label>
                  <Input placeholder="e.g., Build a Todo App" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="What will you build and learn?" />
                </div>
                <div>
                  <label className="text-sm font-medium">Mentor</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Chen</SelectItem>
                      <SelectItem value="marcus">Marcus Johnson</SelectItem>
                      <SelectItem value="david">David Kim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input type="date" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateProject(false)}>
                    Cancel
                  </Button>
                  <Button>Create Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'in_progress' ? 'default' : 'outline'}
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
          <Button
            size="sm"
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const taskStats = getTaskStats(project.tasks)
          
          return (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                {/* Tasks Summary */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{taskStats.completed}/{taskStats.total} tasks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">
                      {new Date(project.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={project.mentor.avatar_url} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {getInitials(project.mentor.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{project.mentor.full_name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{project.last_activity}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">Start your first collaborative project with a mentor</p>
          <Button className="mt-4" onClick={() => setShowCreateProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      )}
    </div>
  )
}
