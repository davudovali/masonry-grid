import { PhotoType } from '../PhotoType'
import { useState, useEffect } from 'react'
import MasonryGridView from './MasonryGridView'
import MasonryLoadingView from './MasonryLoadingView'
import {
  useMasonryGrid,
  getWindowViewWidth,
  DEFAULT_PHOTO_WIDTH,
  HORIZONTAL_GAP,
  SMALL_SCREEN_PADDINGS,
} from './useMasonryGrid'

const SMALL_SCREEN_WIDTH_TREESCHOLD = 420

function getColumnNumber() {
  const width = getWindowViewWidth()
  if (width <= SMALL_SCREEN_WIDTH_TREESCHOLD) return 1
  return Math.floor(width / (DEFAULT_PHOTO_WIDTH + HORIZONTAL_GAP))
}

function useColumnsNumber() {
  const [columnsNumber, setColumnsNumber] = useState<number>(getColumnNumber)

  useEffect(() => {
    const onResize = () => {
      const newColumnsNumber = getColumnNumber()
      if (newColumnsNumber !== columnsNumber) setColumnsNumber(newColumnsNumber)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [columnsNumber])

  return { columnsNumber }
}

function useSmallScreenWidth(columnsNumber: number) {
  const [tempWidth, setTempWidth] = useState<number>(SMALL_SCREEN_WIDTH_TREESCHOLD)
  const [width, setWidth] = useState<number>(SMALL_SCREEN_WIDTH_TREESCHOLD)
  useEffect(() => {
    if (columnsNumber > 1) return
    const onResize = () => {
      setTempWidth(getWindowViewWidth())
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [columnsNumber])

  useEffect(() => {
    const timer = setTimeout(() => setWidth(tempWidth - SMALL_SCREEN_PADDINGS), 300)
    return () => clearTimeout(timer)
  }, [tempWidth])
  return { smallScreenWidth: width }
}

export default function MasonryGridController({
  photos,
  onClickMore,
}: {
  photos?: PhotoType[]
  onClickMore: () => void
}) {
  const { columnsNumber } = useColumnsNumber()
  const { smallScreenWidth } = useSmallScreenWidth(columnsNumber)

  const { photosToRender, containerHeight, containerWidth, onScroll } = useMasonryGrid({
    photos,
    columnsNumber,
    smallScreenWidth,
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
