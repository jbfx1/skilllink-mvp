import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const SKILL_OPTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Machine Learning',
  'UI/UX Design', 'Graphic Design', 'Marketing', 'Sales', 'Writing',
  'Photography', 'Carpentry', 'Plumbing', 'Fitness Training', 'Nutrition'
]

export const AuthForm = () => {
  const { signIn, signUp, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('signin')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  })

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'learner',
    bio: '',
    skills: [],
    interests: []
  })

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!signInData.email || !signInData.password) {
      setError('Please fill in all fields')
      return
    }

    const { error } = await signIn(signInData.email, signInData.password)
    if (error) {
      setError(error.message)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!signUpData.email || !signUpData.password || !signUpData.fullName) {
      setError('Please fill in all required fields')
      return
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const userData = {
      full_name: signUpData.fullName,
      role: signUpData.role,
      bio: signUpData.bio,
      skills: signUpData.skills,
      interests: signUpData.interests
    }

    const { error } = await signUp(signUpData.email, signUpData.password, userData)
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Account created successfully! Please check your email to verify your account.')
    }
  }

  const addSkill = (skill) => {
    if (!signUpData.skills.includes(skill)) {
      setSignUpData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    }
  }

  const removeSkill = (skill) => {
    setSignUpData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addInterest = (interest) => {
    if (!signUpData.interests.includes(interest)) {
      setSignUpData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
    }
  }

  const removeInterest = (interest) => {
    setSignUpData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">SkillLink</CardTitle>
          <CardDescription>Connect, Learn, and Grow Together</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                <p>Demo accounts:</p>
                <p>Learner: learner@test.com / Demo1234!</p>
                <p>Mentor: mentor@test.com / Demo1234!</p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name *</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-role">Role</Label>
                  <Select value={signUpData.role} onValueChange={(value) => setSignUpData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learner">Learner - I want to learn new skills</SelectItem>
                      <SelectItem value="mentor">Mentor - I want to teach and help others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-bio">Bio</Label>
                  <Textarea
                    id="signup-bio"
                    placeholder="Tell us about yourself..."
                    value={signUpData.bio}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills {signUpData.role === 'mentor' ? '(What can you teach?)' : '(What do you want to learn?)'}</Label>
                  <Select onValueChange={addSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add skills..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_OPTIONS.filter(skill => !signUpData.skills.includes(skill)).map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {signUpData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {signUpData.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password *</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
