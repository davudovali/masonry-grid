export enum PhotoSizeEnum {
  ORIGINAL = 'original',
  LARGE_2_X = 'large2x',
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
  TINY = 'tiny',
}

export type PhotoType = {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: string
  avg_color: string
  src: Record<PhotoSizeEnum, string>
  alt: string
}

export type PhotoToRenderType = PhotoType & {
  hidden: boolean
  index: number
  size: {
    width: number
    height: number
  }
  position: {
    x: number
    y: number
    yTranslation?: number
  }
}
