<script setup lang="ts">
import type {KnImageData, KnImageDataItem} from "@/types.ts";
import KnImageGalleryItem from "@/components/KnImageGalleryItem.vue";
import {computed, type StyleValue} from "vue";

const props = withDefaults(defineProps<{
  images: KnImageData,
  width?: number,
  height?: number,
  cover?: boolean,
  activeClass?: string,
  readonly?: boolean,
  wrap?: boolean
}>(), {})

const emit = defineEmits<{
  click: [KnImageDataItem, number]
}>()

const activeIndex = defineModel({required: false})

function onImageClick(
    image: KnImageDataItem,
    index: number
) {
  if (props.readonly) return
  activeIndex.value = index
  emit('click', image, index)
}

function isImageActive(index: number) {
  if (props.readonly) return false
  return activeIndex.value === index
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
  <div class="kn-image-gallery" :class="{'kn-image-gallery__readonly': readonly}" :style="galleryStyle">
    <slot name="prepend"></slot>
    <kn-image-gallery-item
        v-for="(image, ind) in images" :key="`image__${ind}|${image.src}`"
        :image="image"
        :height="height"
        :width="width"
        :active-class="activeClass"
        :cover="cover"
        :active="isImageActive(ind)"
        @click="onImageClick(image, ind)"
    />
    <slot name="append"></slot>
  </div>
</template>

<style scoped>

</style>