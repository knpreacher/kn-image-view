<script setup lang="ts">
import {KnImageData, KnImageDataItem} from "@/types.ts";
import KnImageGalleryItem from "@/components/KnImageGalleryItem.vue";

withDefaults(defineProps<{
  images: KnImageData,
}>(), {})

const activeIndex = defineModel({default: 0})

function onImageClick(
    image: KnImageDataItem,
    index: number
) {
  activeIndex.value = index
}
</script>

<template>
  <div class="kn-image-gallery">
    <kn-image-gallery-item
        v-for="(image, ind) in images" :key="`image__${ind}|${image.src}`"
        :image="image"
        :active="ind === activeIndex"
        cover
        @click="onImageClick(image, ind)"
    />
  </div>
</template>

<style scoped>

</style>