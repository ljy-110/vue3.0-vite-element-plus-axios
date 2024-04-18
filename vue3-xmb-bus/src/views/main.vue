<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <Zleft />
        </el-aside>
        <el-main class="main">
          <router-view class="bg-white" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
// import { ref, reactive } from 'vue';
import Header from '@/components/header.vue';
import Zleft from '@/components/Zleft.vue';
</script>
<style scoped lang='scss'>
.header{
  background-color: #337ecc;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
  color:#fff;
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
  --el-main-padding:10px;
  height: calc(100vh - 60px);
}
.bg-white{
  background-color: #fff;
}
</style>