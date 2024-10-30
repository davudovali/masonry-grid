import { PhotoSizeEnum, PhotoToRenderType } from '../PhotoType'
import styles from './MasonryGridView.module.css'
import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Spin } from 'antd'

function MasonryImage({ photo }: { photo: PhotoToRenderType }) {
  const [loaded, setLoaded] = useState(false)
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
          onLoad={() => setLoaded(true)}
          style={{
            width: photo.size.width,
            height: photo.size.height,
          }}
        />
      </Link>
      {!loaded && <Spin className={styles.spinner} />}
    </div>
  )
}

export default memo(MasonryImage)
