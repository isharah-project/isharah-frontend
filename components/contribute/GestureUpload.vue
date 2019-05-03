<template>
  <v-layout row wrap>
    <v-flex
      v-if="$vuetify.breakpoint.lgAndUp"
      xs12
      class="text-xs-center"
    >
      <v-btn
        class="orange-gradient video-method-btn btn-shadow title mx-2"
        :class="{ 'btn-active': isParentState('UPLOAD') }"
        flat
        dark
        round
        @click="!isParentState('UPLOAD') ? setParentState('UPLOAD') : null"
      >
        رفع
      </v-btn>
      <v-btn
        class="red-gradient video-method-btn btn-shadow title mx-2"
        :class="{ 'btn-active': isParentState('RECORD') }"
        flat
        dark
        round
        @click="!isParentState('RECORD') ? setParentState('RECORD') : null"
      >
        تسجيل
      </v-btn>
    </v-flex>
    <input ref="fileInput" type="file" :accept="videoTypes.join(',')" class="d-none">
    <v-flex
      ref="dragZone"
      :class="{ 'expanded': isParentState('UPLOAD') && isState(states.UPLOAD.INIT) }"
      class="text-xs-center drag-zone medium-round-corners mt-3"
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
            <img src="~/assets/images/contribute-placeholder.jpg" alt="" class="full-width medium-round-corners overflow-hidden">
          </div>
          <div v-show="isState([states.UPLOAD.PLAYBACK, states.RECORD.PLAYBACK])" class="medium-round-corners overflow-hidden">
            <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered"></video>
          </div>
          <div v-show="isState([states.RECORD.LIVE_PREVIEW, states.RECORD.RECORDING])" class="medium-round-corners overflow-hidden">
            <video ref="livePreview" class="live-preview-video"></video>
          </div>
        </v-flex>
        <v-flex md4 lg4 xs12>
          <v-form ref="videoForm" v-model="validForm" class="px-2 word-data-form" @submit.prevent="submitVideo">
            <transition name="small-slide">
              <div
                v-if="isParentState('UPLOAD') && isState(states.UPLOAD.PLAYBACK)"
                key="0"
                class="hidden-overflow"
                :class="{ 'my-3': $vuetify.breakpoint.smAndDown }"
              >
                <v-btn
                  class="blue-cyan-gradient btn-shadow upload-btn"
                  flat
                  dark
                  round
                  @click="triggerFileInput"
                >
                  {{ videoBlob.name }}
                </v-btn>
              </div>
            </transition>
            <transition name="small-slide">
              <div v-if="isParentState('RECORD')" key="1" class="hidden-overflow">
                <v-btn
                  class="recording-btn red-gradient"
                  round
                  flat
                  dark
                  :disabled="isState(states.RECORD.RECORDING)"
                  @click="startRecording"
                >
                  تسجيل
                </v-btn>
                <v-btn
                  class="recording-btn red-border-btn"
                  round
                  flat
                  :disabled="!isState(states.RECORD.RECORDING)"
                  @click="stopRecording"
                >
                  وقف
                </v-btn>
              </div>
            </transition>
            <div>
              <AutoComplete
                :label="autoCompleteLabel"
                :itemText="autoCompleteItemText"
                :deserializeResults="autoCompleteDeserializeResults"
                :apiEndPoint="autoCompleteEndPoint"
                :selectable="true"
                :rules="generalValidationRules.required"
                prependIcon=""
                class="round-input light-shadow-input full-width"
                @itemChanged="setSelectedWord"
              />
              <transition name="big-slide">
                <div v-if="word.name" class="hidden-overflow">
                  <div class="mt-3">
                    <h3>نوع الكلمة</h3>
                    <v-chip>{{ word.part_of_speech }}</v-chip>
                  </div>
                  <div class="mt-3">
                    <h3>فئات الكلمة</h3>
                    <v-chip v-for="category in word.categories" :key="category.name">
                      {{ category.name }}
                    </v-chip>
                  </div>
                </div>
              </transition>
            </div>
            <div>
              <v-btn
                type="submit"
                class="orange-gradient btn-shadow fixed-size-btn"
                :class="{ 'my-3': $vuetify.breakpoint.smAndDown }"
                :disabled="!validForm || !videoBlob"
                round
                flat
                dark
              >
                حفظ
              </v-btn>
            </div>
          </v-form>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import AutoComplete from '~/components/generic/AutoComplete'
import videojs from 'video.js'
import RecordRTC from 'recordrtc'
import 'video.js/dist/video-js.css'
window.videojs = videojs

export default {
  components: {
    AutoComplete
  },
  props: {
    submitEndPoint: {
      type: String,
      required: true
    },
    autoCompleteEndPoint: {
      type: String,
      required: true
    },
    autoCompleteItemText: {
      type: [String, Boolean],
      required: true
    },
    autoCompleteDeserializeResults: {
      type: Boolean,
      required: true
    },
    autoCompleteLabel: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      videojsRef: null,
      fileReader: new FileReader(),
      videoBlob: null,
      streams: [],
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
      videoOptions: {
        controls: true,
        autoplay: 'auto',
        fluid: true
      },
      word: {
        name: '',
        part_of_speech: null,
        categories: null
      },
      wordSearchResults: [],
      wordSearchQuery: null,
      validForm: false
    }
  },
  created () {
    if (this.$route.params.parentState && this.$vuetify.breakpoint.lgAndUp) {
      this.setParentState(this.$route.params.parentState)
    }
  },
  mounted () {
    // window.videojs = videojs
    this.initVideoJs(this.$refs.videoPlayer)
    this.addFileInputListener()
    this.state = this.states.UPLOAD.INIT
  },
  beforeDestroy () {
    this.releaseUserMedia()
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
        this.streams.push(stream)
        this.$refs.livePreview.srcObject = stream
        this.$refs.livePreview.play()
        this.recorder = RecordRTC(stream, {
          type: 'video'
        })
        if (callback) callback()
      }).catch((e) => {
        if (e.name === 'NotAllowedError') {
          this.$store.commit('showInfoMsg', {
            message: 'لتتمكن من التسجيل يجب السماح بالوصول الى الكاميرا'
          })
        }
      })
    },
    releaseUserMedia () {
      if (this.streams.length) {
        this.streams.forEach(stream => stream.getTracks()[0].stop())
      }
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
          this.$store.commit('showInfoMsg', {
            message: 'هذا النوع من الوسائط غير مدعوم'
          })
        }
      } else {
        this.$store.commit('showInfoMsg', {
          message: 'خاصية السحب والإسقاط غير مدعومة من خلال متصفحك'
        })
      }
    },
    setParentState (parent) {
      if (parent === 'RECORD') {
        this.requestUserMedia(() => {
          this.state = this.states.RECORD.LIVE_PREVIEW
        })
      } else if (parent === 'UPLOAD') {
        this.state = this.states.UPLOAD.INIT
        this.releaseUserMedia()
      }
    },
    getParentState () {
      let result
      Object.keys(this.states).forEach((parentState) => {
        if (Object.values(this.states[parentState]).some(state => state === this.state)) {
          result = parentState
        }
      })
      return result
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
    setSelectedWord (word) {
      if (word) {
        if (this.autoCompleteDeserializeResults) {
          // word is an object (in practice mode)
          this.word = word
        } else {
          // word is a string (in add word mode)
          this.word.name = word
        }
      } else {
        this.word = {
          name: null,
          part_of_speech: null,
          categories: null
        }
        this.$refs.videoForm.reset()
      }
    },
    submitVideo () {
      if (this.$refs.videoForm.validate() && this.videoBlob) {
        let formData = new FormData()
        formData.append('word', this.word.name)
        formData.append('video', this.videoBlob)
        this.$axios.post(this.submitEndPoint, formData).then(() => {
          this.$refs.videoForm.reset()
          this.setParentState(this.getParentState())
          this.videoBlob = null
          this.$store.commit('showSuccessMsg', {
            message: 'تم رفع الاشارة بنجاح'
          })
        }).catch((e) => {
          this.$store.commit('showErrorMsg', {
            message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
          })
        })
      }
    }
  }
}
</script>

<style>
.hidden-overflow {
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s 0.8s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.small-slide-enter-active,
.small-slide-leave-active,
.big-slide-enter-active,
.big-slide-leave-active {
  transform-origin: top;
  transition: max-height .7s;
}
.small-slide-enter,
.small-slide-leave-to,
.big-slide-enter,
.big-slide-leave-to {
  max-height: 0;
}

.small-slide-leave,
.small-slide-enter-to {
  max-height: 60px;
}

.big-slide-leave,
.big-slide-enter-to {
  max-height: 250px;
}

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
  opacity: 0;
  border: 1px solid #c7c7c7;
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
