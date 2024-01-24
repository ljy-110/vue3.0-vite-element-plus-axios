import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/css/common.scss';
import http from './utils/axios';
const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.config.globalProperties.$http = http;
app.config.globalProperties.$router = router;
// import { ref, reactive, getCurrentInstance } from 'vue'
// const currentInstance = getCurrentInstance()
// const { $http, $message, $route } = currentInstance.appContext.config.globalProperties //获取
app.mount('#app');
