import {PhotoType, PhotoWithPosition} from "../PhotoType";
import {useMemo, useRef, useState, useCallback, UIEvent} from "react";
import MasonryGridView from "./MasonryGridView";
import MasonryLoadingView from "./MasonryLoadingView";

const VERTICAL_GAP_PX = 8
const HORIZONTAL_GAP_PX = 8
const DEFAULT_PHOTO_WIDTH_PX = 200

function usePhotosPositionCalculation(photos?: PhotoType[]) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const result = useMemo(() => {
    let containerHeight = 0

    if (!photos || !photos.length) return {photosWithPosition: [], containerHeight, containerWidth: 0}

    const {width, height} = document.getElementById('root')?.getBoundingClientRect() || {width: 1200, height: 980}
    const availableColumnsNumber = Math.floor(width / (DEFAULT_PHOTO_WIDTH_PX + HORIZONTAL_GAP_PX))

    const photosWithPosition = photos.reduce<PhotoWithPosition[]>((result, photo, index) => {
      const scaleRatio = photo.width / 200
      const adjustedHeight = photo.height / scaleRatio
      const x = index % availableColumnsNumber === 0 ? 0 : result[index - 1].position.x + HORIZONTAL_GAP_PX + DEFAULT_PHOTO_WIDTH_PX
      const y = index < availableColumnsNumber ? 0 : result[index - availableColumnsNumber].position.y + VERTICAL_GAP_PX + result[index - availableColumnsNumber].size.height

      if (y + adjustedHeight > containerHeight) containerHeight = y + adjustedHeight
      let hidden = false

      if (y + adjustedHeight < scrollPosition) hidden = true
      if (y > scrollPosition + height) hidden = true


      result.push({
        ...photo,
        hidden,
        size: {
          width: 200,
          height: adjustedHeight,
        },
        position: {
          x,
          y,
        }
      })
      return result
    }, [])

    return {photosWithPosition, containerHeight, containerWidth: availableColumnsNumber * (DEFAULT_PHOTO_WIDTH_PX + HORIZONTAL_GAP_PX) - HORIZONTAL_GAP_PX}

  }, [photos, scrollPosition]);

  const onScroll = useCallback((event: UIEvent<HTMLElement>) => {
    setScrollPosition(event.currentTarget.scrollTop)
  }, [])

  return {...result, onScroll}
}


export default function MasonryGridController({photos, isLoading, isSuccess}: {photos?: PhotoType[], isLoading: boolean, isSuccess: boolean}) {

  const {photosWithPosition ,containerHeight, containerWidth, onScroll} = usePhotosPositionCalculation(photos)

  if (!photos) return <MasonryLoadingView/>

  return <MasonryGridView
    photos={photosWithPosition}
    containerHeight={containerHeight}
    containerWidth={containerWidth}
    onScroll={onScroll}
  />
}