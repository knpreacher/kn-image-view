<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, TransitionProps} from "vue";
import type {KnImageData} from "@/types.ts";
import {KnImageView} from "@/index.ts";
import KnImageGallery from "@/components/KnImageGallery.vue";

interface KnImageViewDialogSlotProps {
  closeDialog: () => void,
  nextImage: () => void,
  prevImage: () => void,
  activeIndex: number,
  images: KnImageData
}

const props = withDefaults(defineProps<{
  transition?: TransitionProps,
  images: KnImageData,
  zIndex?: number,
  closeOnEscape?: boolean,
  padding?: number
}>(), {
  transition: () => ({
    name: 'kn-image-view-transition'
  }),
  closeOnEscape: true,
  padding: 10,
  zIndex: 100
})
const isOpen = defineModel('open', {default: false})
const activeIndex = defineModel('activeIndex', {default: 0})

const activeImage = computed(() => props.images[activeIndex.value])

const dialogStyle = computed(() => ({
  zIndex: props.zIndex,
  padding: `${props.padding}px`,
  background: 'rgba(0, 0, 0, 0.5)',
  width: `calc(100% - ${props.padding * 2}px)`,
  height: `calc(100% - ${props.padding * 2}px)`,
  maxWidth: `calc(100% - ${props.padding * 2}px)`,
  maxHeight: `calc(100% - ${props.padding * 2}px)`,
}))

const escapeKeyHandler = (e: KeyboardEvent) => {
  // console.log(e.key, e)
  if (e.key === 'Escape' && props.closeOnEscape) {
    e.preventDefault()
    e.stopPropagation()
    closeDialog()
  }
}

function createDialogEvents() {
  window.addEventListener('keydown', escapeKeyHandler)
}

function destroyDialogEvents() {
  window.removeEventListener('keydown', escapeKeyHandler)
}

function closeDialog() {
  isOpen.value = false
}

function nextImage() {
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}

function prevImage() {
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}

function bindSlotProps(): KnImageViewDialogSlotProps {
  return {
    closeDialog,
    nextImage,
    prevImage,
    activeIndex: activeIndex.value,
    images: props.images
  }
}

defineSlots<{
  header: (props: KnImageViewDialogSlotProps) => any,
  between: (props: KnImageViewDialogSlotProps) => any,
  footer: (props: KnImageViewDialogSlotProps) => any,
  loading: (props: KnImageViewDialogSlotProps) => any,
  error: (props: KnImageViewDialogSlotProps) => any,
  sideLeft: (props: KnImageViewDialogSlotProps) => any,
  sideRight: (props: KnImageViewDialogSlotProps) => any
}>()

onMounted(createDialogEvents)
onBeforeUnmount(destroyDialogEvents)
</script>

<template>
  <transition v-bind="transition">
    <dialog
        v-if="isOpen"
        open aria-modal="true"
        class="kn-image-view-dialog"
        :style="dialogStyle"
    >
      <slot v-bind="bindSlotProps()" name="header"></slot>
      <kn-image-view
          style="width: 100%; flex-grow: 1"
          :key="activeImage.src"
          :image-src="activeImage.src"
      >
        <template #sideLeft>
          <slot v-bind="bindSlotProps()" name="sideLeft"></slot>
        </template>
        <template #sideRight>
          <slot v-bind="bindSlotProps()" name="sideRight"></slot>
        </template>
        <template #error>
          <slot v-bind="bindSlotProps()" name="error"></slot>
        </template>
        <template #loading>
          <slot v-bind="bindSlotProps()" name="loading"></slot>
        </template>
      </kn-image-view>
      <slot v-bind="bindSlotProps()" name="between"></slot>
      <kn-image-gallery v-model="activeIndex" :images="images"/>
      <slot v-bind="bindSlotProps()" name="footer"></slot>
    </dialog>
  </transition>
</template>

<style scoped>

</style>