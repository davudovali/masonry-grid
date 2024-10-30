import pexelApiClient from '../../tools/pexelApiClient'
import { useQuery } from 'react-query'
import { PhotoType } from './PhotoType'
import MasonryGridController from './MasonryGrid/MasonryGridController'
import { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchInput from './SearchInput/SearchInput'

const retrievePhotos = async (
  page: number,
  search: string,
): Promise<{
  photos: PhotoType[]
  page: number
  per_page: number
  total_result: number
}> => {
  const params = new URLSearchParams({ page: page.toString(), query: search })
  const response = await pexelApiClient.get(
    search
      ? `https://api.pexels.com/v1/search?per_page=80&${params.toString()}`
      : `https://api.pexels.com/v1/curated?per_page=80&${params.toString()}`,
  )
  return response.data
}

export default function PhotosList() {
  const location = useLocation()
  const navigate = useNavigate()

  const [{ photos, search, page, photoUrlsToPreload }, setPhotos] = useState<{
    photos: PhotoType[]
    photoUrlsToPreload: string[]
    usedIds: { [key: number]: boolean }
    search: string
    oldSearch: string
    page: number
  }>(() => {
    const params = new URLSearchParams(location.search)

    return {
      photos: [],
      usedIds: {},
      photoUrlsToPreload: [],
      search: params.get('search') || '',
      oldSearch: params.get('search') || '',
      page: 1,
    }
  })

  const { data, isLoading } = useQuery(['photosData', page, search], () =>
    retrievePhotos(page, search),
  )

  useEffect(() => {
    if (!data) return

    setPhotos((oldValue) => {
      const isSearchChanged = oldValue.oldSearch !== search
      //Pexel could repeat images on different pages, have to filter images from already used
      const newUsedIds = isSearchChanged ? {} : { ...oldValue.usedIds }

      const filteredFromOldPhotos = data.photos.filter((x) => {
        if (newUsedIds[x.id]) {
          return false
        } else {
          newUsedIds[x.id] = true
        }
        return true
      })

      return {
        photos: isSearchChanged
          ? filteredFromOldPhotos
          : [...oldValue.photos, ...filteredFromOldPhotos],
        usedIds: newUsedIds,
        photoUrlsToPreload: filteredFromOldPhotos.map((photo) => photo.src.medium),
        search,
        oldSearch: search,
        page: oldValue.page,
      }
    })
    navigate(search ? `${location.pathname}?search=${search}` : location.pathname)
  }, [data?.photos])

  const handleClickMore = useCallback(() => {
    setPhotos((oldValue) => {
      return { ...oldValue, page: oldValue.page + 1 }
    })
  }, [])

  const handleSearch = useCallback((newSearch: string) => {
    setPhotos((oldValue) => {
      return {
        ...oldValue,
        page: 1,
        search: newSearch,
      }
    })
  }, [])

  return (
    <div>
      <Header>
        <SearchInput defaultValue={search} onChangeSearch={handleSearch} />
      </Header>
      <main>
        <MasonryGridController
          photos={photos}
          onClickMore={handleClickMore}
          photoUrlsToPreload={photoUrlsToPreload}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}
