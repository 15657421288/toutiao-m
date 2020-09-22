<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <input type="file" hidden ref="file" @change="onFileChange" />

    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdatebirthdyShow = true"
    />
    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- 编辑性别弹层 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- 编辑生日弹出层 -->
    <van-popup v-model="isUpdatebirthdyShow" position="bottom">
      <update-birthdy
        v-if="isUpdatebirthdyShow"
        @close="isUpdatebirthdyShow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- 编辑头像弹层 -->
    <van-popup
      v-model="isShowUpdateShow"
      style="height: 100%"
      position="bottom"
    >
      <updata-photo
        v-if="isShowUpdateShow"
        @update-photo="user.photo = $event"
        @close="isShowUpdateShow = false"
        :img="img"
      />
    </van-popup>
    <!-- 编辑头像弹层 -->
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user.js'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthdy from './components/update-birthdy'
import UpdataPhoto from './components/updata-photo'
export default {
  name: 'userProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthdy,
    UpdataPhoto
  },
  props: {},
  data() {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdatebirthdyShow: false,
      isShowUpdateShow: false,
      img: null
    }
  },
  computend: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
        // console.log(data)
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange() {
      const file = this.$refs.file.files[0]

      this.img = window.URL.createObjectURL(file)

      this.isShowUpdateShow = true
      this.$refs.file.value = ''
    }
  }
}
</script>
<style lang="less" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
}
/deep/.van-icon-arrow-left {
  color: #ccc;
}
</style>
