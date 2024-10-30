import { useEffect } from 'react'

export default function PreloadImages({ photoUrlsToPreload }: { photoUrlsToPreload: string[] }) {
  useEffect(() => {
    const preloadingImages = photoUrlsToPreload.map((url) => {
      const image = new Image()
      image.src = url
      return image
    })
    return () => {
      preloadingImages.forEach((image) => {
        image.src = ''
      })
    }
  }, [photoUrlsToPreload])
  return null
}
