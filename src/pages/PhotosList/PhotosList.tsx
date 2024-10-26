import pexelApiClient from "../../tools/pexelApiClient";
import {useQuery} from "react-query";
import {useMemo} from "react";

const VERTICAL_GAP_PX = 8
const HORIZONTAL_GAP_PX = 8
const DEFAULT_PHOTO_WIDTH_PX = 200

enum PhotoSizeEnum  {
  ORIGINAL = "original",
  LARGE_2_X = "large2x",
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
  TINY = "tiny",
}

type PhotoType = {
  id: number,
  width: number,
  height: number,
  url: string,
  "photographer": string,
  "photographer_url": string,
  "photographer_id": string,
  "avg_color": string,
  "src": Record<PhotoSizeEnum, string>
  "alt": string
}

type PhotoWithPosition = PhotoType & {
  size: {
    width: number
    height: number
  },
  position: {
    x: number,
    y: number,
  }
}

function usePhotosPositionCalculation(photos?: PhotoType[]): PhotoWithPosition[] {

  return useMemo(() => {
    if (!photos || !photos.length) return []
    const {width} = document.getElementById('root')?.getBoundingClientRect() || {width: 1200}
    const availableColumnsNumber = Math.floor(width / (DEFAULT_PHOTO_WIDTH_PX + HORIZONTAL_GAP_PX))

    return photos.reduce<PhotoWithPosition[]>((result, photo, index) => {
      const scaleRatio = photo.width / 200
      const x = index % availableColumnsNumber === 0 ? 0 : result[index - 1].position.x + HORIZONTAL_GAP_PX + DEFAULT_PHOTO_WIDTH_PX
      const y = index < availableColumnsNumber ? 0 : result[index - availableColumnsNumber].position.y + VERTICAL_GAP_PX + result[index - availableColumnsNumber].size.height

      result.push({
        ...photo,
          size: {
            width: 200,
            height: photo.height / scaleRatio,
          },
          position: {
            x,
            y,
          }
        })
        return result
    }, [])
  }, [photos]);
}

const retrievePhotos = async (): Promise<{photos: PhotoType[], page: number, per_page: number, total_result: number}> => {
  const response = await pexelApiClient.get(
    "https://api.pexels.com/v1/curated?page=1&per_page=1000",
  );
  return response.data;
};

export default function PhotosList() {

  const {
    data,
    isSuccess,
    isLoading,
  } = useQuery("photosData", retrievePhotos, {
    keepPreviousData: true
  })

  const photos = usePhotosPositionCalculation(data?.photos)


  return <div>
    {isSuccess && photos.map((photo) => <img
      style={{width: photo.size.width, height: photo.size.height, position: 'absolute', top: photo.position.y, left: photo.position.x}}
      src={photo?.src[PhotoSizeEnum.SMALL]}
      key={photo.id}/>)}
    {isLoading && <div>Loading...</div>}

  </div>
}