export interface Point {
  x: number,
  y: number
}

export interface KnImageDataItem {
  src: string,
  thumb?: string
}

export interface KnImageData extends Array<KnImageDataItem> {
}