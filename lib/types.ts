export interface Point {
  x: number,
  y: number
}

export interface KnImageDataItem {
  title?: string,
  description?: string,
  src: string,
  thumb?: string
}

export interface KnImageData extends Array<KnImageDataItem> {
}