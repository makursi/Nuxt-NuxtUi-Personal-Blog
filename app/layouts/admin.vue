<script setup lang="ts">
import getUserData from '~/plugins/getUseData';

const userData = getUserData

const config = useRuntimeConfig()
async function checkIfUserIsLoggedIn() {
  try {
    const res = await $fetch(config.public?.API_BASE_URL + "/check/user/loggedin", {
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

      localStorage.clear();
      window.location.href = "/auth/login";
    }
  }
}

const {data,error} = await useFetch(`${config.public.API_BASE_URL}/check/user/loggedin`,{
   method:'GET',
    headers:{
Accept:`application/json`,
Authorization:`Bearer ${userData?.token}`
    }
})

console.log('data :',data.value,'error : ',error.value)

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
  </div>

  <div><slot></slot></div>
</template>

<style lang="scss" scoped>

</style>