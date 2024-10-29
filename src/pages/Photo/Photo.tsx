import pexelApiClient from '../../tools/pexelApiClient'
import { useQuery } from 'react-query'
import { PhotoType } from '../PhotosList/PhotoType'
import Header from '../../components/Header/Header'
import { useParams, useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { Button, Flex, Spin } from 'antd'
import styles from './Photo.module.css'

const retrievePhoto = async (id: string): Promise<PhotoType> => {
  const response = await pexelApiClient.get(`https://api.pexels.com/v1/photos/${id}`)
  return response.data
}

export default function Photo() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: photo,
    isSuccess,
    isLoading,
  } = useQuery(['photoData', id], () => retrievePhoto(id!))

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
        <Flex justify='start' align='center' className={styles.backButtonContainer}>
          <Button onClick={onGoBack}>Go Back</Button>
        </Flex>
      </Header>
      <main className={styles.main}>
        {isLoading && <Spin size='large' className={styles.spinner} />}
        {isSuccess && photo && (
          <div className={styles.infoContainer}>
            <Flex justify='start' align='start' gap='32' vertical className={styles.titleAuthor}>
              <span>{photo.alt}</span>
              <span>{photo.photographer}</span>
            </Flex>

            <div className={styles.photoContainer}>
              <picture>
                <source srcSet={photo.src.medium} media='(max-width: 350px)' />
                <source srcSet={photo.src.large} media='(max-width: 1200px)' />
                <source srcSet={photo.src.large2x} media='(min-width: 1201px)' />
                <img srcSet={photo.url} alt={photo.alt} />
              </picture>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
