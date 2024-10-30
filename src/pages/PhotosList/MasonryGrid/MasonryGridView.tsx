import { PhotoToRenderType } from '../PhotoType'
import styles from './MasonryGridView.module.css'
import { UIEvent } from 'react'
import MasonryImage from './MasonryImage'
import MoreButton from '../MoreButton/MoreButton'

const BOTTOM_MARGIN = 40

export default function MasonryGridView({
  photos,
  containerHeight,
  containerWidth,
  onScroll,
  onClickMore,
  isLoading,
}: {
  photos: PhotoToRenderType[]
  containerHeight: number
  containerWidth: number | string
  onScroll: (event: UIEvent<HTMLElement>) => void
  onClickMore: () => void
  isLoading: boolean
}) {
  return (
    <div className={styles.containerWithScroll} onScroll={onScroll}>
      <div
        style={{ height: containerHeight + BOTTOM_MARGIN, width: containerWidth }}
        className={styles.gridContainer}
      >
        {photos.map((photo, index) => {
          if (photo.hidden) return null

          return <MasonryImage photo={photo} key={photo.id} />
        })}
        <MoreButton onClick={onClickMore} isLoading={isLoading} />
      </div>
    </div>
  )
}
