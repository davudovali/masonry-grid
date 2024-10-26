import pexelApiClient from "../../tools/pexelApiClient";
import {useQuery} from "react-query";
import {PhotoType} from "./PhotoType";
import MasonryGridController from "./MasonryGrip/MasonryGridController";



const retrievePhotos = async (): Promise<{photos: PhotoType[], page: number, per_page: number, total_result: number}> => {
  const response = await pexelApiClient.get(
    "https://api.pexels.com/v1/curated?page=1&per_page=200",
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


  return <MasonryGridController photos={data?.photos} isLoading={isLoading} isSuccess={isSuccess} />
}