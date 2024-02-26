import { createApp } from 'vue';
// import pinia from './stores';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/css/common.scss';
import './assets/css/plus.scss';
import http from './utils/axios';
const pinia = createPinia();
const app = createApp(App);
// app.use(ElementPlus);
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
app.use(router);
app.use(ElementPlus, {
  locale: zhCn
});
import 'dayjs/locale/zh-cn';
app.config.globalProperties.$http = http;
// app.config.globalProperties.$router = router;
app.use(pinia);
// 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');