<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'

import { onMounted, getCurrentInstance } from 'vue';
import { useInfoStore } from '@/stores/store';
const store = useInfoStore();
const currentInstance = getCurrentInstance();
const { $http } = currentInstance.appContext.config.globalProperties;
function systemConfig() {
  $http.get('/loginRest/systemConfig/1', {}).then(res => {
    let { data } = res.data;
    sessionStorage.setItem('systemInfo', JSON.stringify(data));
    store.updateSystemInfo();
    
  });
}
onMounted(() => {
  systemConfig();
});
</script>

<template>
  <div>
    <router-view />
  </div>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
</template>

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // margin-top: 60px;
}
</style>