<template>
  <v-container>
    <PageHeader icon="videocam" text="سجل فيديو" class="mb-0" />
    <v-layout row wrap>
      <v-flex
        xs12
        class="text-xs-center"
        :class="{ 'mb-4': isParentState('UPLOAD') && isState(states.UPLOAD.INIT) }"
      >
        <v-btn
          class="orange-gradient video-method-btn btn-shadow title mx-2"
          :class="{ 'btn-active': isParentState('UPLOAD') }"
          flat
          dark
          round
          @click="setParentState('UPLOAD')"
        >
          إرفع
        </v-btn>
        <v-btn
          class="red-gradient video-method-btn btn-shadow title mx-2"
          :class="{ 'btn-active': isParentState('RECORD') }"
          flat
          dark
          round
          @click="setParentState('RECORD')"
        >
          سجل
        </v-btn>
      </v-flex>
      <input ref="fileInput" type="file" :accept="videoTypes.join(',')" class="d-none">
      <v-flex
        ref="dragZone"
        :class="{ 'expanded': isParentState('UPLOAD') && isState(states.UPLOAD.INIT) }"
        class="text-xs-center drag-zone round-corners"
        xs12
        @drag.prevent.stop
        @dragstart.prevent.stop
        @dragenter.prevent.stop="changeDragState(true)"
        @dragover.prevent.stop="changeDragState(true)"
        @dragleave.prevent.stop="changeDragState(false)"
        @dragend.prevent.stop="changeDragState(false)"
        @drop.prevent.stop="handleDroppedFiles($event)"
      >
        <p class="mt-4 drag-zone-phrase">
          السحب والإسقاط في اي مكان للتحميل
        </p>
        <v-btn
          class="orange-gradient btn-shadow fixed-size-btn upload-btn"
          flat
          dark
          round
          @click="triggerFileInput"
        >
          أو اختر الملف
        </v-btn>
      </v-flex>
      <v-flex xs12 class="mt-3">
        <v-layout row wrap>
          <v-flex md8 lg8 xs12>
            <div v-show="isState([states.UPLOAD.INIT, states.RECORD.INIT])" class="">
              <img src="http://placehold.it/1280x720" alt="" class="full-width round-corners overflow-hidden">
            </div>
            <div v-show="isState([states.UPLOAD.PLAYBACK, states.RECORD.PLAYBACK])" class="round-corners overflow-hidden">
              <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered"></video>
            </div>
            <div v-show="isState([states.RECORD.LIVE_PREVIEW, states.RECORD.RECORDING])" class="round-corners overflow-hidden">
              <video ref="livePreview" class="live-preview-video"></video>
            </div>
          </v-flex>
          <v-flex md4 lg4 xs12>
            <v-form class="px-2 word-data-form" @submit.prevent="submitVideo">
              <div>
                <v-btn
                  v-if="isParentState('UPLOAD') && isState(states.UPLOAD.PLAYBACK)"
                  class="blue-cyan-gradient btn-shadow upload-btn"
                  flat
                  dark
                  round
                  @click="triggerFileInput"
                >
                  {{ videoBlob.name }}
                </v-btn>
              </div>
              <div v-if="isParentState('RECORD')">
                <v-btn
                  class="recording-btn red-gradient"
                  round
                  flat
                  dark
                  @click="startRecording"
                >
                  تسجيل
                </v-btn>
                <v-btn
                  class="recording-btn red-border-btn"
                  round
                  flat
                  @click="stopRecording"
                >
                  وقف
                </v-btn>
              </div>
              <div>
                <!-- TODO make autocomplete component -->
                <v-autocomplete
                  v-model="selectedWord"
                  :items="wordSearchResults"
                  :loading="false"
                  :search-input.sync="wordSearchQuery"
                  class="round-input light-shadow-input full-width my-3"
                  chips
                  clearable
                  hide-details
                  hide-selected
                  label="الكلمة"
                  solo
                ></v-autocomplete>
                <v-select
                  v-model="word.part_of_speech"
                  :items="partOfSpeechTypes"
                  class="round-input light-shadow-input full-width my-3"
                  menu-props="auto"
                  label="إختر نوع الكلمة"
                  hide-details
                  single-line
                  solo
                ></v-select>
                <v-select
                  v-model="word.category"
                  :items="categories"
                  :multiple="true"
                  item-text="name"
                  item-value="name"
                  class="round-input light-shadow-input full-width my-3"
                  menu-props="auto"
                  label="إختر فئة الكلمة"
                  hide-details
                  single-line
                  chips
                  solo
                ></v-select>
              </div>
              <div>
                <v-btn type="submit" class="orange-gradient btn-shadow fixed-size-btn" round flat dark>
                  حفظ
                </v-btn>
              </div>
            </v-form>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PageHeader from '~/components/generic/PageHeader'
import videojs from 'video.js'
import RecordRTC from 'recordrtc'
import 'video.js/dist/video-js.css'
window.videojs = videojs

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
      },
      word: {
        name: null,
        part_of_speech: null,
        category: null
      },
      categories: [],
      wordSearchResults: [],
      wordSearchQuery: null,
      selectedWord: null
    }
  },
  async asyncData ({ app, store, $axios }) {
    try {
      let response = (await $axios.get('/categories')).data
      let categories = store.state.deserialize(response)
      return { categories }
    } catch (e) {
      // TODO
      console.log(e)
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
    requestUserMedia (callback) {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then((stream) => {
        this.stream = stream
        this.$refs.livePreview.srcObject = stream
        this.$refs.livePreview.play()
        this.recorder = RecordRTC(stream, {
          type: 'video'
        })
        if (callback) callback()
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
    changeDragState (isDragging) {
      let dragZone = this.$refs.dragZone
      isDragging ? dragZone.classList.add('is-dragging') : dragZone.classList.remove('is-dragging')
    },
    handleDroppedFiles (event) {
      let dragZone = this.$refs.dragZone
      dragZone.classList.remove('is-dragging')
      if (event.dataTransfer && event.dataTransfer.files.length) {
        let file = event.dataTransfer.files[0]
        if (this.videoTypes.indexOf(file.type) !== -1) {
          this.state = this.states.UPLOAD.PLAYBACK
          this.videoBlob = file
          this.setVideoJsSource(URL.createObjectURL(this.videoBlob), this.videoBlob.type)
        } else {
          console.log('not supported video type')
          // TODO: show video type support error message
        }
      } else {
        // TODO: show drag & drop not support error
      }
    },
    setParentState (parent) {
      if (this.isParentState(parent)) return
      if (parent === 'RECORD') {
        this.requestUserMedia(() => {
          this.state = this.states.RECORD.LIVE_PREVIEW
        })
      } else if (parent === 'UPLOAD') {
        this.state = this.states.UPLOAD.INIT
        if (this.stream) {
          this.stream.getTracks()[0].stop()
        }
      }
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
    },
    submitVideo () {
      // TODO
    }
  }
}
</script>

<style scoped>

.btn-active {
  transform: translateY(5px);
}
@media screen and (max-width: 515px) {
  .btn-active {
    transform: translateX(5px);
  }
}

.drag-zone {
  height: 0;
  overflow: hidden;
  /*border-width: 0;*/
  opacity: 0;
  transition: height 0.5s ease-out 0.5s, opacity 0.5s ease-out 0.5s;
}
.drag-zone.expanded {
  height: 130px;
  border: 1px solid #c7c7c7;
  opacity: 1;
}
.drag-zone.is-dragging {
  background: #d8d8d8;
  border: 2px dashed #000;
}

.live-preview-video {
  width: 100%;
}
.video-method-btn {
  width: 200px;
  height: 50px;
}

.word-data-form {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-evenly;
}
.recording-btn {
  width: 150px;
  height: 40px;
}
@media screen and (max-width: 1264px) and (min-width: 960px) {
  .recording-btn {
    width: 115px;
  }
}
</style>
