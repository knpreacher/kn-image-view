import { ref } from "vue";

export type ImageProps = Pick<HTMLImageElement, 'crossOrigin' | 'loading'>
export const useImageLoader = (imgProps?: ImageProps) => {

  const isLoading = ref(false)
  const isError = ref(false)

  function loadImageAsync(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      Object.entries(imgProps ?? {}).forEach(([key, value]) => {
        // @ts-ignore
        image[key as keyof HTMLImageElement] = value
      })
      image.onload = () => {
        resolve(image)
      }
      image.onerror = reject
      image.src = src
    })
  }


  function loadImage(src: string, onload?: (img: HTMLImageElement) => void, onerror?: () => void) {
    isLoading.value = true
    isError.value = false
    loadImageAsync(src).then((value) => {
      onload?.(value)
    }).catch(() => {
      isError.value = true
      onerror?.()
    }).finally(() => {
      isLoading.value = false
    })
  }

  return {
    isLoading,
    isError,
    loadImage
  }
}