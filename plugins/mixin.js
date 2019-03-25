import Vue from 'vue'
import { deserialize } from 'jsonapi-deserializer'

Vue.mixin({
  data () {
    return {
      deserialize,
      arabicLetters: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س',
        'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'],
      partOfSpeechTypes: [
        { text: 'اسم', value: 'اسم' },
        { text: 'فعل', value: 'فعل' },
        { text: 'حرف', value: 'حرف' }
      ],
      videoTypes: [
        'video/webm', //      .webm
        'video/x-flv', //     .flv
        'video/mp4', //       .mp4
        'video/x-msvideo', // .avi
        'video/mpeg', //      .m1v
        'video/x-ms-wmv', //  .wmv
        'video/quicktime' //  .mov
      ]
    }
  },
  methods: {
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
