<template>
  <section>
    <input ref="fileInput" type="file">
    <div v-show="isState([states.PLAYBACK, states.UPLOAD])">
      <video ref="videoPlayer" class="video-js vjs-default-skin"></video>
    </div>
    <div v-show="isState([states.LIVE_PREVIEW, states.RECORD_STARTED])">
      <video ref="livePreview" class="live-preview-video"></video>
    </div>
    <button v-if="isState([states.UPLOAD, states.PLAYBACK])" @click="requestUserMedia">
      Record
    </button>
    <button v-if="isState(states.LIVE_PREVIEW)" @click="startRecording">
      Start
    </button>
    <button v-if="isState(states.RECORD_STARTED)" @click="stopRecording">
      End
    </button>
  </section>
</template>

<script>
import videojs from 'video.js'
import RecordRTC from 'recordrtc'
import 'video.js/dist/video-js.css'

export default {
  data () {
    return {
      videojsRef: null,
      fileReader: new FileReader(),
      videoBlob: null,
      stream: null,
      recorder: null,
      states: {
        UPLOAD: 0,
        PLAYBACK: 1,
        LIVE_PREVIEW: 2,
        RECORD_STARTED: 3
      },
      currentState: 0,
      videoOptions: {
        controls: true,
        autoplay: 'auto',
        fluid: true
      }
    }
  },
  mounted () {
    this.initVideoJs(this.$refs.videoPlayer)
    this.addFileInputListener()
    this.currentState = this.states.UPLOAD
  },
  methods: {
    initVideoJs (el) {
      let options = { ...this.videoOptions }
      this.videojsRef = videojs(el, options, () => {
        let msg = 'Using video.js ' + videojs.VERSION +
          ' and recordrtc ' + RecordRTC.version
        videojs.log(msg)
      })
    },
    setVideoJsSource (src, type) {
      this.videojsRef.src([{ src, type }])
    },
    addFileInputListener () {
      this.$refs.fileInput.onchange = (event) => {
        if (event.target.files && event.target.files[0]) {
          this.currentState = this.states.PLAYBACK
          this.videoBlob = event.target.files[0]
          this.setVideoJsSource(URL.createObjectURL(this.videoBlob), this.videoBlob.type)
        }
      }
    },
    requestUserMedia () {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then((stream) => {
        this.stream = stream
        this.$refs.livePreview.srcObject = stream
        this.$refs.livePreview.play()
        this.recorder = RecordRTC(stream, {
          type: 'video'
        })
        this.currentState = this.states.LIVE_PREVIEW
      }).catch((e) => {
        if (e.name === 'NotAllowedError') {
          // TODO: ask user to accept permission
        }
        console.log(e)
      })
    },
    startRecording () {
      this.recorder.startRecording()
      this.currentState = this.states.RECORD_STARTED
    },
    stopRecording () {
      this.recorder.stopRecording(() => {
        this.videoBlob = this.recorder.getBlob()
        this.videojsRef.src([
          { src: URL.createObjectURL(this.videoBlob), type: 'video/webm' }
        ])
        this.currentState = this.states.PLAYBACK
      })
    },
    isState (state) {
      if (Array.isArray(state)) {
        return Object.values(state).some(s => s === this.currentState)
      } else {
        return this.currentState === state
      }
    }
  }
}
</script>

<style>
.live-preview-video {
  width: 100%;
}
</style>
