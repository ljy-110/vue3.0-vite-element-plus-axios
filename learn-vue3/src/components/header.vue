<template>
  <div class="between head-contant">
    <div class="head-left-title">
      <i>vue3 + vite 管理系统</i>
    </div>
    <div>
      <el-dropdown size="large">
        <span class="el-dropdown-link">
          管理员
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
// import { ref, reactive } from 'vue';

</script>
<style scoped lang='scss'>
.head-contant{
  height: 60px;
  .el-dropdown-link{
    height: 60px;
    line-height: 60px;
  }
}
.head-left-title{
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  font-weight: bold;
}
</style>