<template>
  <section>
    <input ref="fileInput" type="file">
    <div v-show="currentState === states.UPLOAD">
      <video ref="uploadVideo" class="video-js vjs-default-skin"></video>
    </div>
    <div v-show="currentState === states.RECORD" data-vjs-player>
      <video id="recordVideo" ref="recordVideo" class="video-js vjs-default-skin"></video>
    </div>
  </section>
</template>

<script>
import 'videojs-record/dist/css/videojs.record.css'
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import 'webrtc-adapter'
/* eslint-disable-next-line */
import RecordRTC from 'recordrtc'
import 'videojs-record/dist/videojs.record.js'

export default {
  data () {
    return {
      videojsRecordRef: null,
      videojsUploadRef: null,
      fileReader: new FileReader(),
      videoBlob: null,
      states: {
        NONE: 0,
        UPLOAD: 1,
        RECORD: 2
      },
      currentState: 0,
      videoOptions: {
        controls: true,
        autoplay: false,
        fluid: true,
        width: 800
      },
      recorderOptions: {
        video: true,
        image: false,
        audio: false,
        debug: true
      }
    }
  },
  mounted () {
    this.initVideoJs('videojsRecordRef', this.$refs.recordVideo, true)
    this.initVideoJs('videojsUploadRef', this.$refs.uploadVideo, false)
    this.videojsRecordRef.on('startRecord', function () {
      console.log('started recording!')
    })
    this.videojsRecordRef.on('stopRecord', function () {
      console.log('started recording!')
      console.log(this.videojsRecordRef.recordedData)
    })
    this.addFileInputListener()
    this.currentState = this.states.RECORD
  },
  methods: {
    initVideoJs (ref, el, initRecorder) {
      let options = { ...this.videoOptions }
      if (initRecorder) options = { ...options, plugins: { record: this.recorderOptions } }
      this[ref] = videojs(el, options)
    },
    addFileInputListener () {
      this.$refs.fileInput.onchange = (event) => {
        if (event.target.files && event.target.files[0]) {
          this.currentState = this.states.UPLOAD
          this.videoBlob = event.target.files[0]
          this.videojsUploadRef.src([
            { src: URL.createObjectURL(this.videoBlob), type: this.videoBlob.type }
          ])
        }
      }
    }
  }
}
</script>

<style>

</style>
