<template>
  <div class="p10">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="item-box box-show">
          <p class="zhgd-subTitle">待办事项</p>
          <div id="todoInfo" class="bie-echarts-box" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item-box box-show">
          <p class="zhgd-subTitle">消息通知</p>
          <div id="messageInfo" class="bie-echarts-box" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item-box box-show">
          <p class="zhgd-subTitle">项目检查</p>
          <div id="patrolInfo" class="bie-echarts-box" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item-box box-show">
          <p class="zhgd-subTitle">随手拍</p>
          <div id="photoInfo" class="bie-echarts-box" />
        </div>
      </el-col>
    </el-row>
    <div class="mTop20 p10">
      <p class="zhgd-subTitle">设备管理</p>
      <el-row :gutter="25">
        <el-col v-for="(item,index) in deviceList" :key="index" :span="4">
          <div class="device-li-item flex box-show">
            <div class="flex1 center">
              <div class="device-icon" :class="[item.icon]" />
            </div>
            
            <div class="flex2">
              <p>{{ item.title }}</p>
              <p class="fontbold font20 color0090FF">{{ item.list.length }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- <ul class="p10 flex-wrap">
        <li v-for="(item,index) in deviceList" :key="index" class="device-li-item flex p10">
          <div class="device-icon flex1" />
          <div class="flex2">
            <p>{{ item.title }}</p>
            <p>{{ item.list.length }}</p>
          </div>
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
// computed,onUnmounted,watch
import { ref, onMounted, getCurrentInstance } from 'vue';
const currentInstance = getCurrentInstance();
const { $http } = currentInstance.appContext.config.globalProperties;

// 待办
function rederStatisticsData() {
  $http.post('/workFlowRest/statistics', {}).then(res => {
    if (res.data.success) {
      let arr = [
        { value: res.data.data.handleNum, name: '已办理' },
        { value: res.data.data.todoNum, name: '待办理' }
        
      ];
      let color = ['#00BBFF', '#FFCF68'];
      applyBieEcharts('todoInfo', arr, color);
    }
  });
}
// 消息通知
function rederMessageData() {
  $http.post('/announcement/statistics', {}).then(res => {
    if (res.data.success) {
      let arr = [
        { value: res.data.data.sysNum, name: '系统消息' },
        { value: res.data.data.unitNum, name: '参建企业消息' },
        { value: res.data.data.govNum, name: '主管部门消息' }
      ];
      let color = ['#00BBFF', '#65FFD0', '#7EB3FF'];
      applyBieEcharts('messageInfo', arr, color);
    }
  });
}
// 项目检查
function rederPatrolData() {
  $http.post('/jiangsuPatrol/statistics', {}).then(res => {
    if (res.data.success) {
      let arr = [
        { value: res.data.data.patroNum, name: '检查次数' },
        { value: res.data.data.completeRectificationNum, name: '整改完成' },
        { value: res.data.data.notRectificationNum, name: '未整改' },
        { value: res.data.data.timeoutRectificationNum, name: '超时未整改' }
      ];
      let color = ['#00BBFF', '#65FFD0', '#FFCF68', '#FF797C'];
      applyBieEcharts('patrolInfo', arr, color);
    }
  });
}
// 随手拍
function rederPhotoData() {
  $http.post('/photographPatrol/statistics', {}).then(res => {
    if (res.data.success) {
      let arr = [
        { value: res.data.data.patroNum, name: '检查次数' },
        { value: res.data.data.completeRectificationNum, name: '整改完成' },
        { value: res.data.data.notRectificationNum, name: '未整改' },
        { value: res.data.data.timeoutRectificationNum, name: '超时未整改' }
      ];
      let color = ['#00BBFF', '#65FFD0', '#FFCF68', '#FF797C'];
      applyBieEcharts('photoInfo', arr, color);
    }
  });
}

const applyBieEcharts = (id, data, color) => {
  var myChart = echarts.init(document.getElementById(id));
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0'
    },
    color: color,
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: data,
        label: {
          formatter: '{b}: {x|{c}}',
          rich: {
            x: {
              fontWeight: 'bold'
            }
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  option && myChart.setOption(option);
};

function getDeviceList() {
  $http.get('/exhibition/deviceSpotMark/list', {}).then(res => {
    if (res.data.success) {
      changeStatusList(res.data.data);
    }
  });
}
let deviceList = ref([
  { title: '实名制设备', list: [], icon: 'attn' },
  { title: '视频监控', list: [], icon: 'video' },
  { title: '扬尘噪声', list: [], icon: 'dust' },
  { title: '塔式起重机监测', list: [], icon: 'tower' },
  { title: '施工升降机监测', list: [], icon: 'lift' },
  { title: '语音播报设备', list: [], icon: 'audio' },
  { title: '临边防护', list: [], icon: 'limb' },
  { title: '卸料平台', list: [], icon: 'unload' },
  { title: '智能烟感', list: [], icon: 'smoke' },
  { title: '深基坑', list: [], icon: 'pit' },
  { title: '车辆监控', list: [], icon: 'car' },
  { title: 'AI识别', list: [], icon: 'ai' },
  { title: '龙门式起重机监测', list: [], icon: 'gantry' },
  { title: '智能螺母监测', list: [], icon: 'nut' },
  { title: '钢丝绳监测', list: [], icon: 'wirerope' },
  { title: '智能水电', list: [], icon: 'plumb' },
  { title: '智能安全帽', list: [], icon: 'helmet' },
  { title: '人员定位设备', list: [], icon: 'location' },
  { title: '高支模监测', list: [], icon: 'high' },
  { title: '脚手架监测', list: [], icon: 'scaffold' },
  { title: '养护室监测', list: [], icon: 'curing' },
  { title: '大体积混凝土', list: [], icon: 'concrete' },
  { title: '结构实体回弹仪', list: [], icon: 'resiliometer' }
]);
function changeStatusList(data) {
  for (var i = 0; i < data.length; i++) {
    let deviceType = data[i].spotType;
    switch (deviceType) {
      case 1:
        deviceList.value[0].list.push(data[i]);
        break;
      case 2:
        deviceList.value[1].list.push(data[i]);
        break;
      case 3:
        deviceList.value[2].list.push(data[i]);
        break;
      case 4:
        deviceList.value[3].list.push(data[i]);
        break;
      case 5:
        deviceList.value[5].list.push(data[i]);
        break;
      case 6:
        deviceList.value[6].list.push(data[i]);
        break;
      case 7:
        deviceList.value[4].list.push(data[i]);
        break;
      case 8:
        deviceList.value[7].list.push(data[i]);
        break;
      case 9:
        deviceList.value[7].list.push(data[i]);
        break;
      case 10:
        
        break;
      case 11:
        deviceList.value[8].list.push(data[i]);
        break;
      default:
    }
  }
}
onMounted(() => {
  // applyBieEcharts();
  rederMessageData();
  rederStatisticsData();
  rederPatrolData();
  rederPhotoData();
  getDeviceList();
});
</script>
<style scoped lang='scss'>
.item-box{
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 8px;
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .bie-echarts-box{
    width: 100%;
    height: 300px;
  }
}
.device-li-item{
  border: 1px solid #f8f8f8;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  border-radius: 8px;
  .device-icon{
    width: 50px;
    height: 50px;
    background: url('/src/assets/image/icon/u597.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.attn{
    background: url('/src/assets/image/icon/u680.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.dust{
    background: url('/src/assets/image/icon/u597.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.video{
    background: url('/src/assets/image/icon/u602.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.audio{
    background: url('/src/assets/image/icon/u681.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.car{
    background: url('/src/assets/image/icon/u683.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.tower{
    background: url('/src/assets/image/icon/u678.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.lift{
    background: url('/src/assets/image/icon/u677.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.unload{
    background: url('/src/assets/image/icon/u679.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.limb{
    background: url('/src/assets/image/icon/u689.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.smoke{
    background: url('/src/assets/image/icon/u693.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.pit{
    background: url('/src/assets/image/icon/u691.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.gantry{
    background: url('/src/assets/image/icon/u675.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.ai{
    background: url('/src/assets/image/icon/u682.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.nut{
    background: url('/src/assets/image/icon/u676.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.wirerope{
    background: url('/src/assets/image/icon/u674.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.plumb{
    background: url('/src/assets/image/icon/u692.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.helmet{
    background: url('/src/assets/image/icon/u684.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.location{
    background: url('/src/assets/image/icon/u690.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.high{
    background: url('/src/assets/image/icon/u685.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.scaffold{
    background: url('/src/assets/image/icon/u688.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.curing{
    background: url('/src/assets/image/icon/u694.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.concrete{
    background: url('/src/assets/image/icon/u687.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .device-icon.resiliometer{
    background: url('/src/assets/image/icon/u686.png') no-repeat center center;
    background-size: 100% 100%;
  }
}
.box-show:hover{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>