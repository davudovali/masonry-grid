import { PhotoToRenderType, PhotoType } from '../PhotoType'
import { UIEvent, useCallback, useMemo, useState } from 'react'

export const VERTICAL_GAP = 8
export const HORIZONTAL_GAP = 8
export const DEFAULT_PHOTO_WIDTH = 200
export const SMALL_SCREEN_PADDINGS = 32
export const SCROLL_BUFFER = 400

export function getWindowViewWidth() {
  return document.getElementById('root')?.getBoundingClientRect()?.width || 0
}

function buildPhotosToRender({
  photos,
  columnsNumber,
  smallScreenWidth,
}: {
  photos: PhotoType[]
  columnsNumber: number
  smallScreenWidth: number
}) {
  let containerHeight = 0

  const photosWithSizeAndPosition = photos.reduce<PhotoToRenderType[]>((result, photo, index) => {
    const photoWidth = columnsNumber === 1 ? smallScreenWidth : DEFAULT_PHOTO_WIDTH
    const scaleRatio = photo.width / photoWidth
    const adjustedHeight = Math.floor(photo.height / scaleRatio)

    const leftNeighbor = result[index - 1]
    const topNeighbor = result[index - columnsNumber]

    const x =
      index % columnsNumber === 0 ? 0 : leftNeighbor.position.x + HORIZONTAL_GAP + photoWidth
    const y =
      index < columnsNumber ? 0 : topNeighbor.position.y + VERTICAL_GAP + topNeighbor.size.height

    if (y + adjustedHeight > containerHeight) containerHeight = y + adjustedHeight

    result.push({
      ...photo,
      index,
      hidden: false,
      size: {
        width: photoWidth,
        height: adjustedHeight,
      },
      position: {
        x,
        y,
      },
    })

    return result
  }, [])

  return { photosWithSizeAndPosition, containerHeight }
}

export function useMasonryGrid({
  photos,
  columnsNumber,
  smallScreenWidth,
}: {
  photos?: PhotoType[]
  columnsNumber: number
  smallScreenWidth: number
}) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const { photosWithSizeAndPosition, containerHeight, containerWidth } = useMemo(() => {
    if (!photos || !photos.length) {
      return { photosWithSizeAndPosition: [], containerHeight: 0, containerWidth: 0 }
    }

    const { photosWithSizeAndPosition, containerHeight } = buildPhotosToRender({
      photos,
      columnsNumber,
      smallScreenWidth,
    })

    return {
      photosWithSizeAndPosition,
      containerHeight,
      containerWidth:
        columnsNumber === 1
          ? smallScreenWidth
          : columnsNumber * (DEFAULT_PHOTO_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP,
    }
  }, [photos, columnsNumber, smallScreenWidth])

  const photosToRender = useMemo(() => {
    const visibleHeight = document.getElementById('root')?.getBoundingClientRect()?.height || 0
    return photosWithSizeAndPosition?.map((photo) => {
      const y = photo.position.y
      const height = photo.size.height
      let hidden = false
      const scrollBuffer = columnsNumber === 1 ? SCROLL_BUFFER * 4 : SCROLL_BUFFER
      if (y + height + scrollBuffer < scrollPosition) hidden = true
      if (y - scrollBuffer > scrollPosition + visibleHeight) hidden = true
      photo.hidden = hidden
      return photo
    })
  }, [photosWithSizeAndPosition, scrollPosition])

  const onScroll = useCallback((event: UIEvent<HTMLElement>) => {
    setScrollPosition(event.currentTarget.scrollTop)
  }, [])

  return { photosToRender, containerHeight, containerWidth, onScroll, columnsNumber }
}
