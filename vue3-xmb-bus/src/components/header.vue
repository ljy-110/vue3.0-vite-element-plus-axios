<template>
  <div class="between head-contant">
    <div class="head-left-title">
      <span>{{ sessionInfo.section_name }}</span>
    </div>
    <div class="h-center">
      <div class="avatar">
        <el-avatar
          src="/images/login-logo-zhgd.png"
        />
      </div>
      <el-dropdown size="large" @command="handleCommand">
        <span class="el-dropdown-link">
          
          {{ sessionInfo.person_name }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cut">切换工程</el-dropdown-item>
            <el-dropdown-item command="display">展示系统</el-dropdown-item>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue';
const currentInstance = getCurrentInstance();
const { $http } = currentInstance.appContext.config.globalProperties;
import { useInfoStore } from '@/stores/store';
const store = useInfoStore();
const sessionInfo = ref({});
const { systemInfo } = store;
import { useRouter } from 'vue-router';
const router = useRouter();

function getSessionInfo() {
  $http.post('/loginRest/getSessionInfo', {}).then(res => {
    if (res.data.success) {
      let { data } = res.data;
      sessionInfo.value = data;
      sessionStorage.setItem('sessionInfo', JSON.stringify(data));
      store.updateSessionInfo();
      
    }
  });
}
function logout() {
  $http.post('/loginRest/logout').then(() => {
    router.push('/');
  });
}
function switch_project() {}
function switch_item() {
  $http.post('/loginRest/getToken').then(res => {
    let { data, success } = res.data;
    if (success) {
      let ssoUrl = systemInfo.xmb_display_sso_url;
      let token = '';
      if (data.type && data.type == 5) {
        ssoUrl = ssoUrl + '/jxy';
        token = data.token;
      } else {
        token = res.data.data;
      }
      window.open(ssoUrl + '?token=' + token);
    } else {
      this.$message.error(res.data.msg);
    }
  });
}
const handleCommand = command => {
  console.log(command);
  if (command == 'exit') {
    logout();
  } else if (command == 'cut') {
    switch_project();
  } else if (command == 'display') {
    switch_item();
  }
};
onMounted(() => {
  getSessionInfo();
});
</script>
<style scoped lang='scss'>
.head-contant{
  height: 60px;
  .el-dropdown-link{
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    color: #fff;
  }
}
.head-left-title{
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  font-weight: bold;
}
.avatar{
  margin-right: 10px;
}
</style>