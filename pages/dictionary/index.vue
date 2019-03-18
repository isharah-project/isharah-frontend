<template>
  <v-container>
    <v-layout class="mb-4">
      <v-flex>
        <h1 class="display-1 font-weight-medium">
          <v-icon class="heading-icon">
            library_books
          </v-icon>
          القاموس
        </h1>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-space-between>
      <v-flex xs12 sm5 md5 lg2>
        <v-select
          v-model="query.part_of_speech"
          :items="partOfSpeechTypes"
          class="round-input light-shadow-input"
          menu-props="auto"
          label="إختر نوع الكلمة"
          hide-details
          single-line
          solo
        ></v-select>
      </v-flex>
      <v-flex xs12 sm5 md5 lg2 :class="{ 'mt-2': $vuetify.breakpoint.xsOnly }">
        <v-select
          v-model="query.category"
          :items="categories"
          :multiple="true"
          item-text="name"
          item-value="name"
          class="round-input light-shadow-input"
          menu-props="auto"
          label="إختر فئة الكلمة"
          hide-details
          single-line
          chips
          solo
        >
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item.name }}</span>
            </v-chip>
            <span
              v-if="index === 1"
              class="grey--text caption"
            >(+{{ query.category.length - 1 }} أخرى)</span>
          </template>
        </v-select>
      </v-flex>
      <v-flex
        xs12
        sm12
        md12
        lg7
        class="d-flex align-center white light-box-shadow round-corners"
        :class="{ 'flex-wrap': $vuetify.breakpoint.xsOnly,
                  'my-2 pa-1': $vuetify.breakpoint.mdAndDown }"
      >
        <v-flex xs12>
          <v-menu
            v-model="menu"
            offset-y
            :nudge-left="105"
            :nudge-bottom="10"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :class="{ 'full-width': $vuetify.breakpoint.xsOnly }"
                class="ma-0 round-corners"
                flat
                v-on="on"
              >
                الأبجدية
                <span v-if="arabicLetters.includes(query.q)" class="font-weight-bold">
                  {{ `(${query.q})` }}
                </span>
                <v-icon>filter_list</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-layout row wrap class="pa-1 arabic-letters-container">
                <v-flex v-for="letter in arabicLetters" :key="letter" class="text-xs-center" xs2>
                  <v-btn
                    :color="letter === query.q ? 'primary' : ''"
                    icon
                    class="title pa-0 ma-0"
                    @click="setFirstLetter(letter)"
                  >
                    {{ letter }}
                  </v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-btn class="red-gradient" dark round block @click="removeFirstLetterFilter()">
                    إلغاء
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card>
          </v-menu>
        </v-flex>
        <v-flex xs12>
          <v-autocomplete
            :loading="false"
            :items="[]"
            :search-input.sync="searchText"
            cache-items
            class="mx-3 pt-0 input-hidden-underline"
            flat
            hide-no-data
            hide-details
            label="بحث"
            prepend-icon="search"
          ></v-autocomplete>
        </v-flex>
        <v-flex xs12 class="text-xs-center" :class="{ 'mt-3': $vuetify.breakpoint.xsOnly }">
          <v-pagination
            v-model="pageNumber"
            class="flat-pagination round-pagination"
            :length="6"
            :total-visible="paginationVisibleCount"
          ></v-pagination>
        </v-flex>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="white light-box-shadow round-corners pa-2 mt-4">
      <v-flex
        v-for="word in words"
        :key="word.name"
        class="headline pa-1"
        xs6
        sm4
        md3
      >
        {{ word.attributes.name }}
      </v-flex>
      <v-flex v-if="words.length === 0" class="text-xs-center">
        <div class="pa-2 headline">
          لا يوجد كلمات
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      arabicLetters: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س',
        'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'],
      partOfSpeechTypes: [
        { text: 'اسم', value: 'اسم' },
        { text: 'فعل', value: 'فعل' },
        { text: 'حرف', value: 'حرف' }
      ],
      categories: [],
      query: {
        part_of_speech: null,
        category: null,
        q: null
      },
      lastQuery: null,
      pageNumber: 1,
      loading: true,
      words: [],
      searchText: null,
      menu: null
    }
  },
  computed: {
    paginationVisibleCount () {
      if (this.$vuetify.breakpoint.xsOnly) return 4
      else if (this.$vuetify.breakpoint.smAndDown) return 5
      else return 6
    }
  },
  watch: {
    query: {
      handler: function () {
        this.loading = true
        this.setUrlQuery()
        this.fetchData(this.buildApiQuery())
      },
      deep: true
    },
    '$route.query': {
      handler: function () {
        this.cloneRouteQuery()
        this.validateQueryKeys()
        this.setUrlQuery()
        this.fetchData(this.buildApiQuery())
      },
      deep: true
    }
  },
  async asyncData ({ $axios }) {
    try {
      let categories = (await $axios.get('/categories')).data
      return { categories }
    } catch (e) {
      // TODO
      console.log(e)
    }
  },
  created () {
    this.cloneRouteQuery()
    this.validateQueryKeys()
    if (!Object.keys(this.$route.query).length) {
      // No query so query watcher will not get triggered
      this.fetchData()
    }
  },
  methods: {
    fetchData (query = '') {
      // prevent multiple requests to the same query due to watcher
      if (this.lastQuery === query) return
      this.lastQuery = query
      this.$axios.$get(`/words${query}`).then((response) => {
        this.words = response.data
        this.loading = false
      }).catch((error) => {
        // TODO
        console.log(error)
      })
    },
    buildApiQuery () {
      let result = '?'
      Object.keys(this.query).forEach((key) => {
        if (key === 'category' && this.query[key] && this.query[key].length) {
          result += `${key}=${this.query[key].join(',')}&`
        } else if (this.query[key]) {
          result += `${key}=${this.query[key]}&`
        }
      })
      return result.slice(0, -1)
    },
    setUrlQuery () {
      let query = {}
      if (this.query.part_of_speech) {
        query.part_of_speech = this.query.part_of_speech
      }
      if (this.query.category && this.query.category.length) {
        query.category = this.query.category.join(',')
      }
      if (this.query.q) {
        query.q = this.query.q
      }
      this.$router.push({ query })
    },
    cloneRouteQuery () {
      if (this.$route.query.part_of_speech) {
        this.query.part_of_speech = this.$route.query.part_of_speech
      }
      if (this.$route.query.category) {
        this.query.category = this.$route.query.category.split(',')
      }
      if (this.$route.query.q) {
        this.query.q = this.$route.query.q
      }
    },
    validateQueryKeys () {
      return Object.keys(this.query).forEach((key) => {
        if (key === 'part_of_speech' &&
          !this.validateValueInList(this.query[key], this.partOfSpeechTypes, 'value')) {
          this.query[key] = null
        } else if (key === 'category' &&
          !this.validateListSubsetOfList(this.query[key], this.categories, 'name')) {
          this.query[key] = null
        } else if (key === 'q' &&
          !this.validateValueInList(this.query[key], this.arabicLetters)) {
          this.query[key] = null
        }
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
    },
    setFirstLetter (letter) {
      this.query.q = letter
    },
    removeFirstLetterFilter () {
      this.query.q = null
    }
  }
}
</script>

<style scoped>
.heading-icon {
  font-size: inherit;
}

@media all and (min-width: 400px) {
  .arabic-letters-container {
    width: 300px;
  }
}

.flex-wrap {
  flex-wrap: wrap;
}
</style>
