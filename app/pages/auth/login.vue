<script setup lang="ts">
const layout = 'auth'
import useMyToast from '~/composable/useMyToast'
const myToast = useMyToast()
const loginInput = ref({
   email:'',
   password:''
})

const loading = ref(false)

const config = useRuntimeConfig()
const loginUser = async () => {
  try {
    loading.value = true
    const res = await $fetch(config.public?.API_BASE_URL + '/login', {
      headers: {
        Accept: 'application/json',
        "content-type": 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(loginInput.value)
    })
    loading.value = false
    localStorage.setItem('userdata',JSON.stringify({
       token:res?.token,
       user:res?.user
    }))
    myToast.success(' successfully!', 'Login account successfully~')
    window.location.href = `./admin/dashboard`

  } catch (error) {
    loading.value = false
    const errmsg = error.message
    myToast.error('Error', errmsg)
  }}
</script>

<template>
  <div>

    <NuxtLayout :name="layout">
<UContainer>
        <UFormField label="Email">
          <UInput placeholder="Enter your email" v-model="loginInput.email"/>
        </UFormField>
        <UFormField label="Password">
          <UInput placeholder="Enter your Password" v-model="loginInput.password"/>
        </UFormField>
        <UButton label="Submit" class="m-2" @click="loginUser" :loading="loading">  {{ loading ? 'processing~~' : 'sign in' }}</UButton>

        <div class="m-2 py-2">
          <UButton label="sign up">
            <NuxtLink to="/auth/register">sign up a account</NuxtLink>
          </UButton>
        </div>
      </UContainer>
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped>

</style>