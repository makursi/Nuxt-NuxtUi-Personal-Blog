<!-- layouts/default.vue -->
<script setup lang="ts">
  import NuxtHeader from '~/components/layout/NuxtHeader.vue';
</script>

<template>
  <!-- ✅ 单一根元素 + 粘性 footer 布局 -->
  <div class="flex min-h-screen flex-col bg-white dark:bg-gray-900">

    <!-- 顶部导航栏（使用 Nuxt UI 组件） -->
 <NuxtHeader>
 </NuxtHeader>

    <!-- 页面内容区域（关键！） -->
    <main class="grow p-4 md:p-8">
      <slot /> 
    </main>

    <!-- 页脚（使用 Nuxt UI） -->
    <UFooter>
      <template #left>
        <p class="text-sm text-muted">© {{ new Date().getFullYear() }} My Blog</p>
      </template>
    </UFooter>
  </div>
</template>

<script lang="ts">
// 切换亮暗主题
const toggleColorMode = () => {
  const colorMode = useColorMode()
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>