<template>
  <div class="login-container">
    <div class="login-title">
      <div class="login-login" />
      <div class="login-name">{{ systemInfo.system_name }}</div>
    </div>
    <div class="login-content">
      <div class="login-title">用户登录</div>
      <div class="logo-box ">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" hide-required-asterisk class="demo-ruleForm" status-icon>
          <el-form-item prop="name">
            <el-input v-model="ruleForm.name" size="large" prefix-icon="User" clearable />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" size="large" prefix-icon="Lock" type="password" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" style="width:100%;" @click="submitForm('ruleFormRef')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <span class="footer-company">{{ systemInfo.login_bottom_info }}</span>
    </div>
  </div>
</template>

<script setup>
// reactive, 
import { ref, getCurrentInstance } from 'vue';
import { useInfoStore } from '../../stores/store';
const store = useInfoStore();
const { systemInfo } = store;
// onMounted(() => {
//   systemInfo.value = JSON.parse(sessionStorage.systemInfo);
// });
sessionStorage.removeItem('currentMenuId');
import CryptoJS from 'crypto-js';
const currentInstance = getCurrentInstance();
const { $http } = currentInstance.appContext.config.globalProperties;
import { useRouter } from 'vue-router';
const router = useRouter();
const ruleForm = ref({
  name: '', password: ''
});
const rules = ref({
  name: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
});
// 加密
function encrypt(word) {
  let keyStr = 'Vn74ag9kBuW3lYv2'; // 密钥
  let ivStr = keyStr.substring(0, 16); // 偏移量
  let key = CryptoJS.enc.Utf8.parse(keyStr);
  let iv = CryptoJS.enc.Utf8.parse(ivStr);
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
const ruleFormRef = ref(null);
const submitForm = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {
      $http.post('/login/common', {
        username: ruleForm.value.name,
        loginKey: encrypt(ruleForm.value.password)
      }).then(res => {
        sessionStorage.setItem('isMatch', res.data.data.isMatch);
        sessionStorage.setItem('isFirst', 'true');
        router.push('/MainContent/');
        // sessionStorage.setItem('systemInfo',JSON.stringify(data))
      });
      // $http({
      //   url: '/login/common',
      //   data: {
      //     username: ruleForm.name,
      //     loginKey: this.encrypt(ruleForm.password)
      //   }
      // }).then(res=>{
      //   let { data } = res.data
      //   sessionStorage.setItem('systemInfo',JSON.stringify(data))
      // })
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>
<style scoped lang='scss'>
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url("/images/login-bg.jpg");
  background-position: center center;
  background-size: 100%;
  background-repeat: no-repeat;
}
.login-name {
  font-size: 52px;
  color: #083167;
  text-align: center;
  font-weight: bold;
  padding-top: 80px;
}
.login-content {
  width: 440px;
  background-color: #fff;
  border-radius: 10px;
  position: fixed;
  right: 15%;
  bottom: 32%;
  padding: 30px 50px 30px;
  box-sizing: border-box;
}
.login-title {
  color: #2881ff;
  text-align: center;
  margin: 0 0 30px;
  font-size: 25px;
}
.footer {
  position: fixed;
  text-align: center;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #606266;
}
</style>