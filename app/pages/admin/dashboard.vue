<script setup lang="ts">
const layout = 'admin'
import getUserData from '~/plugins/getUseData';
import useMyToast from '~/composable/useMyToast';
const myToast  = useMyToast
const userData = getUserData()
const config = useRuntimeConfig()
const loading = ref(false)
const logoutUser = async () => {
  try {
    loading.value = true
    const res = await $fetch(config.public?.API_BASE_URL + '/logout', {
      headers: {
        Accept: 'application/json',
        "content-type": 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({userId:userData?.user?.Id})
    })
    localStorage.clear()
    window.location.href=`auth/login`
    loading.value = false

    myToast.success(' successfully!', 'Logout account successfully~')

  } catch (error) {
    loading.value = false
    const errmsg = error.message
    myToast.error('Error', errmsg)
  }
}
</script>

<template>
  <div>
      <NuxtLayout :name="layout">
        <h1>{{ userData?.email }}</h1>
        <UButton :label="logout" @click='logoutUser'> {{ loading ? 'processing~~' : 'logout' }}</UButton>
      </NuxtLayout>
  </div>
</template>
 
<style lang="scss" scoped>

</style>