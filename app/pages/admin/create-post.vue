<script setup lang="ts">
const layout = 'admin'

const post = ref({
   title:'',
   post_content:'',
   id:''
}) 
</script>

<template>
  <NuxtLayout :name="layout">
   <UContainer>
    <div>
        <h1>
          create post
        </h1>
 

        <UMain>
          <UFormField>
            <UInput placeholder="create your post title" v-model="post.title" />
          </UFormField>



          <ClientOnly>

          </ClientOnly>
        </UMain>

      </div>
   </UContainer>
  </NuxtLayout>

</template>

<style lang="scss" scoped>

</style>