<template>
  <div class="search-container">
    <!-- 搜索栏》事件监听 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText" />
    <!-- 联想建议 -->
    <search-suggestion
      @search="onSearch"
      v-else-if="searchText"
      :searchText="searchText"
    />
    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :searchHistory="searchHistories"
      @clear-search-history="searchHistory = []"
    />
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { getItem, setItem } from '@/utils/storage.js'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('serach-histories') || [] // 存储历史记录
    }
  },
  computed: {},
  watch: {
    searchHistories(val) {
      // 同步到本地存储
      setItem('serach-histories', val)
    }
  },
  created() {},
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val
      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
