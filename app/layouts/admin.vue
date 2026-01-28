<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import getUserData from '~/plugins/getUseData';
import useMyToast from '~/composable/useMyToast';
const myToast = useMyToast()
const userData = getUserData()
const loading = ref(false)
const config = useRuntimeConfig()
const items = computed<NavigationMenuItem[]>(()=>[
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Posts', to: '/admin/list-of-post' },
  { label: 'Create Post', to: '/admin/create-post' }
])

async function checkIfUserIsLoggedIn() {
  try {
    const res = await $fetch(config.public?.API_BASE_URL + "/user-logged-in", {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      },
      method: "POST",
    });
  } catch (error) {
    loading.value = false;
    if (error?.response?.status === 401) {
      showError(error.response?._data?.message);
      localStorage.clear()
      await navigateTo('/auth/login');
    }
  }
}



const logoutUser = async () => {
  try {
    loading.value = true
    const res = await $fetch(config.public?.API_BASE_URL + '/logout', {
      headers: {
        Accept: 'application/json',
        "content-type": 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ userId: userData?.user?.Id })
    })
    loading.value = false
    localStorage.clear()
    await navigateTo('/auth/login');
    myToast.success(' successfully!', 'Logout account successfully~')

  } catch (error) {
    loading.value = false
    const errmsg = error.message
    localStorage.clear()
    await navigateTo('/auth/login');
  }
}


onMounted(async ()=>{
   await checkIfUserIsLoggedIn()
})


</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
  <UHeader>
    <template #left>
       <UNavigationMenu :items="items" />
    </template>

    <template #right>
       <div class="m-2 p-2 flex items-center justify-evenly">
          <h3 class="text-lg font-bold m-2">Welcome, {{ userData?.user?.name }}</h3>
          <h1 class="text-base text-pink-700">{{ userData?.user?.email }}</h1>
          <UButton :label="logout" @click='logoutUser' :loading="loading" class="py-2 m-2"> {{ loading ? 'processing~~'
            :'logout' }}
          </UButton>
        </div>

    </template>
  </UHeader>
    <div>
        <slot></slot>
      </div>

  </div>
</template>

<style lang="scss" scoped>

</style>