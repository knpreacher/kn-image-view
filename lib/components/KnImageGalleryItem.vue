<script setup lang="ts">
import type {KnImageDataItem} from "@/types.ts";
import {computed} from "vue";

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

const wrapperStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
}))

const imageStyle = computed(() => ({
  backgroundImage: `url(${props.image.src})`,
  backgroundSize: props.cover ? 'cover' : 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

function onImageClick() {
  emit('click', props.image)
}
</script>

<template>
  <div
      class="kn-image-gallery-item"
      @click.prevent.stop="onImageClick"
      :style="wrapperStyle"
      :class="{[activeClass]: active}"
  >
    <div class="kn-image-gallery-item__image" :style="imageStyle"></div>
  </div>
</template>

<style scoped>

</style>