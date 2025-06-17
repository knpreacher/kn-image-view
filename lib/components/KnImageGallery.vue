<script setup lang="ts">
import type { KnImageData, KnImageDataItem } from "@/types.ts";
import KnImageGalleryItem from "@/components/KnImageGalleryItem.vue";
import { computed, type StyleValue } from "vue";

const props = withDefaults(defineProps<{
  images: KnImageData,
  wrap?: boolean
}>(), {})

const emit = defineEmits<{
  click: [KnImageDataItem, number]
}>()

const activeIndex = defineModel({default: 0})

function onImageClick(
    image: KnImageDataItem,
    index: number
) {
  activeIndex.value = index
  emit('click', image, index)
}

const galleryStyle = computed<StyleValue>(() => ({
  display: 'flex',
  flexWrap: props.wrap ? 'wrap' : 'nowrap',
  overflow: props.wrap ? 'hidden' : 'auto',
  justifyContent: props.wrap ? 'flex-start' : 'center',
}))

defineSlots<{
  prepend: (props: {}) => any,
  append: (props: {}) => any
}>()
</script>

<template>
  <div class="kn-image-gallery" :style="galleryStyle">
    <slot name="prepend"></slot>
    <kn-image-gallery-item
        v-for="(image, ind) in images" :key="`image__${ind}|${image.src}`"
        :image="image"
        :active="ind === activeIndex"
        cover
        @click="onImageClick(image, ind)"
    />
    <slot name="append"></slot>
  </div>
</template>

<style scoped>

</style>