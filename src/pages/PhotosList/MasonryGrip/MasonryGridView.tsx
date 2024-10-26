import {PhotoSizeEnum, PhotoWithPosition} from "../PhotoType";
import styles from './MasonryGridView.module.css'
import {UIEvent} from "react";

export default function MasondryGridView({photos, containerHeight, containerWidth, onScroll}: {photos: PhotoWithPosition[], containerHeight: number, containerWidth: number, onScroll: (event: UIEvent<HTMLElement>) => void}) {
  return <div className={styles.containerWithScroll} onScroll={onScroll}>
    <div style={{height: containerHeight, width: containerWidth}} className={styles.gridContainer}>
    {photos.map((photo) => {
     if (photo.hidden) return null
     return <img
      style={{
        width: photo.size.width,
        height: photo.size.height,
        position: 'absolute',
        top: photo.position.y,
        left: photo.position.x
      }}
      src={photo?.src[PhotoSizeEnum.MEDIUM]}
      key={photo.id}/>})}
  </div>
  </div>

}