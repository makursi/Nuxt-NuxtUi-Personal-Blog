<script setup lang="ts">
const value = ref('');


</script>

<template>
  <div>
    <UEditor v-model="value" class="w-full min-h-21" placeholder="Start writing..." :post-content="value"/>
  </div>
</template>

<style lang="scss" scoped>

</style>