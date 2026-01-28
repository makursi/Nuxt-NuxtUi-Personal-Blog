<script setup lang="ts">

import useMyToast from '~/composable/useMyToast';
import MyEditor from '~/components/post/MyEditor.vue';
const myToast = useMyToast()
const props = defineProps(['postContent']);
const postInput = ref({
   title:'',
   post_content:props.postContent,
   id:null
}) 

const layout = 'admin'
const config = useRuntimeConfig()
const loading = ref(false)

const createPost = async ()=>{
  try {
    loading.value = true;
const userData = JSON.parse(localStorage.getItem("userdata") || '{}')
    const res = await $fetch(config.public?.API_BASE_URL + "/posts", {

      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      },
      method: "POST",
      body: postInput.value
    });

    console.log(res);

    myToast.success('Post created successfully!');
    await navigateTo('/admin/dashboard');
  } catch (error) {
    loading.value = false;
    if (error?.response?.status === 401) {
      showError(error.response?._data?.message);
      await navigateTo('/admin/create-Post');
    }
  }
}


</script>

<template>
  <NuxtLayout :name="layout">
   <UContainer>
    <div>
        <UMain>
<div class="p-2 m-2">
            <UFormField>
              <UInput placeholder="create your post title" v-model="postInput.title" />
            </UFormField>
          </div>
          <ClientOnly>
            <MyEditor />
          </ClientOnly>
          <div class="m-2">
           <UButton @click="createPost">publish post</UButton>
          </div>
        </UMain>
      </div>
   </UContainer>
  </NuxtLayout>

</template>

<style lang="scss" scoped>

</style>