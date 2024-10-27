import pexelApiClient from '../../tools/pexelApiClient'
import { useQuery } from 'react-query'
import { PhotoType } from './PhotoType'
import MasonryGridController from './MasonryGrid/MasonryGridController'
import MoreButton from './MoreButton/MoreButton'
import { useCallback, useState } from 'react'

const retrievePhotos = async (
  page: number,
): Promise<{
  photos: PhotoType[]
  page: number
  per_page: number
  total_result: number
}> => {
  const params = new URLSearchParams({ page: page.toString() })
  const response = await pexelApiClient.get(
    `https://api.pexels.com/v1/curated?per_page=80&${params.toString()}`,
  )
  return response.data
}

export default function PhotosList() {
  const [page, setPage] = useState(1)
  const [{ photos }, setPhotos] = useState<{
    photos: PhotoType[]
    usedIds: { [key: number]: boolean }
  }>({ photos: [], usedIds: {} })

  useQuery(['photosData', page], () => retrievePhotos(page), {
    keepPreviousData: true,
    onSuccess: (data) => {
      setPhotos(({ photos, usedIds }) => {
        //Pexel could repeat images on different pages, have to filter images from already used
        const newUsedIds = { ...usedIds }
        const filteredFromOldPhotos = data.photos.filter((x) => {
          if (newUsedIds[x.id]) {
            return false
          } else {
            newUsedIds[x.id] = true
          }
          return true
        })
        return { photos: [...photos, ...filteredFromOldPhotos], usedIds: newUsedIds }
      })
    },
  })

  const onMoreButtonClick = useCallback(() => {
    setPage((oldValue) => oldValue + 1)
  }, [])

  return (
    <main>
      <MasonryGridController photos={photos} />
      <MoreButton onClick={onMoreButtonClick} />
    </main>
  )
}
