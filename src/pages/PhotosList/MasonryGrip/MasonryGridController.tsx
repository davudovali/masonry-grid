import { PhotoType, PhotoToRenderType } from '../PhotoType'
import { useMemo, useState, useCallback, UIEvent, useEffect } from 'react'
import MasonryGridView from './MasonryGridView'
import MasonryLoadingView from './MasonryLoadingView'

const VERTICAL_GAP_PX = 8
const HORIZONTAL_GAP_PX = 8
const DEFAULT_PHOTO_WIDTH_PX = 200
const SCROLL_BUFFER = 100

function buildPhotosToRender({
  photos,
  visibleHeight,
  columnsNumber,
  scrollPosition,
}: {
  photos: PhotoType[]
  columnsNumber: number
  scrollPosition: number
  visibleHeight: number
}) {
  let containerHeight = 0

  const photosToRender = photos.reduce<PhotoToRenderType[]>((result, photo, index) => {
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

    let hidden = false

    if (y + adjustedHeight + SCROLL_BUFFER < scrollPosition) hidden = true
    if (y - SCROLL_BUFFER > scrollPosition + visibleHeight) hidden = true

    const photoToRender = {
      ...photo,
      index,
      hidden,
      size: {
        width: DEFAULT_PHOTO_WIDTH_PX,
        height: adjustedHeight,
      },
      position: {
        x,
        y,
      },
    }

    result.push(photoToRender)
    return result
  }, [])
  return { photosToRender, containerHeight }
}

function usePhotosPositionCalculation(photos?: PhotoType[]) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const [maxColumnsNumber, setMaxColumnsNumber] = useState<number>(() => {
    const width = document.getElementById('root')?.getBoundingClientRect()?.width || 0
    return Math.floor(width / (DEFAULT_PHOTO_WIDTH_PX + HORIZONTAL_GAP_PX))
  })

  const [selectedColumnsNumber, setSelectedColumnsNumber] = useState<number | null>(null)

  const columnsNumber =
    selectedColumnsNumber && selectedColumnsNumber <= maxColumnsNumber
      ? selectedColumnsNumber
      : maxColumnsNumber

  const { photosToRender, containerHeight, containerWidth } = useMemo(() => {
    if (!photos || !photos.length)
      return { photosToRender: [], containerHeight: 0, containerWidth: 0 }

    const { photosToRender, containerHeight } = buildPhotosToRender({
      photos,
      scrollPosition,
      columnsNumber,
      visibleHeight: document.getElementById('root')?.getBoundingClientRect()?.height || 0,
    })

    return {
      photosToRender,
      containerHeight,
      containerWidth:
        columnsNumber * (DEFAULT_PHOTO_WIDTH_PX + HORIZONTAL_GAP_PX) - HORIZONTAL_GAP_PX,
    }
  }, [photos, scrollPosition, columnsNumber])

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

  const onScroll = useCallback((event: UIEvent<HTMLElement>) => {
    setScrollPosition(event.currentTarget.scrollTop)
  }, [])

  return { photosToRender, containerHeight, containerWidth, onScroll, columnsNumber }
}

export default function MasonryGridController({
  photos,
  isLoading,
  isSuccess,
}: {
  photos?: PhotoType[]
  isLoading: boolean
  isSuccess: boolean
}) {
  const { photosToRender, containerHeight, containerWidth, onScroll } =
    usePhotosPositionCalculation(photos)

  if (!photos) return <MasonryLoadingView />

  return (
    <MasonryGridView
      photos={photosToRender}
      containerHeight={containerHeight}
      containerWidth={containerWidth}
      onScroll={onScroll}
    />
  )
}
