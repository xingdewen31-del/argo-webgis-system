<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import Password from 'primevue/password'
import {useToast} from 'primevue/usetoast'
import axios from 'axios'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Toast from 'primevue/toast'

const username = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const toast = useToast()

const showError = (message) => {
  toast.add({
    severity: 'error',
    summary: '错误提示',
    detail: message,
    life: 3000
  })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await axios.post('http://127.0.0.1:8000/login', {
      username: username.value,
      password: password.value
    })

    // 登录成功
    localStorage.setItem('token', 'fake-token') // 存真实返回的token
    await router.push({name: 'mainviewer'})
  } catch (err) {
    if (err.response && err.response.status === 401) {
      showError('用户名或密码错误')
    } else {
      showError('验证失败，请检查网络连接')
    }
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <main class="primevue-login">
    <Toast position="top-center"/>
    <Card class="login-card">
      <template #title>
        <div class="text-center">
          <i class="pi pi-user" style="font-size: 2rem"></i>
          <h1>用户登录</h1>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="flex flex-column gap-3">
            <!-- 用户名 -->
            <div class="label-input-row">
              <label for="username" class="label">用户名</label>
              <InputText id="username" v-model="username" placeholder="请输入用户名" class="text"/>
            </div>

            <!-- 密码 -->
            <div class="label-input-row">
              <label for="password" class="label">密码</label>
              <Password id="password" v-model="password" placeholder="请输入密码" toggleMask :feedback="false"
              />
            </div>

            <!-- 登录按钮 -->
            <div class="button-container">
              <Button type="submit" label="立即登录" :loading="loading" class="mt-3"
                      style="background: #14e889 ;color: white">
                <template #loading>
                  <i class="pi pi-spin pi-spinner" style="font-size: 1.2rem"></i>
                </template>
              </Button>
            </div>
            <div>

            </div>
          </div>
        </form>
        <div class="text-center mt-3">
          <span>没有账号？</span>
          <router-link
              to="/signinview"
              class="text-primary hover:underline cursor-pointer"
          >
            立即注册
          </router-link>
        </div>
      </template>
    </Card>
  </main>
</template>

<style scoped>
.primevue-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('src/assets/bc.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}


.text {
  background: #f3eaea;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.7);
}

:deep(.p-password input) {
  background-color: #f3eaea;
}

.text-center {
  text-align: center;
}

/* 设置标签宽度，确保长度一致 */
.label {
  width: 100px; /* 你可以根据需要调整宽度 */
  font-weight: bold;
}

/* 调整输入框宽度 */
:deep(.p-inputtext),
:deep(.p-password) {
  flex: 1; /* 让输入框自适应填写剩下空间 */
  max-width: 200px; /* 固定宽度，可调整 */
  width: 200px;
  border-radius: 8px;
}

.label-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 标签和输入框间距 */

}

/* 新增：按钮居中容器 */
.button-container {
  display: flex;
  justify-content: center;
}

:deep(.p-button) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
