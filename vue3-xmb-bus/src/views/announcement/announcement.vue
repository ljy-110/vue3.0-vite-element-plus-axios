<template>
  <div>
    <div class="p10">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline search-form">
        <el-form-item label="通知类型">
          <el-select v-model="searchForm.source">
            <el-option label="全部" value="" />
            <el-option label="系统消息通知" :value="0" />
            <el-option label="参建企业消息通知" :value="1" />
            <el-option label="主管部门消息通知" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知时间">
          <el-date-picker v-model="searchForm.deadTime" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" @change="selectChangeTime" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.read">
            <el-option label="全部" value="" />
            <el-option label="未读" :value="0" />
            <el-option label="已读" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList(1)">搜索</el-button>
          <el-button type="primary" class="add-btn" @click="readAll()">全部已读</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="zhgd-division" />
    <div class="p10">
      <div class="statistics-list flex-start">
        <div class="statistics-item">
          <span>系统消息通知</span>
          <i class="fontbold font18 mLeft10">{{ statistics.sysNum }}</i>
        </div>
        <div class="statistics-item mLeft20">
          <span>参建企业消息通知</span>
          <i class="fontbold font18 mLeft10">{{ statistics.unitNum }}</i>
        </div>
        <div class="statistics-item mLeft20">
          <span>主管部门消息通知</span>
          <i class="fontbold font18 mLeft10">{{ statistics.govNum }}</i>
        </div>
      </div>
    </div>

    <div class="p10">
      <el-table v-loading="loading" :data="tableData" size="large" style="width: 100%" height="650px" stripe>
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="typeName" label="通知类型" width="200" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="scope.row.read == 1">{{ formatSource(scope.row.source) }}</span>
            <div v-else class="h-center">
              <div class="badge" />{{ formatSource(scope.row.source) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="主题" :show-overflow-tooltip="true" />
        <el-table-column prop="createUserName" label="发布来源" width="200" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="scope.row.createUserName == '0000000'">智慧工地系统</div>
            <div v-else>{{ scope.row.createUserName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="depolyTime" label="通知时间" width="200" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button type="text" @click="view(scope.$index, scope.row)">详情</el-button>
            <el-button type="text" style="color:#F56C6C" @click="deleteInfo(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex-end mTop10">
        <el-pagination
          v-model:current-page="searchForm.page" align="right" layout="total, prev, pager, next, jumper" 
          :page-size="searchForm.limit" :total="total" @current-change="getList"
        />
      </div>

      <el-dialog v-model="dialogVisible" title="Tips" width="500" top="3%" :before-close="handleClose">
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              Confirm
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
const currentInstance = getCurrentInstance();
const { $http } = currentInstance.appContext.config.globalProperties;
const searchForm = reactive({
  depolyStartTime: '',
  depolyEndTime: '',
  type: '',
  source: null,
  read: null,
  page: 1,
  limit: 10,
  deadTime: []
});
const statistics = reactive({
  sysNum: 0,
  unitNum: 0,
  govNum: 0
});
const selectChangeTime = val => {
  if (val.length > 0) {
    searchForm.depolyStartTime = val[0];
    searchForm.depolyEndTime = val[1];
  } else {
    searchForm.depolyStartTime = '';
    searchForm.depolyEndTime = '';
  }
};
function rederStatisticsData() {
  $http.post('/announcement/statistics', searchForm).then(res => {
    if (res.data.success) {
      statistics.sysNum = res.data.data.sysNum;
      statistics.unitNum = res.data.data.unitNum;
      statistics.govNum = res.data.data.govNum;
    }
  });
}
let tableData = reactive([]);
const total = ref(0);
let loading = ref(false);
function getList(page) {
  loading.value = true;
  searchForm.page = page;
  $http.post('/announcement/list', searchForm).then(res => {
    if (res.data.success) {
      total.value = res.data.count;
      tableData = res.data.data;
      rederStatisticsData();
      loading.value = false;
    } else {
      total.value = 0;
      tableData = [];
      loading.value = false;
    }
    
  });
}
const formatSource = source => {
  if (source === 0) {
    return '系统消息通知';
  }
  if (source === 1) {
    return '参建企业消息通知';
  }
  if (source === 2) {
    return '主管部门消息通知';
  }
  return '';
};
const readAll = () => {
  loading.value = true;
  $http.get('/announcement/readAll').then(res => {
    loading.value = false;
    if (res.data.success) {
      tableData.forEach(item => {
        item.read = 1;
      });
    }
  });
};

const view = (index, row) => {
  dialogVisible.value = true;
};

const dialogVisible = ref(false);

onMounted(() => {
  getList(1);
});
</script>
<style scoped lang='scss'>

</style>