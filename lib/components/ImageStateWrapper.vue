<script setup lang="ts">
defineProps<{
  isLoading: boolean,
  isError: boolean
}>()
</script>

<template>
  <div class="kn-image-state-wrapper">
    <slot v-if="isLoading" name="loading">
      <div class="kn-image-loader"></div>
    </slot>
    <slot v-else-if="isError" name="error">
      <div class="kn-image-error">!</div>
    </slot>
    <slot v-else></slot>
  </div>
</template>

<style scoped>

</style>