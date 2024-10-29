import { PhotoSizeEnum, PhotoToRenderType } from '../PhotoType'
import styles from './MasonryGridView.module.css'
import { memo } from 'react'
import { Link } from 'react-router-dom'

function MasonryImage({ photo, index }: { photo: PhotoToRenderType; index: number }) {
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
      <Link to={`/photo/${photo.id}`}>
        <img
          src={photo?.src[PhotoSizeEnum.MEDIUM]}
          key={photo.id}
          alt={photo.alt}
          style={{
            width: photo.size.width,
            height: photo.size.height,
          }}
        />
      </Link>
    </div>
  )
}

export default memo(MasonryImage)
