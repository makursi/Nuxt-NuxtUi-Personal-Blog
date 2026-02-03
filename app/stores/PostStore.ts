import { defineStore } from 'pinia'
import useMyToast from '~/composable/useMyToast';
import type { Post } from '~/types/postType';

export const usePostStore = defineStore('post-store', () => {
  // Toast 通知实例
  const myToast = useMyToast();

  // 当前文章输入数据
  const postInput = ref({
    title: '',
    post_content: '',
    slug: '',
    excerpt: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published' | 'archived',
    tagsInput: '' // 用于输入新标签
  });

  // 状态管理
  const loading = ref({
    create: false,
    update: false,
    fetch: false,
    delete: false
  });

  const posts = ref<Post[]>([]);
  const currentPost = ref<Post | null>(null);
  const error = ref<string | null>(null);

  // 配置
  const config = useRuntimeConfig();

  // 创建文章
  const createPost = async () => {
    try {
      loading.value.create = true;
      error.value = null;

      const userData = JSON.parse(localStorage.getItem("userdata") || '{}');
      
      const res = await $fetch(config.public?.API_BASE_URL + "/posts", {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        method: "POST",
        body: postInput.value
      });

      // 添加新文章到列表
      if (res.data) {
        posts.value.unshift(res.data);
      }

      myToast.success('文章创建成功！');
      resetPostInput();
      
      return res;
    } catch (err: any) {
      error.value = err.message || '创建文章失败';
      loading.value.create = false;
      
      if (err?.response?.status === 401) {
        showError(err.response?._data?.message);
        await navigateTo('/auth/login');
      } else {
        myToast.error('创建文章失败', error.value);
      }
      
      throw err;
    } finally {
      loading.value.create = false;
    }
  };

  // 获取所有文章
  const fetchPosts = async () => {
    try {
      loading.value.fetch = true;
      error.value = null;

      const res: any = await $fetch(config.public?.API_BASE_URL + "/posts", {
        method: "GET"
      });

      posts.value = res.data || [];
      return res;
    } catch (err: any) {
      error.value = err.message || '获取文章失败';
      loading.value.fetch = false;
      
      if (err?.response?.status === 401) {
        showError(err.response?._data?.message);
        await navigateTo('/auth/login');
      } else {
        myToast.error('获取文章失败', error.value);
      }
      
      throw err;
    } finally {
      loading.value.fetch = false;
    }
  };

  // 获取单个文章
  const fetchPostById = async (slug:string) => {
    try {
      loading.value.fetch = true;
      error.value = null;

      const res: any = await $fetch(`${config.public?.API_BASE_URL}/posts/:${slug}`, {
        method: "GET"
      });

      currentPost.value = res.data;
      return res;
    } catch (err: any) {
      error.value = err.message || '获取文章失败';
      loading.value.fetch = false;
      
      if (err?.response?.status === 401) {
        showError(err.response?._data?.message);
        await navigateTo('/auth/login');
      } else {
        myToast.error('获取文章失败', error.value);
      }
      
      throw err;
    } finally {
      loading.value.fetch = false;
    }
  };

  // 更新文章
  const updatePost = async (id: number) => {
    try {
      loading.value.update = true;
      error.value = null;

      const userData = JSON.parse(localStorage.getItem("userdata") || '{}');
      
      const res = await $fetch(`${config.public?.API_BASE_URL}/posts/${id}`, {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        method: "PUT",
        body: postInput.value
      });

      // 更新本地文章列表
      const index = posts.value.findIndex(post => post.Id === id);
      if (index !== -1) {
        posts.value[index] = { ...postInput.value, Id: id } as Post;
      }

      // 如果当前编辑的是正在查看的文章，也更新它
      if (currentPost.value && currentPost.value.Id === id) {
        currentPost.value = { ...postInput.value, Id: id } as Post;
      }

      myToast.success('文章更新成功！');
      return res;
    } catch (err: any) {
      error.value = err.message || '更新文章失败';
      loading.value.update = false;
      
      if (err?.response?.status === 401) {
        showError(err.response?._data?.message);
        await navigateTo('/auth/login');
      } else {
        myToast.error('更新文章失败', error.value);
      }
      
      throw err;
    } finally {
      loading.value.update = false;
    }
  };

  // 删除文章
  const deletePost = async (id: number) => {
    try {
      loading.value.delete = true;
      error.value = null;

      const userData = JSON.parse(localStorage.getItem("userdata") || '{}');
      
      const res = await $fetch(`${config.public?.API_BASE_URL}/posts/${id}`, {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        method: "DELETE"
      });

      // 从本地文章列表中移除
      posts.value = posts.value.filter(post => post.Id !== id);
      
      // 如果当前查看的是被删除的文章，则清空
      if (currentPost.value && currentPost.value.Id === id) {
        currentPost.value = null;
      }

      myToast.success('文章删除成功！');
      return res;
    } catch (err: any) {
      error.value = err.message || '删除文章失败';
      loading.value.delete = false;
      
      if (err?.response?.status === 401) {
        showError(err.response?._data?.message);
        await navigateTo('/auth/login');
      } else {
        myToast.error('删除文章失败', error.value);
      }
      
      throw err;
    } finally {
      loading.value.delete = false;
    }
  };

  // 重置文章输入
  const resetPostInput = () => {
    postInput.value = {
      title: '',
      post_content: '',
      slug: '',
      excerpt: '',
      tags: [],
      status: 'draft',
      tagsInput: ''
    };
  };

  // 设置当前编辑的文章
  const setCurrentPost = (post: Post) => {
    currentPost.value = { ...post };
    // 同步到 postInput 以便编辑
    postInput.value = {
      title: post.title || '',
      post_content: post.post_content || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      tags: post.tags || [],
      status: post.status || 'draft',
      tagsInput: '' // 重置标签输入框
    };
  };

  // 清除当前文章
  const clearCurrentPost = () => {
    currentPost.value = null;
    resetPostInput();
  };

  return {
    // 状态
    postInput,
    posts,
    currentPost,
    loading,
    error,

    // 方法
    createPost,
    fetchPosts,
    fetchPostById,
    updatePost,
    deletePost,
    resetPostInput,
    setCurrentPost,
    clearCurrentPost
  };
});