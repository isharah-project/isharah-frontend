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
          clearable
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
        class="d-flex align-center white light-box-shadow small-round-corners"
        :class="{ 'flex-wrap': $vuetify.breakpoint.xsOnly,
                  'my-2 pa-1': $vuetify.breakpoint.mdAndDown }"
      >
        <!-- FIRST LETTER SEARCH -->
        <!-- <v-flex xs12>
          <v-menu
            v-model="menu"
            offset-y
            :nudge-left="105"
            :nudge-bottom="10"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :class="{ 'full-width': $vuetify.breakpoint.xsOnly }"
                class="ma-0 small-round-corners"
                flat
                v-on="on"
              >
                الأبجدية
                <span v-if="arabicLetters.includes(query.q)" class="font-weight-bold">
                  &nbsp; {{ `(${query.q})` }}
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
        </v-flex> -->
        <v-flex xs12>
          <v-text-field
            v-model="query.q"
            class="search-input input-hidden-underline ma-0 pt-0 pr-2"
            placeholder="البحث عن الكلمة.."
            prepend-icon="search"
            hide-details
          />
        </v-flex>
        <v-flex xs12 class="text-xs-center">
          <v-pagination
            v-model="page.current"
            class="flat-pagination round-pagination"
            :length="page.total"
            :total-visible="paginationVisibleCount"
            @input="changeCurrentPage($event)"
          />
        </v-flex>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="white light-box-shadow small-round-corners pa-2 mt-4">
      <v-flex
        v-for="word in words"
        :key="word.name"
        class="headline pa-1"
        xs6
        sm3
        md2
      >
        <v-btn
          flat
          class="headline"
          @click="goToWord(word)"
        >
          {{ word.name }}
        </v-btn>
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
  components: {
    PageHeader
  },
  data () {
    return {
      categories: [],
      query: {
        part_of_speech: null,
        category: null,
        q: null
      },
      page: {
        perPage: 30,
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
      else if (this.$vuetify.breakpoint.smAndDown) return 6
      else return 7
    }
  },
  watch: {
    'query.part_of_speech': {
      handler: function () { this.setQueryAndFetchData() },
      deep: true
    },
    'query.category': {
      handler: function () { this.setQueryAndFetchData() },
      deep: true
    },
    'query.q': {
      handler: function () { _.debounce(this.setQueryAndFetchData, 500)() }
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
  async asyncData ({ app, $axios, store }) {
    try {
      let response = await $axios.get('/categories')
      let categories = store.state.deserialize(response.data)
      return { categories }
    } catch (e) {
      store.commit('showErrorMsg', {
        message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
      })
    }
  },
  created () {
    if (!this.$route.query.page) {
      this.replaceRouterPage(1)
    }
    this.cloneRouteQuery()
    this.validateQueryParams()
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
        this.words = this.deserialize(response)
        this.page.total = response.page_meta.total_pages || 1
        this.loading = false
      }).catch(() => {
        this.$store.commit('showErrorMsg', {
          message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
        })
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
      // if (this.query.q &&
      //   !this.assertValueInList(this.query.q, this.arabicLetters)) {
      //   this.query.q = null
      // }
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
    setQueryAndFetchData () {
      this.loading = true
      // TODO: reset pagination
      // this.resetPagination()
      this.setUrlQuery()
      this.fetchData(this.buildApiQuery())
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
    goToWord (word) {
      if (word) {
        this.$router.push({ path: `dictionary/${word.name}` })
      }
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

/*@media all and (min-width: 400px) {*/
  /*.arabic-letters-container {*/
    /*width: 300px;*/
  /*}*/
/*}*/

.flex-wrap {
  flex-wrap: wrap;
}
.search-input >>> .v-input__control {
  padding-right: 4px;
}
</style>
