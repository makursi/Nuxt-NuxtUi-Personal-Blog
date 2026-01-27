<script setup lang="ts">
const layout = 'admin'
import MyEditor from '~/components/post/MyEditor.vue';
const postInput = ref({
   title:'',
   post_content:'',
   id:null,
}) 

defineProps(['postContent']);

postInput.value.post_content = postContent;
const loading = ref(false)

const createPost = async (req, res)=>{
   
  const Post = {
     title:postInput.value.title,
     post_content:postInput.value.post_content
  }
  try {

    loading.value = true;

    const res = await $fetch(config.public?.API_BASE_URL + "/posts", {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      },

      method: "POST",
      body: JSON.stringify(Post)
    });
  } catch (error) {
    loading.value = false;
    if (error?.response?.status === 401) {
      showError(error.response?._data?.message);
      await navigateTo('/auth/login');
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