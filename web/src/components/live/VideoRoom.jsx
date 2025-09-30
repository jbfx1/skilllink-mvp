import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Users,
  Circle
} from 'lucide-react'
import { dailyService } from '@/lib/daily'
import { toast } from 'sonner'

export const VideoRoom = ({ roomUrl, userName, onLeave, isHost = false }) => {
  const containerRef = useRef(null)
  const [isJoined, setIsJoined] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [participants, setParticipants] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    if (containerRef.current && roomUrl) {
      joinCall()
    }

    return () => {
      leaveCall()
    }
  }, [roomUrl])

  const joinCall = async () => {
    try {
      await dailyService.joinRoom(containerRef.current, roomUrl, {
        userName
      })

      setIsJoined(true)
      toast.success('Joined video call')

      // Set up event listeners
      dailyService.on('participant-joined', handleParticipantUpdate)
      dailyService.on('participant-left', handleParticipantUpdate)
      dailyService.on('participant-updated', handleParticipantUpdate)
      dailyService.on('recording-started', () => setIsRecording(true))
      dailyService.on('recording-stopped', () => setIsRecording(false))
      dailyService.on('error', handleError)

      // Update initial participants
      updateParticipants()
    } catch (err) {
      console.error('Error joining call:', err)
      setError('Failed to join video call')
      toast.error('Failed to join video call')
    }
  }

  const leaveCall = async () => {
    try {
      await dailyService.leaveRoom()
      setIsJoined(false)
      if (onLeave) onLeave()
    } catch (err) {
      console.error('Error leaving call:', err)
    }
  }

  const handleParticipantUpdate = () => {
    updateParticipants()
  }

  const updateParticipants = () => {
    const currentParticipants = dailyService.getParticipants()
    setParticipants(currentParticipants)
  }

  const handleError = (error) => {
    console.error('Daily error:', error)
    setError(error.errorMsg || 'An error occurred')
    toast.error(error.errorMsg || 'Video call error')
  }

  const toggleVideo = async () => {
    try {
      const newState = await dailyService.toggleCamera()
      setIsVideoOn(newState)
    } catch (err) {
      toast.error('Failed to toggle camera')
    }
  }

  const toggleAudio = async () => {
    try {
      const newState = await dailyService.toggleMicrophone()
      setIsAudioOn(newState)
    } catch (err) {
      toast.error('Failed to toggle microphone')
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await dailyService.stopScreenShare()
        setIsScreenSharing(false)
        toast.success('Screen sharing stopped')
      } else {
        await dailyService.startScreenShare()
        setIsScreenSharing(true)
        toast.success('Screen sharing started')
      }
    } catch (err) {
      toast.error('Failed to toggle screen share')
    }
  }

  const toggleRecording = async () => {
    if (!isHost) {
      toast.error('Only the host can control recording')
      return
    }

    try {
      if (isRecording) {
        await dailyService.stopRecording()
        toast.success('Recording stopped')
      } else {
        await dailyService.startRecording()
        toast.success('Recording started')
      }
    } catch (err) {
      toast.error('Failed to toggle recording')
    }
  }

  const participantCount = Object.keys(participants).length

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Video Call Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={joinCall} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Video Container */}
      <Card className="w-full">
        <CardContent className="p-0">
          <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
          >
            {!isJoined && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                  <p>Joining video call...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      {isJoined && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Participant Count */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{participantCount} participants</span>
                {isRecording && (
                  <Badge variant="destructive" className="ml-2">
                    <Circle className="h-3 w-3 mr-1 fill-current" />
                    Recording
                  </Badge>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="icon"
                  onClick={toggleAudio}
                >
                  {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="icon"
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant={isScreenSharing ? "secondary" : "outline"}
                  size="icon"
                  onClick={toggleScreenShare}
                >
                  {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </Button>

                {isHost && (
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleRecording}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={leaveCall}
                  className="ml-2"
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}