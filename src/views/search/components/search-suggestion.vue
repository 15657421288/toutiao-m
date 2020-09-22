<template>
  <div class="search-suggestion">
    <van-cell
      :title="item"
      icon="search"
      v-for="(item, index) in suggestions"
      :key="index"
      @click="$emit('search', item)"
    >
      <span slot="title" v-html="highlight(item)"></span>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search.js'

// 按需加载有好处：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 监视的处理函数
      // handler(value) {
      //   this.loadSearchSuggestion(value)
      // },
      handler: debounce(function(value) {
        this.loadSearchSuggestion(value)
      }, 200),
      // 首次监视触发
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取失败')
      }
    },
    highlight(text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // RegExp 构造函数创建了一个正则表达式对象，用于将文本与一个模式匹配。
      const req = new RegExp(this.searchText, 'gi')
      return text.replace(req, highlightStr)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/.active {
    color: blue;
  }
}
</style>
