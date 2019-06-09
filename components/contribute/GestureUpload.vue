<template>
  <Loader :progress="true" :active="loading" :progressValue="progressValue">
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
      <v-flex xs12 class="mt-3 pb-5">
        <v-layout row wrap>
          <v-flex md8 lg8 xs12>
            <div v-show="isState([states.UPLOAD.INIT, states.RECORD.INIT])" class="">
              <img :src="videoPlaceholder" alt="" class="full-width medium-round-corners overflow-hidden">
            </div>
            <div
              v-show="isState([states.UPLOAD.PLAYBACK, states.RECORD.PLAYBACK])"
              class="video-editor-wrapper medium-round-corners"
              dir="ltr"
            >
              <video ref="videoEditor" muted class="full-width">
                <source ref="videoEditorSrc" src="">
              </video>
              <div class="video-range-wrapper px-3">
                <v-icon class="mr-3 video-editor-icon" @click="toggleVideoEditorState">
                  {{ videoEditor.isPlaying ? 'pause' : 'play_arrow' }}
                </v-icon>
                <div class="full-width seek-bars-wrapper">
                  <range-slider
                    v-model="videoEditor.range"
                    :min="0"
                    :max="videoEditor.rangeMax"
                    :step="0.01"
                    class="video-range ma-0"
                    thumb-label
                    hide-details
                  ></range-slider>
                  <slider
                    v-model="videoEditor.seekPoint"
                    :min="videoEditor.range[0]"
                    :max="videoEditor.range[1]"
                    :step="0.01"
                    :style="`width: ${videoEditor.seekWidth}%; left: ${videoEditor.seekStartPosition}%`"
                    class="video-seek ma-0"
                    color="green"
                    hide-details
                    @change="setCurrentTime"
                  ></slider>
                </div>
              </div>
            </div>
            <div v-show="isState([states.RECORD.LIVE_PREVIEW, states.RECORD.RECORDING])" class="medium-round-corners overflow-hidden">
              <video ref="livePreview" muted class="full-width"></video>
            </div>
          </v-flex>
          <v-flex md4 lg4 xs12>
            <v-form ref="videoForm" class="px-2 word-data-form" @submit.prevent="submitVideo">
              <transition name="small-slide">
                <div
                  v-if="isParentState('UPLOAD') && isState(states.UPLOAD.PLAYBACK)"
                  key="0"
                  class="hidden-overflow"
                  :class="{ 'mb-3 mt-5': $vuetify.breakpoint.smAndDown }"
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
                  ref="autocomplete"
                  :label="autoCompleteLabel"
                  :itemText="autoCompleteItemText"
                  :deserializeResults="autoCompleteDeserializeResults"
                  :apiEndPoint="autoCompleteEndPoint"
                  :selectable="true"
                  :queryMinCharsCount="1"
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
                  إضافة
                </v-btn>
              </div>
            </v-form>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </Loader>
</template>

<script>
import AutoComplete from '~/components/generic/AutoComplete'
import Loader from '~/components/generic/Loader'
import Slider from '~/components/vuetify_custom/VSlider/VSlider'
import RangeSlider from '~/components/vuetify_custom/VRangeSlider/VRangeSlider'
import videoPlaceholder from '~/assets/images/contribute-placeholder.jpg'
import RecordRTC from 'recordrtc'
import getBlobDuration from 'get-blob-duration'

export default {
  components: {
    AutoComplete,
    Loader,
    Slider,
    RangeSlider
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
      VIDEO_MAX_SIZE: 10 * 1024 * 1024,
      videoPlaceholder,
      videoEditor: {
        isPlaying: false,
        range: [0, 0],
        rangeMax: 100,
        seekPoint: 0,
        seekWidth: 100,
        seekStartPosition: 0,
        setIntervalId: null,
        playNextTime: false
      },
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
      loading: false,
      progressValue: 0
    }
  },
  computed: {
    validForm () {
      return Boolean(this.word.name)
    }
  },
  watch: {
    'videoEditor.isPlaying': function (isPlaying) {
      if (isPlaying) {
        this.setIntervalId = setInterval(this.updateSeekBar, 10)
      } else {
        clearInterval(this.setIntervalId)
      }
    },
    'videoEditor.range': {
      handler: function (toRange, fromRange) {
        let duration = this.videoEditor.rangeMax
        this.$refs.videoEditor.pause()
        this.videoEditor.isPlaying = false
        this.videoEditor.seekWidth = ((toRange[1] - toRange[0]) / duration) * 100
        this.videoEditor.seekStartPosition = (toRange[0] / duration) * 100
        if (toRange[0] !== fromRange[0]) {
          this.$refs.videoEditor.currentTime = toRange[0]
          this.videoEditor.seekPoint = toRange[0]
          // when range end is modified then range start is modified
          // playNextTime is true, need to make it false
          this.videoEditor.playNextTime = false
        } else {
          this.$refs.videoEditor.currentTime = toRange[1]
          this.videoEditor.playNextTime = true
        }
      }
    }
  },
  created () {
    if (this.$route.params.parentState && this.$vuetify.breakpoint.lgAndUp) {
      this.setParentState(this.$route.params.parentState)
    }
  },
  mounted () {
    this.initVideoEditor()
    this.addFileInputListener()
    this.checkWordInQuery()
    this.state = this.states.UPLOAD.INIT
  },
  beforeDestroy () {
    this.releaseUserMedia()
  },
  methods: {
    initVideoEditor () {
      this.$refs.videoEditor.addEventListener('ended', () => {
        this.videoEditor.isPlaying = false
      })
    },
    addFileInputListener () {
      this.$refs.fileInput.onchange = (event) => {
        if (event.target.files && event.target.files[0]) {
          if (
            this.validateBlobSize(event.target.files[0]) &&
            this.validateBlobType(event.target.files[0])
          ) {
            this.state = this.states.UPLOAD.PLAYBACK
            this.videoBlob = event.target.files[0]
            this.setVideoEditorSrc()
          }
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
        } else {
          this.$store.commit('showErrorMsg', {
            message: 'متصفحك لا يدعم التسجيل برجاء رفع الفيديو'
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
      try {
        this.recorder.startRecording()
        this.state = this.states.RECORD.RECORDING
      } catch {
        this.$store.commit('showErrorMsg', {
          message: 'متصفحك لا يدعم التسجيل برجاء رفع الفيديو'
        })
      }
    },
    stopRecording () {
      this.recorder.stopRecording(() => {
        this.videoBlob = this.recorder.getBlob()
        if (this.videoBlob.size >= this.VIDEO_MAX_SIZE) {
          this.$store.commit('showInfoMsg', {
            message: `حجم الفيديو يجب الا يتعدى ${this.VIDEO_MAX_SIZE / (1024 * 1024)}mb `
          })
        } else {
          this.setVideoEditorSrc()
          this.state = this.states.RECORD.PLAYBACK
        }
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
        if (this.validateBlobType(file)) {
          this.state = this.states.UPLOAD.PLAYBACK
          this.videoBlob = file
          this.setVideoEditorSrc()
        }
      } else {
        this.$store.commit('showInfoMsg', {
          message: 'خاصية السحب والإسقاط غير مدعومة من خلال متصفحك'
        })
      }
    },
    setVideoEditorSrc () {
      this.$refs.videoEditorSrc.src = URL.createObjectURL(this.videoBlob)
      getBlobDuration(this.videoBlob).then((duration) => {
        let roundedDuration = duration.toFixed(2)
        this.videoEditor.rangeMax = roundedDuration
        this.videoEditor.range = [0, roundedDuration]
      })
      this.$nextTick(() => {
        this.$refs.videoEditor.load()
      })
    },
    updateSeekBar () {
      if (this.$refs.videoEditor.currentTime >= this.videoEditor.range[1]) {
        if (!this.videoEditor.playNextTime) {
          this.videoEditor.isPlaying = false
          this.$refs.videoEditor.pause()
        }
        this.$refs.videoEditor.currentTime = this.videoEditor.range[0]
        this.videoEditor.playNextTime = false
      }
      this.videoEditor.seekPoint = this.$refs.videoEditor.currentTime
    },
    setCurrentTime (val) {
      this.$refs.videoEditor.currentTime = val
    },
    validateBlobType (blob) {
      if (this.videoTypes.indexOf(blob.type) !== -1) {
        return true
      } else {
        this.$store.commit('showInfoMsg', {
          message: 'هذا النوع من الوسائط غير مدعوم'
        })
      }
    },
    validateBlobSize (blob) {
      if (blob.size < this.VIDEO_MAX_SIZE) {
        return true
      } else {
        this.$store.commit('showInfoMsg', {
          message: `حجم الفيديو يجب الا يتعدى ${this.VIDEO_MAX_SIZE / (1024 * 1024)}mb `
        })
      }
    },
    toggleVideoEditorState () {
      if (this.videoEditor.isPlaying) {
        this.$refs.videoEditor.pause()
        this.videoEditor.isPlaying = false
      } else {
        this.$refs.videoEditor.play()
        this.videoEditor.isPlaying = true
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
    resetComponentValues () {
      this.$refs.videoForm.reset()
      this.videoBlob = null
      this.videoEditor.isPlaying = false
      this.videoEditor.seekWidth = 100
      this.videoEditor.seekPoint = 0
      this.videoEditor.seekStartPosition = 0
    },
    updateProgressBar (event) {
      this.progressValue = Math.round((event.loaded / event.total) * 100)
    },
    getFormData () {
      let start = this.videoEditor.range[0]
      let finish = this.videoEditor.range[1]
      let formData = new FormData()
      formData.append('word', this.word.name)
      formData.append('video', this.videoBlob)
      if (start !== 0 || finish !== Number(this.videoEditor.rangeMax)) {
        formData.append('start', start)
        formData.append('finish', finish)
      }
      return formData
    },
    submitVideo () {
      if (this.$refs.videoForm.validate() && this.videoBlob) {
        this.loading = true
        let formData = this.getFormData()
        this.$axios.post(this.submitEndPoint, formData,
          {
            onUploadProgress: this.updateProgressBar
          })
          .then(() => {
            this.setParentState(this.getParentState())
            this.resetComponentValues()
            this.$store.commit('showSuccessMsg', {
              message: 'تم رفع الاشارة بنجاح'
            })
          })
          .catch(() => {
            this.$store.commit('showErrorMsg', {
              message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
            })
          })
          .finally(() => {
            this.loading = false
            this.progressValue = 0
          })
      }
    },
    checkWordInQuery () {
      if (this.$route.params.word) {
        this.$refs.autocomplete.setItem(this.$route.params.word)
      }
    }
  }
}
</script>

<style scoped>

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

.video-editor-wrapper {
  position: relative;
}

.video-range-wrapper {
  position: absolute;
  bottom: -43px;
  left: 0;
  height: 50px;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  display: flex;
}
.video-range-wrapper .seek-bars-wrapper {
  position: relative;
}
.video-range-wrapper .video-seek {
  position: absolute;
  width: 100%;
  top: 20px;
}
.seek-bars-wrapper .video-seek >>> .v-slider__thumb-container,
.seek-bars-wrapper .video-seek >>> .v-slider__track-fill {
  transition: none;
}
.seek-bars-wrapper >>> .v-slider__track__container,
.seek-bars-wrapper >>> .v-slider__track,
.seek-bars-wrapper >>> .v-slider__track-fill {
  height: 5px;
}
.video-range >>> .v-slider__thumb {
  width: 0;
  height: 0;
  left: -60px;
  border-left: 60px solid transparent !important;
  border-right: 60px solid transparent !important;
  border-top: 100px solid #2196F3 !important;
  background-color: transparent !important;
  border-radius: 0;
  transform: translateY(-56%) scale(0.15);
}
@media screen and (max-width: 1264px) and (min-width: 960px) {
  .recording-btn {
    width: 115px;
  }
}
</style>
