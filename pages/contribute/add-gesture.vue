<template>
  <v-container class="mt-3">
    <PageHeader icon="videocam" text="أضف إشارة" mb="mb-2" />
    <p class="subheading pb-3 pr-5">
      قم باختيار كلمة ثم قم برفع أو تسجيل فيديو تقوم فيه بأداء الإشارة لهذه الكلمة.
      <br>
      في كل مرة تضيف فيها فيديو، تساعد على رفع مستوى البحث العلمي وبناء التطبيقات لمجتمع الصم في مصر.
    </p>
    <GestureUpload
      submitEndPoint="gestures"
      autoCompleteEndPoint="autocomplete/words"
      autoCompleteItemText="name"
      autoCompleteLabel="اختر الكلمة"
      :autoCompleteDeserializeResults="true"
    />
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
              يفضل أن تكون الخلفية بيضاء أو فاتحة
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
import localStorage from 'local-storage'
import VideoTrimmer from '~/assets/images/video-trimmer.png'

export default {
  components: {
    PageHeader,
    GestureUpload
  },
  data () {
    return {
      VideoTrimmer,
      instructionsDialog: true,
      dontShowInstructions: false
    }
  },
  created () {
    this.instructionsDialog = !localStorage.get('addGesture.dontShowInstructions')
  },
  methods: {
    saveSettings () {
      localStorage.set('addGesture.dontShowInstructions', this.dontShowInstructions)
      this.instructionsDialog = false
    }
  }
}
</script>

<style>
.justify-center {
  justify-content: center;
}
</style>
