import { PhotoSizeEnum, PhotoToRenderType } from '../PhotoType'
import styles from './MasonryGridView.module.css'
import { UIEvent } from 'react'
import MasonryImage from './MasonryImage'

export default function MasondryGridView({
  photos,
  containerHeight,
  containerWidth,
  onScroll,
}: {
  photos: PhotoToRenderType[]
  containerHeight: number
  containerWidth: number
  onScroll: (event: UIEvent<HTMLElement>) => void
}) {
  return (
    <div className={styles.containerWithScroll} onScroll={onScroll}>
      <div
        style={{ height: containerHeight, width: containerWidth }}
        className={styles.gridContainer}
      >
        {photos.map((photo) => {
          if (photo.hidden) return null

          return <MasonryImage {...photo} key={photo.id} />
        })}
      </div>
    </div>
  )
}
