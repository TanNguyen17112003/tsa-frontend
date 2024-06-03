// Create a utility function to generate the path based on id of an orison
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
import { useMemo } from "react";
export const useOrisonPath = (orisonId: string) => {

  const { getOrisonsApi } = useOrisonsContext();
  const { getSutrasApi } = useSutrasContext();
  const { getVolumesApi } = useVolumesContext();
  const volumeId = useMemo(() => {
    return getOrisonsApi.data?.find((orison) => orison.id == orisonId)?.volume_id;
  }, [getOrisonsApi.data, orisonId]);
  const sutraId = useMemo(() => {
    return getVolumesApi.data?.find((volume) => volume.id == volumeId)?.sutras_id;
  }, [getVolumesApi.data, volumeId]);
  const collectionId = useMemo(() => {
    return getSutrasApi.data?.find((sutra) => sutra.id == sutraId)?.collection_id;
  }, [getSutrasApi.data, sutraId]);
  return {
    orisonId,
    volumeId,
    sutraId,
    collectionId
  };
}
