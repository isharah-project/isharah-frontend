<template>
  <v-autocomplete
    ref="autocomplete"
    v-model="selectedItem"
    :items="items"
    :label="label"
    :loading="loading"
    :item-text="itemText"
    :hide-no-data="getHideNoData"
    :search-input.sync="query"
    :prepend-icon="prependIcon"
    class="auto-complete"
    append-icon=""
    hide-selected
    return-object
    hide-details
    clearable
    chips
    solo
    flat
  >
    <template v-slot:no-data>
      <v-list-tile>
        <v-list-tile-title>
          لا توجد نتائج
        </v-list-tile-title>
      </v-list-tile>
    </template>
    <template v-slot:selection="{ item, selected }">
      <v-chip
        :selected="selected"
      >
        <v-avatar class="white--text">
          {{ item[itemText].slice(0, 1).toUpperCase() }}
        </v-avatar>
        <span>{{ item[itemText] }}</span>
      </v-chip>
    </template>
    <template v-slot:item="{ item }">
      <v-list-tile-avatar
        class="title font-weight-light white--text search-list-avatar"
      >
        {{ item ? item[itemText].charAt(0) : '' }}
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ item[itemText] }}</v-list-tile-title>
        <!--<v-list-tile-sub-title v-text="item.symbol"></v-list-tile-sub-title>-->
      </v-list-tile-content>
      <v-list-tile-action>
        <v-icon>mdi-coin</v-icon>
      </v-list-tile-action>
    </template>
  </v-autocomplete>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    apiEndPoint: {
      type: String,
      required: true
    },
    itemText: {
      type: String,
      required: true
    },
    selectable: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    hideNoData: {
      type: Boolean,
      required: false,
      default: false
    },
    queryMinCharsCount: {
      type: Number,
      required: false,
      default: 2
    },
    prependIcon: {
      type: String,
      required: false,
      default: 'search'
    }
  },
  data () {
    return {
      query: '',
      items: [],
      selectedItem: null,
      loading: false
    }
  },
  computed: {
    getHideNoData () {
      if (this.hideNoData) return true
      return !this.query || this.query.length < this.queryMinCharsCount
    }
  },
  watch: {
    query: {
      handler: function (value) {
        if (value && value.length >= this.queryMinCharsCount) {
          _.debounce(this.fetchItems, 400)(value)
        }
      }
    },
    selectedItem: {
      handler: function (value) {
        if (value && !this.selectable) {
          this.$nextTick(() => {
            this.$refs.autocomplete.reset()
          })
        } else if (value) {
          this.$nextTick(() => {
            this.$refs.autocomplete.blur()
          })
        }
        this.$emit('itemChanged', value)
      }
    }
  },
  methods: {
    fetchItems (query) {
      this.loading = true
      this.$axios.get(`${this.apiEndPoint}?q=${query}`,
        { progress: false }).then((response) => {
        this.loading = false
        this.items = this.deserialize(response.data)
      }).catch((e) => {
        console.log(e)
        // TODO: show error msg
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "~/assets/styles/helpers/colors.scss";

.auto-complete .v-avatar {
  background: $blue-cyan-gradient;
}
.search-list-avatar > .v-avatar {
  background: $blue-cyan-gradient;
}
</style>
