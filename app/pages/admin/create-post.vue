<script setup lang="ts">
import slugify from 'slugify'
import useMyToast from '~/composable/useMyToast';
import MyEditor from '~/components/post/MyEditor.vue';
const myToast = useMyToast()

const postInput = ref({
   title:'',
   post_content:'',
   slug:''
}) 

watch(()=>postInput.value.title, (newTitle) => {
  if (newTitle && !postInput.value.slug) {
    postInput.value.slug = slugify(newTitle, { lower: true, strict: true })
  }
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

    console.log(postInput.value);

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
        <div class="flex flex-col p-2 m-2 items-left justify-between">
          <div class="flex flex-col p-2 m-2">
             <UFormField>
                <UInput placeholder="create your post title" v-model="postInput.title" />
              </UFormField>
                <ClientOnly class="mt-2">
                  <MyEditor v-model="postInput.post_content" class="editor-wrapper" />
                </ClientOnly>
              <div class="m-2">
                <UButton @click="createPost">Publish post</UButton>
              </div>
          </div>



        </div>
        </UMain>
      </div>
   </UContainer>
  </NuxtLayout>

</template>

<style lang="scss" scoped>
.editor-wrapper {
  width: 100%;
  height: 100%;
  margin-bottom: 16px;
}
</style>