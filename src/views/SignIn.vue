<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import Password from 'primevue/password'
import {useToast} from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Toast from 'primevue/toast'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
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

const showSuccess = (message) => {
  toast.add({
    severity: 'success',
    summary: '注册成功',
    detail: message,
    life: 3000
  })
}

// 修改后的注册处理函数
const handleSubmit = async () => {
  // 验证密码一致性
  if (password.value !== confirmPassword.value) {
    showError('两次输入的密码不一致')
    return
  }

  // 验证密码长度
  if (password.value.length < 8) {
    showError('密码长度至少为8位')
    return
  }

  loading.value = true

  try {
    // 发送POST请求到后端注册接口
    const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const result = await response.json()

    if (response.ok) {
      showSuccess('账号注册成功，请登录')
      // 注册成功后跳转到登录页面
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      showError(result.detail || '注册失败，请稍后重试')
    }
  } catch (error) {
    showError('网络错误，请检查连接')
    console.error('注册请求失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <main class="primevue-register">
    <Toast position="top-center"/>
    <Card class="register-card">
      <template #title>
        <div class="text-center">
          <i class="pi pi-user-plus" style="font-size: 2rem"></i>
          <h1>用户注册</h1>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="flex flex-column gap-3">
            <!-- 用户名 -->
            <div class="label-input-row">
              <label for="username" class="label">用户名</label>
              <InputText
                  id="username"
                  v-model="username"
                  placeholder="请输入用户名"
                  required
                  class="text"
              />
            </div>

            <!-- 密码 -->
            <div class="label-input-row">
              <label for="password" class="label">密码</label>
              <Password
                  id="password"
                  v-model="password"
                  placeholder="请输入密码"
                  toggleMask
                  :feedback="false"
                  required
              />
            </div>

            <!-- 确认密码 -->
            <div class="label-input-row">
              <label for="confirmPassword" class="label">确认密码</label>
              <Password
                  id="confirmPassword"
                  v-model="confirmPassword"
                  placeholder="请再次输入密码"
                  toggleMask
                  :feedback="false"
                  required
              />
            </div>

            <!-- 注册按钮 -->
            <div class="button-container">
              <Button
                  type="submit"
                  label="立即注册"
                  :loading="loading"
                  class="mt-3"
                  style="background: #14e889 ;color: white"
              >
                <template #loading>
                  <i class="pi pi-spin pi-spinner" style="font-size: 1.2rem"></i>
                </template>
              </Button>
            </div>

            <!-- 登录链接 -->
            <div class="text-center mt-3">
              <span>已有账号？</span>
              <router-link
                  to="/"
                  class="text-primary hover:underline cursor-pointer"
              >
                立即登录
              </router-link>
            </div>
          </div>
        </form>
      </template>
    </Card>
  </main>
</template>

<style scoped>
.primevue-register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* 用你的图片替换背景 */
  background-image: url('src/assets/bc.jpg');
  background-size: cover; /* 图片铺满，保持比例 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
}


.text {
  background: #f3eaea;
}

.register-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.7);
}

.text-center {
  text-align: center;
}

:deep(.p-password input) {
  background-color: #f3eaea;
}

.label {
  width: 100px;
  font-weight: bold;
}

:deep(.p-inputtext),
:deep(.p-password) {
  flex: 1;
  max-width: 200px;
  width: 200px;
  border-radius: 8px;
}

.label-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

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

.text-primary {
  color: #3B82F6;
  transition: color 0.2s;
}

.hover\:underline:hover {
  text-decoration: underline;
}
</style>