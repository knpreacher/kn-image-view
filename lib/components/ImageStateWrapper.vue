<script setup lang="ts">
defineProps<{
  isLoading: boolean,
  isError: boolean
}>()
</script>

<template>
  <slot v-if="isLoading" name="loading">
    <div class="kn-image-loader"></div>
  </slot>
  <slot v-else-if="isError" name="error">Error loading image</slot>
  <slot v-else></slot>
</template>

<style scoped>

</style>