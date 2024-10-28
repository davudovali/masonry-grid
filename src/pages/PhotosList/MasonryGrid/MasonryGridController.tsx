import { PhotoType, PhotoToRenderType } from '../PhotoType'
import { useMemo, useState, useCallback, UIEvent, useEffect, useRef } from 'react'
import MasonryGridView from './MasonryGridView'
import MasonryLoadingView from './MasonryLoadingView'

const VERTICAL_GAP_PX = 8
const HORIZONTAL_GAP_PX = 8
const DEFAULT_PHOTO_WIDTH_PX = 200
const SCROLL_BUFFER = 400

function useColumnsNumber() {
  const [maxColumnsNumber, setMaxColumnsNumber] = useState<number>(() => {
    const width = document.getElementById('root')?.getBoundingClientRect()?.width || 0
    return Math.floor(width / (DEFAULT_PHOTO_WIDTH_PX + HORIZONTAL_GAP_PX))
  })

  const [selectedColumnsNumber, setSelectedColumnsNumber] = useState<number | null>(null)

  const columnsNumber =
    selectedColumnsNumber && selectedColumnsNumber <= maxColumnsNumber
      ? selectedColumnsNumber
      : maxColumnsNumber

  useEffect(() => {
    const onResize = () => {
      const { width } = document.getElementById('root')?.getBoundingClientRect() || {
        width: 1200,
        height: 980,
      }
      const newMaxColumnsNumber = Math.floor(width / (DEFAULT_PHOTO_WIDTH_PX + HORIZONTAL_GAP_PX))
      if (newMaxColumnsNumber !== maxColumnsNumber) setMaxColumnsNumber(newMaxColumnsNumber)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [selectedColumnsNumber])

  return { columnsNumber, setSelectedColumnsNumber }
}

function buildPhotosToRender({
  photos,
  columnsNumber,
}: {
  photos: PhotoType[]
  columnsNumber: number
}) {
  let containerHeight = 0

  const photosWithSizeAndPosition = photos.reduce<PhotoToRenderType[]>((result, photo, index) => {
    const scaleRatio = photo.width / 200
    const adjustedHeight = photo.height / scaleRatio

    const leftNeighbor = result[index - 1]
    const topNeighbor = result[index - columnsNumber]
    const x =
      index % columnsNumber === 0
        ? 0
        : leftNeighbor.position.x + HORIZONTAL_GAP_PX + DEFAULT_PHOTO_WIDTH_PX
    const y =
      index < columnsNumber ? 0 : topNeighbor.position.y + VERTICAL_GAP_PX + topNeighbor.size.height

    if (y + adjustedHeight > containerHeight) containerHeight = y + adjustedHeight

    const photoWithSizeAndPosition = {
      ...photo,
      index,
      hidden: false,
      size: {
        width: DEFAULT_PHOTO_WIDTH_PX,
        height: adjustedHeight,
      },
      position: {
        x,
        y,
      },
    }

    result.push(photoWithSizeAndPosition)
    return result
  }, [])

  return { photosWithSizeAndPosition, containerHeight }
}

function useMasonryGrid({
  photos,
  columnsNumber,
}: {
  photos?: PhotoType[]
  columnsNumber: number
}) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const { photosWithSizeAndPosition, containerHeight, containerWidth } = useMemo(() => {
    if (!photos || !photos.length) {
      return { photosWithSizeAndPosition: [], containerHeight: 0, containerWidth: 0 }
    }

    const { photosWithSizeAndPosition, containerHeight } = buildPhotosToRender({
      photos,
      columnsNumber,
    })

    return {
      photosWithSizeAndPosition,
      containerHeight,
      containerWidth:
        columnsNumber * (DEFAULT_PHOTO_WIDTH_PX + HORIZONTAL_GAP_PX) - HORIZONTAL_GAP_PX,
    }
  }, [photos, columnsNumber])

  const photosToRender = useMemo(() => {
    const visibleHeight = document.getElementById('root')?.getBoundingClientRect()?.height || 0
    return photosWithSizeAndPosition?.map((photo) => {
      const y = photo.position.y
      const height = photo.size.height
      let hidden = false
      if (y + height + SCROLL_BUFFER < scrollPosition) hidden = true
      if (y - SCROLL_BUFFER > scrollPosition + visibleHeight) hidden = true
      photo.hidden = hidden
      return photo
    })
  }, [photosWithSizeAndPosition, scrollPosition])

  const onScroll = useCallback((event: UIEvent<HTMLElement>) => {
    setScrollPosition(event.currentTarget.scrollTop)
  }, [])

  return { photosToRender, containerHeight, containerWidth, onScroll, columnsNumber }
}

export default function MasonryGridController({
  photos,
  onClickMore,
}: {
  photos?: PhotoType[]
  onClickMore: () => void
}) {
  const { columnsNumber } = useColumnsNumber()

  const { photosToRender, containerHeight, containerWidth, onScroll } = useMasonryGrid({
    photos,
    columnsNumber,
  })

  if (!photos) return <MasonryLoadingView />

  return (
    <MasonryGridView
      photos={photosToRender}
      containerHeight={containerHeight}
      containerWidth={containerWidth}
      onScroll={onScroll}
      onClickMore={onClickMore}
    />
  )
}
