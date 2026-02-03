<script setup lang="ts">
import { usePostStore } from '~/stores/PostStore';
import slugify from 'slugify';
import MyEditor from '~/components/post/MyEditor.vue';
import useMyToast from '~/composable/useMyToast';
definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const postSlug = Array.isArray(route.params.slug)
  ? route.params.id[0]
  : route.params.id;
const postStore = usePostStore();
const myToast = useMyToast();

// 初始化文章数据
const postInput = computed(() => postStore.postInput);
const loading = computed(() => postStore.loading.update);

// 监听标题变化以自动生成slug
watch(() => postInput.value.title, (newTitle) => {
  if (newTitle && !postInput.value.slug) {
    postInput.value.slug = slugify(newTitle, { lower: true, strict: true });
  }
});

// 保存文章
const savePost = async () => {
  try {
    await postStore.updatePost(postId);
    myToast.success('文章更新成功！');
    await navigateTo('/admin/list-of-post');
  } catch (error) {
    console.error('更新文章失败:', error);
    myToast.error('更新文章失败');
  }
};

// 添加标签
const addTag = () => {
  if (postInput.value.tagsInput?.trim() &&
    !postInput.value.tags.includes(postInput.value.tagsInput.trim())) {
    postInput.value.tags.push(postInput.value.tagsInput.trim());
    postInput.value.tagsInput = '';
  }
};

// 移除标签
const removeTag = (tagToRemove: string) => {
  postInput.value.tags = postInput.value.tags.filter(tag => tag !== tagToRemove);
};

// 页面加载时获取文章数据
onMounted(async () => {
  try {
    await postStore.fetchPostById(postSlug);
  } catch (error) {
    console.error('获取文章失败:', error);
    myToast.error('获取文章失败');
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">编辑文章</h1>
      </div>

      <form @submit.prevent="savePost" class="space-y-6">
        <UFormGroup label="文章标题" name="title" required class="mb-6">
          <UInput v-model="postInput.title" placeholder="请输入文章标题" size="lg" color="gray" variant="outline"
            class="mt-2" />
        </UFormGroup>



        <UFormGroup label="文章内容" name="content" required class="mb-6">
          <ClientOnly class="mt-2">
            <MyEditor v-model="postInput.post_content" class="editor-wrapper w-full" />
            <template #fallback>
              <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[300px]">
                <p class="text-center text-gray-500">加载编辑器中...</p>
              </div>
            </template>
          </ClientOnly>
        </UFormGroup>

        <UFormGroup label="标签" name="tags" class="mb-6">
          <div class="mt-2">
            <div class="flex flex-wrap gap-2 mb-3">
              <UTag v-for="tag in postInput.tags" :key="tag" :label="tag" color="primary" size="sm" closable
                @close="removeTag(tag)" />
            </div>
            <div class="flex gap-2">
              <UInput v-model="postInput.tagsInput" placeholder="输入标签并按回车添加" size="sm" color="gray" variant="outline"
                @keydown.enter.prevent="addTag" />
              <UButton @click="addTag" color="gray" variant="outline" size="sm">
                添加
              </UButton>
            </div>
          </div>
        </UFormGroup>

        <UFormGroup label="文章状态" name="status" class="mb-6">
          <URadioGroup v-model="postInput.status" :options="[
            { label: '草稿', value: 'draft' },
            { label: '已发布', value: 'published' },
            { label: '已归档', value: 'archived' }
          ]" color="primary" class="mt-2" />
        </UFormGroup>

        <div class="pt-4 flex justify-between">
          <UButton :to="`/admin/list-of-post`" color="gray" variant="outline" size="lg" class="px-6 py-3">
            <UIcon name="i-heroicons-arrow-left" class="mr-2" />
            取消
          </UButton>

          <UButton type="submit" :loading="loading" color="primary" size="lg" class="px-8 py-3">
            <UIcon name="i-heroicons-check-circle" class="mr-2" />
            保存更改
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor-wrapper {
  min-height: 300px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: white;

  .dark & {
    border-color: #4b5563;
    background-color: #374151;
  }
}
</style>