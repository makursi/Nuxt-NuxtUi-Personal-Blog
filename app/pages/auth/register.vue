<script setup lang="ts">
const layout = 'auth'
</script>

<template>
  <div>

    <NuxtLayout :name="layout">
     <UContainer>
        <UFormField label="name" required>
          <UInput placeholder="Enter your name" />
        </UFormField>
        <UFormField label="Email" required>
          <UInput placeholder="Enter your email" />
        </UFormField>
        <UFormField label="Password" required>
          <UInput placeholder="Enter your password" />
        </UFormField>
        <UButton label="sign up" class="m-2 py-2">
          <NuxtLink to="/auth/register">sign up a account</NuxtLink>
        </UButton>
        <UButton label="sign up" class="m-2 py-2">
          <NuxtLink to="/auth/login">sign in</NuxtLink>
        </UButton>
      </UContainer>
    </NuxtLayout>

  </div>
</template>

<style lang="scss" scoped>

</style>