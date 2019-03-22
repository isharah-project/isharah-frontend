<template>
  <v-container>
    <PageHeader icon="videocam" text="سجل فيديو" />
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center">
        <v-btn
          class="orange-gradient round-corners video-method-btn btn-shadow title mx-2"
          :class="{ 'btn-active': isState(selectedState, selectedStates.UPLOAD) }"
          flat
          dark
          @click="selectedState = selectedStates.UPLOAD"
        >
          إرفع
        </v-btn>
        <v-btn
          class="red-gradient round-corners video-method-btn btn-shadow title mx-2"
          :class="{ 'btn-active': isState(selectedState, selectedStates.RECORD) }"
          flat
          dark
          @click="selectedState = selectedStates.RECORD"
        >
          سجل
        </v-btn>
      </v-flex>
      <v-flex
        v-if="isState(selectedState, selectedStates.UPLOAD)"
        class="text-xs-center pa-5"
        xs12
      >
        <p>السحب والإسقاط في اي مكان للتحميل</p>
        <br>
        <v-btn class="orange-gradient fixed-size-btn" flat dark round>
          او اضغط هنا
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <input ref="fileInput" type="file">
        <div v-show="isState(videoState, [videoStates.PLAYBACK, videoStates.UPLOAD])" style="width: 50%">
          <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered"></video>
        </div>
        <div v-show="isState(videoState, [videoStates.LIVE_PREVIEW, videoStates.RECORD_STARTED])" style="width: 50%">
          <video ref="livePreview" class="live-preview-video"></video>
        </div>
        <v-btn v-if="isState(videoState, [videoStates.UPLOAD, videoStates.PLAYBACK])" class="primary" @click="requestUserMedia">
          Record
        </v-btn>
        <v-btn v-if="isState(videoState, videoStates.LIVE_PREVIEW)" class="primary" @click="startRecording">
          Start
        </v-btn>
        <v-btn v-if="isState(videoState, videoStates.RECORD_STARTED)" class="primary" @click="stopRecording">
          End
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import videojs from 'video.js'
import RecordRTC from 'recordrtc'
import 'video.js/dist/video-js.css'
import '~/assets/rangeslider-videojs/rangeslider.css'
import PageHeader from '~/components/generic/PageHeader'
// require('~/assets/rangeslider-videojs/rangeslider.js')

export default {
  components: { PageHeader },
  data () {
    return {
      videojsRef: null,
      fileReader: new FileReader(),
      videoBlob: null,
      stream: null,
      recorder: null,
      videoStates: {
        UPLOAD: 0,
        PLAYBACK: 1,
        LIVE_PREVIEW: 2,
        RECORD_STARTED: 3
      },
      selectedStates: {
        UPLOAD: 0,
        RECORD: 1
      },
      videoState: 0,
      selectedState: 0,
      videoOptions: {
        controls: true,
        autoplay: 'auto',
        fluid: true
      }
    }
  },
  mounted () {
    // window.videojs = videojs
    this.initVideoJs(this.$refs.videoPlayer)
    this.addFileInputListener()
    this.videoState = this.videoStates.UPLOAD
  },
  methods: {
    initVideoJs (el) {
      let options = { ...this.videoOptions }
      this.videojsRef = videojs(el, options, () => {
        let msg = 'Using video.js ' + videojs.VERSION +
          ' and recordrtc ' + RecordRTC.version
        videojs.log(msg)
      })
      // this.videojsRef.rangeslider()
    },
    setVideoJsSource (src, type) {
      this.videojsRef.src([{ src, type }])
    },
    addFileInputListener () {
      this.$refs.fileInput.onchange = (event) => {
        if (event.target.files && event.target.files[0]) {
          this.videoState = this.videoStates.PLAYBACK
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
        this.videoState = this.videoStates.LIVE_PREVIEW
      }).catch((e) => {
        if (e.name === 'NotAllowedError') {
          // TODO: ask user to accept permission
        }
        console.log(e)
      })
    },
    startRecording () {
      this.recorder.startRecording()
      this.videoState = this.videoStates.RECORD_STARTED
    },
    stopRecording () {
      this.recorder.stopRecording(() => {
        this.videoBlob = this.recorder.getBlob()
        this.videojsRef.src([
          { src: URL.createObjectURL(this.videoBlob), type: 'video/webm' }
        ])
        this.videoState = this.videoStates.PLAYBACK
      })
    },
    isState (state, testState) {
      if (Array.isArray(testState)) {
        return Object.values(testState).some(s => s === state)
      } else {
        return state === testState
      }
    }
  }
}
</script>

<style>
.live-preview-video {
  width: 100%;
}
.video-method-btn {
  width: 200px;
  height: 50px;
}
.btn-active {
  transform: translateY(5px);
}
</style>
