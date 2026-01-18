<!-- pages/index.vue -->
<script setup lang="ts">
const layout = 'default'
</script>

<template>
 <NuxtLayout :name="layout">
  <ul>
    <li>
        <NuxtLink to="/about">About page</NuxtLink>
      </li>
    <li>
      <NuxtLink to="/hello">Hello page</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/auth/login">login page</NuxtLink>
    </li>
  </ul>
  </NuxtLayout>
</template>