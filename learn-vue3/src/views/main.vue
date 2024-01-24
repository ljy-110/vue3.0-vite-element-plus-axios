<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">Aside</el-aside>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Header from '@/components/header.vue';
</script>
<style scoped lang='scss'>
.header{
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1)
}
.aside{
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;
  color: #000;
  box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.1)
}
.main{
  background-color: rgba(144, 147, 153,.2);
}
</style>