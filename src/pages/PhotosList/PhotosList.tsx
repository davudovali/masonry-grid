import pexelApiClient from "../../tools/pexelApiClient";
import {useQuery} from "react-query";

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


  return <div>
    {isSuccess && data.photos.map((photo) => <img style={{width: 200}} src={photo?.src[PhotoSizeEnum.SMALL]} key={photo.id}/>)}
    {isLoading && <div>Loading...</div>}

  </div>
}