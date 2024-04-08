import { useRouter } from "next/router";
import { useMemo, type FC, useCallback } from "react";
import Pagination from "src/components/ui/Pagination";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";

interface OrisonPaginationProps {}

const OrisonPagination: FC<OrisonPaginationProps> = ({}) => {
  const router = useRouter();

  const { orisonId, getOrisonsApi } = useOrisonsContext();

  const currentIndex = useMemo(() => {
    return (
      getOrisonsApi.data?.findIndex((orison) => orison.id == orisonId) || 0
    );
  }, [getOrisonsApi.data, orisonId]);

  const handleChange = useCallback(
    (event: any, page: number) => {
      const orison = getOrisonsApi.data?.[page];
      if (orison) {
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, orisonId: orison.id },
        });
      }
    },
    [getOrisonsApi.data, router]
  );

  return (
    <Pagination
      page={currentIndex}
      count={getOrisonsApi.data?.length || 0}
      rowsPerPage={1}
      length={2}
      onChange={handleChange}
    />
  );
};

export default OrisonPagination;
