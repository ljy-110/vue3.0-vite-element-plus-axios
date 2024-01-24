<template>
  <div class="login-container center">
    <div class="logo-box ">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" hide-required-asterisk class="demo-ruleForm" status-icon>
        <el-form-item label="账号" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" @click="submitForm('ruleFormRef')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,reactive, getCurrentInstance  } from 'vue'
import CryptoJS from 'crypto-js'
const currentInstance = getCurrentInstance()
const { $http,$router } = currentInstance.appContext.config.globalProperties
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const ruleForm = ref({
  name:'',password:''
})
const rules = ref({
  name: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})

// 加密
function encrypt (word) {
  let keyStr = 'Vn74ag9kBuW3lYv2' // 密钥
  let ivStr = keyStr.substring(0, 16) // 偏移量
  let key = CryptoJS.enc.Utf8.parse(keyStr)
  let iv = CryptoJS.enc.Utf8.parse(ivStr)
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
// function decrypt (word) {
//   let keyStr = 'Vn74ag9kBuW3lYv2'
//   let ivStr = keyStr.substring(0, 16)
//   let base64 = CryptoJS.enc.Utf8.parse(word)
//   var key = CryptoJS.enc.Utf8.parse(keyStr)
//   let iv = CryptoJS.enc.Utf8.parse(ivStr)
//   let src = CryptoJS.enc.Utf8.stringify(base64)
//   var decrypt = CryptoJS.AES.decrypt(src, key, {
//     iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7
//   })
//   return decrypt.toString(CryptoJS.enc.Utf8)
// }

const ruleFormRef = ref(null)
const submitForm = ()=>{
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      $http.post('/login/common',{
        username: ruleForm.value.name,
        loginKey: encrypt(ruleForm.value.password)
      }).then(res => {
        let { data } = res.data
        // console.log(res);
        sessionStorage.setItem('isMatch', res.data.data.isMatch)
        sessionStorage.setItem('isFirst', 'true')
        router.push('/main/index')
        // sessionStorage.setItem('systemInfo',JSON.stringify(data))
      })
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
}

function systemConfig() {
  $http.get('/loginRest/systemConfig/3',{}).then(res => {
    let { data } = res.data
    sessionStorage.setItem('systemInfo',JSON.stringify(data))
  })
  // $http({
  //   url: '/loginRest/systemConfig/3'
  // }).then(res=>{
  //   let { data } = res.data
  //   sessionStorage.setItem('systemInfo',JSON.stringify(data))
  // })
}
onMounted(() => {
  systemConfig();
})


</script>

<style lang='scss' scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url("/image/login-bg.jpg");
  background-position: center center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.logo-box{
  width: 350px;
  background-color: rgba(15, 23, 22,0.6);
  padding: 30px;
  box-sizing: border-box;
  color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  :deep(.el-form-item__label){
    color: #fff;
  }
  :deep(.el-input__wrapper){
    background-color: transparent;
  }
  :deep(.el-input__inner){
    color: #fff;
  }
  :deep(.el-button){
    background-color: transparent;
    color: #fff;
  }
}
</style>