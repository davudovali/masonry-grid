import { PhotoSizeEnum, PhotoToRenderType } from '../PhotoType'
import styles from './MasonryGridView.module.css'
import { memo } from 'react'

function MasonryImage(photo: PhotoToRenderType) {
  return (
    <div
      className={styles.imageContainer}
      style={{
        width: photo.size.width,
        height: photo.size.height,
        top: photo.position.y,
        left: photo.position.x,
      }}
    >
      <img
        src={photo?.src[PhotoSizeEnum.MEDIUM]}
        key={photo.id}
        alt={photo.alt}
        style={{
          width: photo.size.width,
          height: photo.size.height,
        }}
      />
      <span>{photo.index}</span>
    </div>
  )
}

export default memo(MasonryImage)
