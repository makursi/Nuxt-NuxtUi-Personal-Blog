<script setup lang="ts">
import getUserData from '~/plugins/getUseData';
import useMyToast from '~/composable/useMyToast';
const myToast = useMyToast()
const userData = getUserData()
const loading = ref(false)
const config = useRuntimeConfig()


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
  <div>
    <ul>
      <li><NuxtLink to="/admin/dashboard">DashBoard</NuxtLink></li>
      <li><NuxtLink to="/admin/list-of-post">Posts</NuxtLink></li>
      <li>
        <NuxtLink to="/auth/login">Login</NuxtLink>
      </li>
    </ul>


    <UButton :label="logout" @click='logoutUser' :loading="loading"> {{ loading ? 'processing~~' : 'logout' }}</UButton>
  </div>

  <div><slot></slot></div>
</template>

<style lang="scss" scoped>

</style>