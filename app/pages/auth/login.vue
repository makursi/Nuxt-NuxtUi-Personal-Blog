<script setup lang="ts">
const layout = 'auth'

const loginAccount = ref({
   email:'',
   password:''
})
</script>

<template>
  <div>

    <NuxtLayout :name="layout">
<UContainer>
        <UFormField label="Email">
          <UInput placeholder="Enter your email" v-model="loginAccount.email"/>
        </UFormField>
        <UFormField label="Password">
          <UInput placeholder="Enter your Password" v-model="loginAccount.password"/>
        </UFormField>
        <UButton label="Submit" class="m-2">sign in</UButton>

        <div class="m-2 py-2">
          <UButton label="sign up">
            <NuxtLink to="/auth/register">sign up a account</NuxtLink>
          </UButton>
        </div>
      </UContainer>
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped>

</style>