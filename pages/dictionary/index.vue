<template>
  <v-container>
    <PageHeader icon="library_books" text="القاموس" />
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
                    @click="setFirstLetterFilter(letter)"
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
            v-model="page.current"
            class="flat-pagination round-pagination"
            :length="page.total"
            :total-visible="paginationVisibleCount"
            @input="changeCurrentPage($event)"
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
import _ from 'lodash'
import PageHeader from '~/components/generic/PageHeader'

export default {
  components: { PageHeader },
  data () {
    return {
      arabicLetters: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س',
        'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
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
      page: {
        perPage: 5,
        current: 1,
        total: null
      },
      lastQuery: null,
      queryChangedHere: false,
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
        // TODO: reset pagination
        // this.resetPagination()
        this.setUrlQuery()
        this.fetchData(this.buildApiQuery())
      },
      deep: true
    },
    '$route.query': {
      // For browser navigation
      handler: function () {
        this.cloneRouteQuery()
        this.validateQueryParams()
        this.fetchData(this.buildApiQuery())
      },
      deep: true
    }
  },
  async asyncData ({ app, $axios }) {
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
    this.validateQueryParams()
    if (!this.$route.query.page) {
      this.replaceRouterPage(1)
    }
    if (!Object.keys(this.$route.query).length) {
      // No query so query watcher will not get triggered
      this.fetchData(this.buildApiQuery())
    }
  },
  methods: {
    fetchData (query = '') {
      if (query === this.lastQuery) return
      this.lastQuery = query
      this.$axios.$get(`/words${query}`).then((response) => {
        if (this.page.current > response.page_meta.total_pages) {
          this.replaceRouterPage(1)
        }
        this.words = response.data
        this.page.total = response.page_meta.total_pages || 1
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
      result += `page=${this.page.current}`
      result += `&per_page=${this.page.perPage}`
      return result
    },
    setUrlQuery () {
      let query = {}
      query.page = this.page.current
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
      this.query = {
        part_of_speech: null,
        category: null,
        q: null
      }
      if (this.$route.query.part_of_speech) {
        this.query.part_of_speech = this.$route.query.part_of_speech
      }
      if (this.$route.query.category) {
        this.query.category = this.$route.query.category.split(',')
      }
      if (this.$route.query.q) {
        this.query.q = this.$route.query.q
      }
      if (this.$route.query.page) {
        this.page.current = Number(this.$route.query.page)
      }
    },
    validateQueryParams () {
      if (this.query.part_of_speech &&
        !this.assertValueInList(this.query.part_of_speech, this.partOfSpeechTypes, 'value')) {
        this.query.part_of_speech = null
      }
      if (this.query.category &&
        !this.assertSubsetOfList(this.query.category, this.categories, 'name')) {
        this.query.category = null
      }
      if (this.query.q &&
        !this.assertValueInList(this.query.q, this.arabicLetters)) {
        this.query.q = null
      }
    },
    assertValueInList (value, list, prop) {
      if (!list || !list.length) return false
      return list.some((listValue) => {
        return prop ? listValue[prop] === value : listValue === value
      })
    },
    assertSubsetOfList (subsetList, fullList, prop = null) {
      if (!subsetList || !subsetList.length) return false
      return subsetList.every((listItem) => {
        return this.assertValueInList(listItem, fullList, prop)
      })
    },
    changeCurrentPage (pageNumber) {
      this.page.current = pageNumber
      this.setUrlQuery()
    },
    replaceRouterPage (pageNumber) {
      let query = _.cloneDeep(this.$route.query)
      query.page = pageNumber
      this.$router.replace({ query })
    },
    resetPagination () {
      this.page.current = 1
    },
    setFirstLetterFilter (letter) {
      this.query.q = letter
    },
    removeFirstLetterFilter () {
      this.query.q = null
    }
  }
}
</script>

<style scoped>

@media all and (min-width: 400px) {
  .arabic-letters-container {
    width: 300px;
  }
}

.flex-wrap {
  flex-wrap: wrap;
}
</style>
