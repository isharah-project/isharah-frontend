<template>
  <v-container class="mt-3">
    <PageHeader icon="videocam" text="تدرب على إشارة" mb="mb-2" />
    <p class="subheading pb-3 pr-5">
      قم باختيار كلمة ثم قم برفع أو تسجيل فيديو تقوم فيه بأداء الإشارة لهذه الكلمة وبعدها ستحصل على النتيجة.
      <br>
    </p>
    <Loader :progress="true" :active="loading" :progressValue="progressValue">
      <GestureUpload ref="gestureUpload" submitEndPoint="gestures">
        <v-form ref="videoForm" class="form-wrapper" @submit.prevent="submitVideo">
          <div>
            <AutoComplete
              ref="autocomplete"
              label="اختر الكلمة"
              itemText="name"
              apiEndPoint="autocomplete/words"
              :deserializeResults="true"
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
          <div class="mt-2">
            <v-btn
              type="submit"
              class="orange-gradient btn-shadow fixed-size-btn"
              :class="{ 'my-3': $vuetify.breakpoint.smAndDown }"
              :disabled="!validForm || !$refs.gestureUpload.videoBlob"
              round
              flat
              dark
            >
              إضافة
            </v-btn>
          </div>
        </v-form>
      </GestureUpload>
    </Loader>
    <v-dialog v-model="instructionsDialog" width="600" persistent>
      <v-card class="medium-round-corners">
        <v-card-title class="justify-center">
          <h1>
            التعليمات
          </h1>
        </v-card-title>
        <v-card-text>
          <ul class="px-4">
            <li>
              يفصل أن تكون الخلفية بيضاء أو فاتحة
            </li>
            <li>
              لا تقم بأداء الإشارة بسرعة
            </li>
            <li>
              يجب التصوير في ظروف إضاءة جيدة
            </li>
            <li>
              يفضل ظهور المشارك في منتصف كادر الفيديو
            </li>
            <li>
              بعد رفع الفيديو او التسجيل يمكنك اقتصاص الفيديو من البداية والنهاية عن طريق الأداة الموضحة بالأسفل والتي ستكون بأسفل الفيديو
            </li>
          </ul>
          <img :src="VideoTrimmer" alt="video trimmer example" class="full-width btn-shadow mt-3">
        </v-card-text>
        <v-card-actions>
          <v-checkbox v-model="dontShowInstructions" color="primary" label="لا تظهر التعليمات مرة أخرى" hide-details />
        </v-card-actions>
        <v-card-actions class="justify-center pt-0">
          <v-btn class="blue-gradient fixed-size-btn btn-shadow" round dark @click="saveSettings">
            موافق
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageHeader from '~/components/generic/PageHeader'
import GestureUpload from '~/components/contribute/GestureUpload'
import AutoComplete from '~/components/generic/AutoComplete'
import Loader from '~/components/generic/Loader'
import localStorage from 'local-storage'
import VideoTrimmer from '~/assets/images/video-trimmer.png'

export default {
  components: {
    PageHeader,
    GestureUpload,
    AutoComplete,
    Loader
  },
  data () {
    return {
      VideoTrimmer,
      instructionsDialog: true,
      dontShowInstructions: false,
      progressValue: 0,
      loading: false,
      word: {
        name: '',
        part_of_speech: null,
        categories: null
      }
    }
  },
  computed: {
    validForm () {
      return Boolean(this.word.name)
    }
  },
  created () {
    this.instructionsDialog = !localStorage.get('addGesture.dontShowInstructions')
  },
  mounted () {
    this.checkWordInQuery()
  },
  methods: {
    saveSettings () {
      localStorage.set('addGesture.dontShowInstructions', this.dontShowInstructions)
      this.instructionsDialog = false
    },
    setSelectedWord (word) {
      if (word) {
        this.word = word
      } else {
        this.word = {
          name: null,
          part_of_speech: null,
          categories: null
        }
        this.$refs.videoForm.reset()
      }
    },
    getFormData () {
      let { start, finish, rangeMax, blob } = this.$refs.gestureUpload.getGestureData()
      let formData = new FormData()
      formData.append('word', this.word.name)
      formData.append('video', blob)
      if (start !== 0 || finish !== Number(rangeMax)) {
        formData.append('start', start)
        formData.append('finish', finish)
      }
      return formData
    },
    updateProgressBar (event) {
      this.progressValue = Math.round((event.loaded / event.total) * 100)
    },
    submitVideo () {
      if (this.$refs.videoForm.validate() && this.$refs.gestureUpload.videoBlob) {
        this.loading = true
        let formData = this.getFormData()
        this.$axios.post('http://localhost:5000', formData,
          {
            onUploadProgress: this.updateProgressBar
          })
          .then((response) => {
            console.log(response)
            this.$refs.gestureUpload.setParentState(this.$refs.gestureUpload.getParentState())
            this.$refs.gestureUpload.resetComponentValues()
            this.$refs.videoForm.reset()
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
            this.$store.dispatch('fetchUserAndUpdate')
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

<style>
.hidden-overflow {
  overflow: hidden;
}
.justify-center {
  justify-content: center;
}
.big-slide-enter-active,
.big-slide-leave-active {
  transform-origin: top;
  transition: max-height .7s;
}
.big-slide-enter,
.big-slide-leave-to {
  max-height: 0;
}
.big-slide-leave,
.big-slide-enter-to {
  max-height: 250px;
}
</style>
