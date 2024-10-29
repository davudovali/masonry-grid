import pexelApiClient from '../../tools/pexelApiClient'
import { useQuery } from 'react-query'
import { PhotoType } from '../PhotosList/PhotoType'
import Header from '../../components/Header/Header'
import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { Button, Flex } from 'antd'

const retrievePhoto = async (id: string): Promise<PhotoType> => {
  const response = await pexelApiClient.get(`https://api.pexels.com/v1/photos/${id}`)
  return response.data
}

export default function PhotosList() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: photo, isSuccess } = useQuery(['photoData', id], () => retrievePhoto(id!))

  const onGoBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }, [])
  return (
    <div>
      <Header>
        <div>
          <Flex justify='start' align='center'>
            <Button onClick={onGoBack}>Go Back</Button>
          </Flex>
        </div>
      </Header>
      <main>
        {isSuccess && photo && (
          <picture>
            <source srcSet={photo.src.medium} media='(max-width: 600px)' />
            <source srcSet={photo.src.large} media='(max-width: 1200px)' />
            <source srcSet={photo.src.large2x} media='(min-width: 1201px)' />
            <img srcSet={photo.url} alt={photo.alt} />
          </picture>
        )}
      </main>
    </div>
  )
}
