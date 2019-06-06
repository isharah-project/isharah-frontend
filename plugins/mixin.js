import Vue from 'vue'
import { deserialize } from 'jsonapi-deserializer'

Vue.mixin({
  data () {
    return {
      API_ENDPOINT: process.env.API_ENDPOINT,
      FRONTEND_URL: process.env.FRONTEND_URL,
      deserialize,
      egyptGovernorates: [
        'الإسكندرية', 'الإسماعيلية', 'أسوان', 'أسيوط', 'الأقصر',
        'البحر الأحمر', 'البحيرة', 'بني سويف', 'بورسعيد', 'جنوب سيناء',
        'الجيزة', 'الدقهلية', 'دمياط', 'سوهاج', 'السويس', 'الشرقية',
        'شمال سيناء', 'الغربية', 'الفيوم', 'القاهرة', 'القليوبية',
        'قنا', 'كفر الشيخ', 'مطروح', 'المنوفية', 'المنيا', 'الوادي الجديد'
      ],
      arabicLetters: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س',
        'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
      partOfSpeechTypes: [
        { text: 'اسم', value: 'اسم' },
        { text: 'فعل', value: 'فعل' },
        { text: 'حرف', value: 'حرف' }
      ],
      videoTypes: [
        'video/mp4', //       .mp4
        'video/webm', //      .webm
        'video/quicktime' //  .mov,
        // 'video/x-ms-wmv', //  .wmv
        // 'video/x-msvideo', // .avi
        // 'video/x-flv', //     .flv
        // 'video/mpeg' //      .m1v
      ]
    }
  },
  computed: {
    isLoggedIn () {
      return Boolean(this.$store.state.user)
    },
    generalValidationRules () {
      return {
        required: [
          v => !!v || 'الخانة مطلوبة'
        ],
        email: [
          v => /(?!\.)[\w.-]+@[a-z0-9.-]+\.[a-z]{2,4}/.test(v) || 'يجب ان يكون البريد الالكتروني بالشكل الصحيح'
        ]
      }
    }
  },
  methods: {
    isUser (types) {
      return this.$store.state.user && types.some((type) => {
        return type === this.$store.state.user.type
      })
    },
    validateValueInList (value, list, prop) {
      if (!list || !list.length) return false
      return list.some((listValue) => {
        return prop ? listValue[prop] === value : listValue === value
      })
    },
    validateListSubsetOfList (subsetList, fullList, prop = null) {
      if (!subsetList || !subsetList.length) return false
      return subsetList.every((listItem) => {
        return this.validateValueInList(listItem, fullList, prop)
      })
    }
  }
})
