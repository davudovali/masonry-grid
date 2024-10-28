import { PhotoSizeEnum, PhotoToRenderType } from '../PhotoType'
import styles from './MasonryGridView.module.css'
import { UIEvent } from 'react'
import MasonryImage from './MasonryImage'
import MoreButton from '../MoreButton/MoreButton'

export default function MasondryGridView({
  photos,
  containerHeight,
  containerWidth,
  onScroll,
  onClickMore,
}: {
  photos: PhotoToRenderType[]
  containerHeight: number
  containerWidth: number
  onScroll: (event: UIEvent<HTMLElement>) => void
  onClickMore: () => void
}) {
  return (
    <div className={styles.containerWithScroll} onScroll={onScroll}>
      <div
        style={{ height: Math.floor(containerHeight), width: containerWidth }}
        className={styles.gridContainer}
      >
        {photos.map((photo) => {
          if (photo.hidden) return null

          return <MasonryImage {...photo} key={photo.id} />
        })}
        <MoreButton onClick={onClickMore} />
      </div>
    </div>
  )
}
