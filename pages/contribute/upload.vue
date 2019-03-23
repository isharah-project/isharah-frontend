<template>
  <v-container>
    <PageHeader icon="videocam" text="سجل فيديو" class="mb-0" />
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center mb-4">
        <v-btn
          class="orange-gradient video-method-btn btn-shadow title mx-2"
          :class="{ 'btn-active': isParentState('UPLOAD') }"
          flat
          dark
          round
          @click="state = states.UPLOAD.INIT"
        >
          إرفع
        </v-btn>
        <v-btn
          class="red-gradient video-method-btn btn-shadow title mx-2"
          :class="{ 'btn-active': isParentState('RECORD') }"
          flat
          dark
          round
          @click="state = states.RECORD.INIT"
        >
          سجل
        </v-btn>
      </v-flex>
      <v-flex v-if="isParentState('UPLOAD')" class="text-xs-center" xs12>
        <v-btn
          class="orange-gradient btn-shadow fixed-size-btn upload-btn"
          :class="{ 'chosen': videoBlob }"
          flat
          dark
          round
          @click="triggerFileInput"
        >
          {{ videoBlob ? videoBlob.name : 'أو اختار الملف' }}
        </v-btn>
      </v-flex>
      <v-flex
        v-if="isParentState('UPLOAD')"
        class="text-xs-center upload-zone round-corners"
        :class="{ 'shrink': videoBlob }"
        xs12
      >
        <input ref="fileInput" type="file" class="d-none">
        <p class="ma-0 upload-zone-phrase">
          السحب والإسقاط في اي مكان للتحميل
        </p>
        <br>
      </v-flex>
      <v-flex xs12 class="mt-3">
        <v-layout>
          <v-flex md7>
            <div v-show="isState([states.UPLOAD.INIT, states.RECORD.INIT])" class="">
              <img src="http://placehold.it/1280x720" alt="" class="full-width round-corners">
            </div>
            <div v-show="isState([states.UPLOAD.PLAYBACK, states.RECORD.PLAYBACK])">
              <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered"></video>
            </div>
            <div v-show="isState([states.RECORD.LIVE_PREVIEW, states.RECORD.RECORDING])">
              <video ref="livePreview" class="live-preview-video"></video>
            </div>
            <v-btn class="primary" @click="requestUserMedia">
              Record
            </v-btn>
            <v-btn class="primary" @click="startRecording">
              Start
            </v-btn>
            <v-btn class="primary" @click="stopRecording">
              End
            </v-btn>
          </v-flex>
        </v-layout>
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
      states: {
        UPLOAD: {
          INIT: 0,
          PLAYBACK: 1
        },
        RECORD: {
          INIT: 2,
          RECORDING: 3,
          LIVE_PREVIEW: 4,
          PLAYBACK: 5
        }
      },
      state: 0,
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
    this.state = this.states.UPLOAD.INIT
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
          this.state = this.states.UPLOAD.PLAYBACK
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
        this.state = this.states.RECORD.LIVE_PREVIEW
      }).catch((e) => {
        if (e.name === 'NotAllowedError') {
          // TODO: ask user to accept permission
        }
        console.log(e)
      })
    },
    startRecording () {
      this.recorder.startRecording()
      this.state = this.states.RECORD.RECORDING
    },
    stopRecording () {
      this.recorder.stopRecording(() => {
        this.videoBlob = this.recorder.getBlob()
        this.videojsRef.src([
          { src: URL.createObjectURL(this.videoBlob), type: 'video/webm' }
        ])
        this.state = this.states.RECORD.PLAYBACK
      })
    },
    triggerFileInput () {
      this.$refs.fileInput.click()
    },
    isParentState (parent) {
      return Object.values(this.states[parent]).some(state => state === this.state)
    },
    isState (testState) {
      if (Array.isArray(testState)) {
        return Object.values(testState).some(s => s === this.state)
      } else {
        return this.state === testState
      }
    }
  }
}
</script>

<style>

.btn-active {
  transform: translateY(5px);
}
.upload-zone {
  height: 130px;
  border: 1px solid #c7c7c7;
  padding-top: 25px;
  transition: 0.3s ease-in-out 0.5s;
  transform-origin: top;
}
.upload-zone.shrink {
  height: 0;
  padding: 0;
  border: none;
}
.upload-zone.shrink > p {
  display: none;
}
.upload-btn {
  margin-bottom: -190px;
  transition: 0.3s ease-in-out 0.5s;
}
.upload-btn.chosen {
  margin: 0;
}
.live-preview-video {
  width: 100%;
}
.video-method-btn {
  width: 200px;
  height: 50px;
}
</style>
