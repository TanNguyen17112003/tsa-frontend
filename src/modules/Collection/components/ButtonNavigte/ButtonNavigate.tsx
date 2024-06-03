import { Button } from "src/components/shadcn/ui/button"
import { HiMiniArrowSmallRight } from "react-icons/hi2"
import { Report } from "src/types/report"
import { useOrisonsContext } from "src/contexts/orisons/orisons-context"
import { useVolumesContext } from "src/contexts/volumes/volumes-context"
import { useSutrasContext } from "src/contexts/sutras/sutras-context"
import { useRouter } from "next/router";
import { paths } from "src/paths"
interface ButtonNavigateProps {
  data?: Report;
  isHidden: boolean
}



const ButtonNavigate = ({ data, isHidden }: ButtonNavigateProps) => {
  const { getOrisonsApi } = useOrisonsContext();
  const { getVolumesApi } = useVolumesContext();
  const { getSutrasApi } = useSutrasContext();
  const router = useRouter();
  const handleNavigate = (data: Report) => {
    const reportId = data.id;
    const orisonId = data.orison_id;
    const volumeId = (getOrisonsApi?.data || []).find((orison) => orison.id === orisonId)?.volume_id;
    const sutraId = (getVolumesApi?.data || []).find((volume) => volume.id === volumeId)?.sutras_id;
    const collectionId = (getSutrasApi?.data || []).find((sutra) => sutra.id === sutraId)?.collection_id;
    router.push({
      pathname: paths.dashboard.collections,
      query: { reportId: reportId, orisonId: orisonId, volumeId: volumeId, sutraId: sutraId, collectionId: collectionId }
    })
  }
  return (
    <Button 
      className={`${isHidden ? 'invisible' : 'visible'}`}
      onClick={data ? () => handleNavigate(data) : () => {}}
      type="submit"
    >
    Đến trang xử lý{" "}
    <HiMiniArrowSmallRight
      style={{
        fontSize: "1.4em",
        marginLeft: "5px",
        marginTop: "2px",
      }}
    />
  </Button>
 
  )
 
}

export default ButtonNavigate