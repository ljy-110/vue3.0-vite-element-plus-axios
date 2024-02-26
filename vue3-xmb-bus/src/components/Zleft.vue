<template>
  <div>
    <el-scrollbar style="height:100%">
      <el-menu
        :default-active="defaultActive" class="el-menu-vertical-demo" router @open="handleOpen" @select="menuSelect"
        @close="handleClose"
      >
        <div v-for="(item,index) in menuList" :key="index" :index="index">
          <el-menu-item v-if="!item.subMenu" :index="item.id" :route="'/MainContent/'+item.route">
            <i :class="item.icon + ' iconfont'" />
            <span>{{ item.name }}</span>
          </el-menu-item>
          <el-sub-menu v-else :index="item.id">
            <template #title>
              <i :class="item.icon + ' iconfont'" />
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="(subItem,ind) in item.subMenu" :key="ind" :index="subItem.id"
              :route="'/MainContent/'+subItem.route"
            >
              {{ subItem.name }}
            </el-menu-item>
          </el-sub-menu>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
// computed,onUnmounted,watch,reactive,
import { ref, onMounted, getCurrentInstance } from 'vue';
const currentInstance = getCurrentInstance();
const { $http } = currentInstance.appContext.config.globalProperties;
import { useRouter } from 'vue-router';
const router = useRouter();
const menuList = ref([]);
const defaultActive = ref();
const currentMenuId = sessionStorage.currentMenuId || '';
function getMenuList() {
  $http.get('/platformMenu/menuList').then(res => {
    if (res.data.success) {
      menuList.value = res.data.data;
      if (currentMenuId) {
        for (let level1MenIndex in menuList.value) {
          if (currentMenuId == menuList.value[level1MenIndex].id) {
            defaultActive.value = menuList.value[level1MenIndex].id;
            router.push({ path: '/MainContent/' + menuList.value[level1MenIndex].route });
          } else {
            let subMenu = menuList.value[level1MenIndex].subMenu;
            for (let level2MenuIndex in subMenu) {
              if (currentMenuId == subMenu[level2MenuIndex].id) {
                defaultActive.value = subMenu[level2MenuIndex].id;
                router.push({ path: '/MainContent/' + subMenu[level2MenuIndex].route });
              }
            }
          }
        }
      } else {
        toFirstHasRouteMenu();
      }
    }
  });
}
function toFirstHasRouteMenu() {
  for (let level1Index in menuList.value) {
    let level1Menu = menuList.value[level1Index];
    if (level1Menu.route && !level1Menu.subMenu) {
      defaultActive.value = level1Menu.id;
      router.push({ path: '/MainContent/' + level1Menu.route });
      return;
    }
    if (level1Menu.subMenu) {
      for (let level2Index in level1Menu.subMenu) {
        let level2Menu = level1Menu.subMenu[level2Index];
        if (level2Menu.route) {
          defaultActive.value = level2Menu.id;
          router.push({ path: '/MainContent/' + level2Menu.route });
          return;
        }
      }
    }
  }
}
function menuSelect(index) {
  sessionStorage.setItem('currentMenuId', index);
}
function handleOpen() {
  console.log('关闭菜单');
}
function handleClose() {
  console.log('开启菜单');
}
onMounted(() => {
  getMenuList();
});
</script>
<style scoped lang='scss'>

</style>