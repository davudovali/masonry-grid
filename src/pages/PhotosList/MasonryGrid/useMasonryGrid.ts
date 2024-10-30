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

function getXPosition(
  list: PhotoToRenderType[],
  columnsNumber: number,
  index: number,
  photoWidth: number,
) {
  const leftNeighbor = list[index - 1]
  return index % columnsNumber === 0 ? 0 : leftNeighbor.position.x + HORIZONTAL_GAP + photoWidth
}

function getYPosition(list: PhotoToRenderType[], columnsNumber: number, index: number) {
  const topNeighbor = list[index - columnsNumber]
  return index < columnsNumber ? 0 : topNeighbor.position.y + VERTICAL_GAP + topNeighbor.size.height
}

function reorderLastLineToEqualizeLastLine(
  result: PhotoToRenderType[],
  columnsNumber: number,
  currentIndex: number,
) {
  if (columnsNumber === 1) return result
  if (!result[currentIndex - columnsNumber]) return result
  if ((currentIndex + 1) % columnsNumber !== 0) return result

  const lastIndex = result.length

  const lastLineShortToLong = result
    .slice(lastIndex - columnsNumber, lastIndex)
    .sort((a, b) => a.size.height - b.size.height)

  const previousLine = result.slice(lastIndex - columnsNumber * 2, lastIndex - columnsNumber)

  /*Acquire previous line photos bottom edge, then sorting base on the bottom edges values,
   then adding the longest next photo for the shortest bottom edge
   */
  const sortedPhotos = previousLine
    .map((photo, index) => {
      return {
        length: photo.size.height + photo.position.y,
        index,
      }
    })
    .sort((a, b) => a.length - b.length)
    .map((lineLength) => {
      return {
        ...lineLength,
        photo: lastLineShortToLong.pop()!,
      }
    })
    .sort((a, b) => a.index - b.index)

  for (let sortedPhoto of sortedPhotos) {
    const newIndex = result.length - columnsNumber + sortedPhoto.index
    const { photo } = sortedPhoto
    result[newIndex] = photo

    //because we changed the position of the photos we need to set new y and x values
    photo.position.y = getYPosition(result, columnsNumber, newIndex)
    photo.position.x = getXPosition(result, columnsNumber, newIndex, photo.size.width)
  }
  return result
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
  const photosWithSizeAndPosition = photos.reduce<PhotoToRenderType[]>((result, photo, index) => {
    const photoWidth = columnsNumber === 1 ? smallScreenWidth : DEFAULT_PHOTO_WIDTH
    const scaleRatio = photo.width / photoWidth
    const adjustedHeight = Math.floor(photo.height / scaleRatio)

    const x = getXPosition(result, columnsNumber, index, photoWidth)
    const y = getYPosition(result, columnsNumber, index)

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

    /*The nature of masonry grid with random photos' heights leads to a situation when some columns could be much longer than others
    to fix it I reorder photos in lines for the shortest line get the next longest photo
     */
    return reorderLastLineToEqualizeLastLine(result, columnsNumber, index)
  }, [])

  return { photosWithSizeAndPosition }
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

    const { photosWithSizeAndPosition } = buildPhotosToRender({
      photos,
      columnsNumber,
      smallScreenWidth,
    })

    const containerHeight = Math.max(
      ...photosWithSizeAndPosition
        .slice(
          photosWithSizeAndPosition.length - columnsNumber - 1,
          photosWithSizeAndPosition.length,
        )
        .map((photo) => photo.size.height + photo.position.y),
    )

    return {
      photosWithSizeAndPosition,
      containerHeight: containerHeight,
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
