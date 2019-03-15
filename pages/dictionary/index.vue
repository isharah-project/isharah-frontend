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
          v-model="query.type"
          :items="wordTypes"
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
          v-model="query.categories"
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
        ></v-select>
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
                <span v-if="arabicLetters.includes(query.first_letter)" class="font-weight-bold">
                  {{ `(${query.first_letter})` }}
                </span>
                <v-icon>filter_list</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-layout row wrap class="pa-1 arabic-letters-container">
                <v-flex v-for="letter in arabicLetters" :key="letter" class="text-xs-center" xs2>
                  <v-btn
                    :color="letter === query.first_letter ? 'primary' : ''"
                    icon
                    class="title pa-0 ma-0"
                    @click="setFirstLetter(letter)"
                  >
                    {{ letter }}
                  </v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-btn class="red-gradient" dark round block>
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
            :total-visible="5"
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
        {{ word.name }}
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
      wordTypes: [
        { text: 'إسم', value: 'إسم' },
        { text: 'فعل', value: 'فعل' },
        { text: 'حرف', value: 'حرف' },
        { text: 'جملة', value: 'جملة' }
      ],
      categories: [],
      query: {
        type: null,
        categories: null,
        first_letter: null
      },
      pageNumber: 1,
      loading: true,
      words: [],
      searchText: null,
      menu: null
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
    this.query.type = this.$route.query.type
    this.query.categories = this.$route.query.categories ? this.$route.query.categories.split(',') : null
    this.query.first_letter = this.$route.query.first_letter
    this.validateQueryKeys()
  },
  methods: {
    fetchData (query) {
      this.$axios.$get(`/words/${query}`).then((response) => {
        this.words = response
        this.loading = false
      }).catch((error) => {
        // TODO
        console.log(error)
      })
    },
    buildApiQuery () {
      let result = '?'
      Object.keys(this.query).forEach((key) => {
        if (key === 'categories' && this.query[key] && this.query[key].length) {
          result += `${key}=${this.query[key].join(',')}&`
        } else if (this.query[key]) {
          result += `${key}=${this.query[key]}&`
        }
      })
      return result.slice(0, -1)
    },
    setUrlQuery () {
      let query = {}
      if (this.query.type) {
        query.type = this.query.type
      }
      if (this.query.categories && this.query.categories.length) {
        query.categories = this.query.categories.join(',')
      }
      if (this.query.first_letter) {
        query.first_letter = this.query.first_letter
      }
      this.$router.push({ query })
    },
    validateQueryKeys () {
      return Object.keys(this.query).forEach((key) => {
        if (key === 'type' &&
          !this.validateValueInList(this.query[key], this.wordTypes, 'value')) {
          this.query[key] = null
        } else if (key === 'categories' &&
          !this.validateRequestedCategories(this.query[key])) {
          this.query[key] = null
        } else if (key === 'first_letter' &&
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
    validateRequestedCategories (requested) {
      if (!requested || !requested.length) return false
      return requested.every((category) => {
        return this.validateValueInList(category, this.categories, 'name')
      })
    },
    setFirstLetter (letter) {
      this.query.first_letter = letter
    }
  }
}
</script>

<style scoped>
.heading-icon {
  font-size: inherit;
}

.arabic-letters-container {
  width: 300px;
}

.flex-wrap {
  flex-wrap: wrap;
}
</style>
