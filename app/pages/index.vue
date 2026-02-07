<script setup lang="ts">
import getUserData from '~/plugins/getUseData';
import { usePostStore } from '#imports';
const { posts } = usePostStore();
const blogPosts = ref<Post[]>([])
const getcurrentposts = ()=>{
     blogPosts.value = posts.value || [];
   console.log(posts);
   console.log(blogPosts.value);
}


const layout = 'default'

const userInput = ref({
  name:'My',
  email:''
});

onMounted(()=>{

       const userdata = getUserData();
      //  console.log(userdata);\
       if(userdata?.user){
    userInput.value = {
       name:userdata.user.name || 'My',
       email:userdata.user.email || ''
    }    
       }
      //  console.log(userInput.value.name);
       getcurrentposts()
})
</script>

<template> 
    <!-- Hero 区域 -->
     <NuxtLayout :name='layout'>
      <section class="py-20 md:py-32">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
         {{ userInput.name}} Blog
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10">
              Love yourself~
            </p>
          </div>
        </div>
      </section>

      <!-- 博客文章卡片组 -->
      <section class="py-16 bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UCard v-for="post in blogPosts" :key="post.id"
                class="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-700">
                <div class="flex flex-col items-center text-center p-6">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ post.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-300">{{ post.post_content }}</p>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </section>
    </NuxtLayout>
</template>