<template>
  <div>
    <div class="p10">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline search-form">
        <el-form-item label="待办类型">
          <el-select v-model="searchForm.processInstanceName" placeholder="待办类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="智慧工地-巡查整改" value="智慧工地-巡查整改" />
            <el-option label="随手拍" value="随手拍" />
            <el-option label="项目检查" value="项目检查" />
            <el-option label="移动巡更" value="移动巡更" />
            <el-option label="监督整改回复" value="监督整改回复" />
            <el-option label="设备在线预警" value="设备在线预警" />
            <el-option label="扬尘噪声数据预警" value="扬尘噪声数据预警" />
            <el-option label="混泥土数据预警" value="混泥土数据预警" />
            <el-option label="检测数据预警" value="检测数据预警" />
            <el-option label="施工升降数据预警" value="施工升降数据预警" />
            <el-option label="塔式起重数据预警" value="塔式起重数据预警" />
            <el-option label="深基坑数据预警" value="深基坑数据预警" />
            <el-option label="高支模数据预警" value="高支模数据预警" />
            <el-option label="产值上报" value="产值上报" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker v-model="searchForm.deadTime" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" @change="selectChangeTime" />
        </el-form-item>
        <el-form-item label="待办状态">
          <el-select v-model="searchForm.state">
            <el-option label="全部" value="" />
            <el-option label="待办理" value="1" />
            <el-option label="已办理" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList(1)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="zhgd-division" />
    <div class="p10">
      <div class="statistics-list flex-start">
        <div class="statistics-item">
          <span>待办理</span>
          <i style="color: #E6A23C;" class="fontbold font18 mLeft10">{{ statistics.todoNum }}</i>
        </div>
        <div class="statistics-item mLeft20">
          <span>已办理</span>
          <i class="fontbold font18 mLeft10">{{ statistics.handleNum }}</i>
        </div>
      </div>
    </div>
    <div class="p10">
      <el-table v-loading="loading" :data="tableData" style="width: 100%" height="650px" stripe>
        <el-table-column type="index" label="序号" width="80" align="center">
          <template #default="scope">
            <span>{{ (searchForm.page - 1) * searchForm.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="processInstanceName" label="待办类型" width="190" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="content" label="内容" header-align="center" />
        <el-table-column prop="startUserName" label="提交人" width="150" align="center" />
        <el-table-column prop="processStartTime" label="提交时间" width="190" align="center" />
        <el-table-column prop="deadline" label="截止日期" width="200" align="center">
          <template #default="scope">
            <span v-if="scope.row.state === '3'" style="color:rgba(217, 0, 27, 0.8);">{{ scope.row.deadline }}<el-tag class="overdue" type="danger">
              逾期</el-tag></span>
            <span v-else>{{ scope.row.deadline }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="待办状态" width="100" align="center">
          <template #default="scope">
            <span v-if="scope.row.state === '1' || scope.row.state === '3'" style="color:#E6A23C;">待办理</span>
            <span v-else>已办理</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskEndTime" label="办理时间" width="190" align="center" />
        <el-table-column label="操作" width="100" header-align="center" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.state === '1' || scope.row.state === '3'" type="text" @click="handle(scope.row)">处理</el-button>
            <el-button v-else type="text" @click="view(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex-end mTop10">
        <el-pagination
          v-model:current-page="searchForm.page" align="right" layout="total, prev, pager, next, jumper" 
          :page-size="searchForm.limit" :total="total" @current-change="getList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
const currentInstance = getCurrentInstance();
const { $http } = currentInstance.appContext.config.globalProperties;
const searchForm = reactive({
  processInstanceName: '',
  deadlineStartTime: '',
  deadlineEndTime: '',
  state: '',
  page: 1,
  limit: 10,
  deadTime: []
});
const statistics = reactive({
  todoNum: 0,
  handleNum: 0
});
const selectChangeTime = val => {
  if (val) {
    searchForm.deadlineStartTime = val[0];
    searchForm.deadlineEndTime = val[1];
  } else {
    searchForm.deadlineStartTime = '';
    searchForm.deadlineEndTime = '';
  }
};
function rederStatisticsData() {
  $http.post('/workFlowRest/statistics', searchForm).then(res => {
    if (res.data.success) {
      statistics.todoNum = res.data.data.todoNum;
      statistics.handleNum = res.data.data.handleNum;
    }
  });
}

let tableData = reactive([]);
const total = ref(0);
let loading = ref(false);
function getList(page) {
  loading.value = true;
  searchForm.page = page;
  $http.post('/workFlowRest/getList', searchForm).then(res => {
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
onMounted(() => {
  // rederStatisticsData();
  getList(1);
});
</script>
<style scoped lang='scss'>

</style>