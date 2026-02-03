<script setup lang="ts">
import useMyToast from '~/composable/useMyToast';

const myToast = useMyToast();
definePageMeta({
  layout: 'admin'
});

const loading = ref(false);
const config = useRuntimeConfig();

// 分页相关
const currentPage = ref(1);
const itemsPerPage = ref(5); // 每页显示5篇文章
const totalPosts = ref(0);

// 文章数据
const postsArray = ref<any[]>([]);
const isempty = (length:number)=>{
   if(length===0){
     return false
   }
   return true
}
// 获取文章列表
const getPosts = async () => {
  try {
    loading.value = true;
    const res: any = await $fetch(config.public?.API_BASE_URL + "/posts", {
      method: "GET"
    });
    
    // 假设API返回的数据格式为 { data: [...], total: count }
    postsArray.value = res.data || [];
    totalPosts.value = res.total || postsArray.value.length;
  } catch (error: any) {
    loading.value = false;
    console.error("Error fetching posts:", error);
    if (error?.response?.status === 401) {
      showError(error.response?._data?.message);
    }
  } finally {
    loading.value = false;
  }
};

// 删除文章
const deletePost = async (postId: number) => {
  try {
    loading.value = true;
    const userData = JSON.parse(localStorage.getItem("userdata") || '{}')
    await $fetch(`${config.public?.API_BASE_URL}/posts/${postId}`, {

      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      },

      method: "DELETE"
    });
    console.log(postId);
    
    // 从本地数组中移除文章
    postsArray.value = postsArray.value.filter(post => post._id !== postId);
    totalPosts.value = postsArray.value.length;
    
    myToast.success('Post deleted successfully!');
  } catch (error: any) {
    loading.value = false;
    console.error("Error deleting post:", error);
    if (error?.response?.status === 401) {
      showError(error.response?._data?.message);
    }
  } finally {
    loading.value = false;
  }
};

// 编辑文章
const editPost = (postSlug:string) => {
  navigateTo(`/admin/edit-post/${postSlug}`);
};

// 计算当前页的文章
const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return postsArray.value.slice(startIndex, endIndex);
});

// 计算总页数
const totalPages = computed(() => Math.ceil(totalPosts.value / itemsPerPage.value));

onMounted(() => {
  getPosts();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">文章管理</h1>
        <p class="text-gray-600 dark:text-gray-400">管理您的博客文章</p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-between items-center mb-6">
        <UButton 
          to="/admin/create-post" 
          color="primary" 
          size="lg"
          class="px-6 py-2"
          v-if="isempty(postsArray.length)"
        >
          <UIcon name="i-heroicons-plus" class="mr-2" />
          新建文章
        </UButton>
        
        <UButton 
          @click="getPosts" 
          color="gray" 
          variant="outline"
          :loading="loading"
        >
          <UIcon name="i-heroicons-arrow-path" class="mr-2" />
          刷新
        </UButton>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-10">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
      </div>

      <!-- 文章列表 -->
      <div v-else-if="postsArray.length > 0" class="space-y-6">
        <UCard 
          v-for="post in paginatedPosts" 
          :key="post._id"
          class="hover:shadow-lg transition-shadow"
        >
          <template #header>
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ post.title }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  发布时间: {{ new Date(post.created_at || '').toLocaleDateString() }}
                </p>
              </div>
              <div class="flex space-x-2">
                <UButton 
                  @click="editPost(post.slug)" 
                  color="blue" 
                  variant="outline" 
                  size="sm"
                >
                  <UIcon name="i-heroicons-pencil" class="w-4 h-4 mr-1" />
                  编辑
                </UButton>
                <UButton 
                  @click="deletePost(post._id)" 
                  color="red" 
                  variant="outline" 
                  size="sm"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-1" />
                  删除
                </UButton>
              </div>
            </div>
          </template>
          
          <div class="prose prose-sm max-w-none dark:prose-invert" v-html="post.post_content"></div>
          
          <template #footer>
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                标签: 
                <UBadge 
                  v-for="tag in (post.tags || ['未分类'])" 
                  :key="tag" 
                  color="primary" 
                  size="xs"
                  class="mr-2"
                >
                  {{ tag }}
                </UBadge>
              </div>
              <UButton 
                :to="`/post/${post.slug || post._id}`" 
                color="gray" 
                variant="link" 
                size="sm"
              >
                查看文章 →
              </UButton>
            </div>
          </template>
        </UCard>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading" class="text-center py-12">
        <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">暂无文章</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">您还没有创建任何文章</p>
        <UButton 
          to="/admin/create-post" 
          color="primary"
        >
          创建第一篇文章
        </UButton>
      </div>

      <!-- 分页器 -->
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
        <UPagination
          v-model="currentPage"
          :total="totalPosts"
          :page-size="itemsPerPage"
          :sibling-count="1"
          @update:model-value="currentPage = $event"
        />
        
        <div class="text-sm text-gray-500 dark:text-gray-400">
          共 {{ totalPosts }} 篇文章，每页显示 {{ itemsPerPage }} 篇
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>