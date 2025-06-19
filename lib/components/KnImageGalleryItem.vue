<script setup lang="ts">
import type { KnImageDataItem } from "@/types.ts";
import { computed } from "vue";
import { useImageLoader } from "@/utils.ts";
import ImageStateWrapper from "@/components/ImageStateWrapper.vue";

const props = withDefaults(defineProps<{
  image: KnImageDataItem,
  width?: number,
  height?: number,
  cover?: boolean,
  activeClass?: string,
  active?: boolean
}>(), {
  width: 100,
  height: 100,
  activeClass: 'kn-image-gallery-item-active'
})

const emit = defineEmits<{
  click: [KnImageDataItem]
}>()

const {
  isLoading,
  isError,
  loadImage
} = useImageLoader()

const wrapperStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  minWidth: `${props.width}px`,
  minHeight: `${props.height}px`
}))

const imageStyle = computed(() => ({
  backgroundImage: `url(${props.image.src})`,
  backgroundSize: props.image.cover ?? (props.cover ? 'cover' : 'contain'),
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

function onImageClick() {
  emit('click', props.image)
}

loadImage(props.image.src)
</script>

<template>
  <div
      class="kn-image-gallery-item"
      @click.prevent.stop="onImageClick"
      :style="wrapperStyle"
      :class="{[activeClass]: active}"
  >
    <image-state-wrapper
        :is-loading="isLoading" :is-error="isError"
    >
      <template #loading></template>
      <template #error></template>
      <div
          class="kn-image-gallery-item__image"
          :style="imageStyle"
      />
    </image-state-wrapper>
  </div>
</template>

<style scoped>

</style>