import DailyIframe from '@daily-co/daily-js'

class DailyService {
  constructor() {
    this.callFrame = null
    this.apiKey = import.meta.env.VITE_DAILY_API_KEY
  }

  /**
   * Create a new Daily room for a live class
   * @param {string} classId - The live class ID
   * @returns {Promise<{url: string, roomName: string}>}
   */
  async createRoom(classId) {
    try {
      const response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          name: `skilllink-class-${classId}`,
          privacy: 'private',
          properties: {
            start_video_off: false,
            start_audio_off: false,
            enable_chat: true,
            enable_screenshare: true,
            enable_recording: 'cloud',
            max_participants: 100
          }
        })
      })

      const data = await response.json()
      return {
        url: data.url,
        roomName: data.name
      }
    } catch (error) {
      console.error('Error creating Daily room:', error)
      throw error
    }
  }

  /**
   * Initialize video call frame
   * @param {HTMLElement} containerEl - Container element for video
   * @param {string} roomUrl - Daily room URL
   * @param {Object} options - Additional options
   */
  async joinRoom(containerEl, roomUrl, options = {}) {
    try {
      this.callFrame = DailyIframe.createFrame(containerEl, {
        iframeStyle: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '8px'
        },
        showLeaveButton: true,
        showFullscreenButton: true,
        ...options
      })

      await this.callFrame.join({
        url: roomUrl,
        userName: options.userName || 'Guest'
      })

      return this.callFrame
    } catch (error) {
      console.error('Error joining Daily room:', error)
      throw error
    }
  }

  /**
   * Leave current call
   */
  async leaveRoom() {
    if (this.callFrame) {
      await this.callFrame.leave()
      this.callFrame.destroy()
      this.callFrame = null
    }
  }

  /**
   * Get current call state
   */
  getCallState() {
    return this.callFrame?.meetingState()
  }

  /**
   * Toggle camera
   */
  async toggleCamera() {
    if (this.callFrame) {
      const localVideo = this.callFrame.localVideo()
      await this.callFrame.setLocalVideo(!localVideo)
      return !localVideo
    }
  }

  /**
   * Toggle microphone
   */
  async toggleMicrophone() {
    if (this.callFrame) {
      const localAudio = this.callFrame.localAudio()
      await this.callFrame.setLocalAudio(!localAudio)
      return !localAudio
    }
  }

  /**
   * Start screen share
   */
  async startScreenShare() {
    if (this.callFrame) {
      await this.callFrame.startScreenShare()
    }
  }

  /**
   * Stop screen share
   */
  async stopScreenShare() {
    if (this.callFrame) {
      await this.callFrame.stopScreenShare()
    }
  }

  /**
   * Start recording
   */
  async startRecording() {
    if (this.callFrame) {
      await this.callFrame.startRecording()
    }
  }

  /**
   * Stop recording
   */
  async stopRecording() {
    if (this.callFrame) {
      await this.callFrame.stopRecording()
    }
  }

  /**
   * Get participants list
   */
  getParticipants() {
    if (this.callFrame) {
      return this.callFrame.participants()
    }
    return {}
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (this.callFrame) {
      this.callFrame.on(event, callback)
    }
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.callFrame) {
      this.callFrame.off(event, callback)
    }
  }
}

export const dailyService = new DailyService()
export default dailyService