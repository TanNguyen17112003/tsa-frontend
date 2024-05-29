import { useRouter } from "next/router";
import { CustomTable } from "src/components/custom-table";
import { useCallback, useEffect, useState } from "react";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import { OrisonDetail } from "src/types/orison";
import { useAuth } from "src/hooks/use-auth";
import { orisonTableConfigs } from "../../explore/OrisonExplorePage/orisonTableConfigs";
import { useSelection } from "src/hooks/use-selection";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
import { initialSutra } from "src/types/sutra";
import { CustomSearch } from "src/components/CustomSearch/CustomSearch";

function BasicSearchResult() {
    const router = useRouter();
    const { sutra } = useVolumesContext();
    const keyWordValue = router.query.keyWords?.toString();
    const { getOrisonsApi, getOrisonDetailApi } = useOrisonsContext();
    const [orisons, setOrisons] = useState<OrisonDetail[]>([]);

    const handleClickRow = useCallback(
        (rowId: string) => {
            const newQuery = { ...router.query };
            delete newQuery.searchType;
            delete newQuery.keyWords;
            newQuery.orisonId = rowId;

            router.replace({
                pathname: router.pathname,
                query: newQuery,
            });
        },
        [router]
    );
    function findLabel(plainText: string, keyword: string) {
      const regex = /\[\d+\][^\[]*/g;
      const matches = plainText.match(regex) || [];
      for (const match of matches) {
          if (match.includes(keyword)) {
              const label = match.match(/\[\d+\]/)[0];
              return label;
          }
      }
      return null;
  }
    useEffect(() => {
        const fetchOrisons = async () => {
            const orisons = await Promise.all(
                (getOrisonsApi.data || []).map(async (orison) => {
                    const response = await getOrisonDetailApi.call(orison.id);
                    const detailInfo = response.data?.plain_text;
                    const startLabel = findLabel(detailInfo as string, keyWordValue as string); 
                    const containsKeyword = detailInfo?.includes(
                        keyWordValue as string
                    );
                    return {
                        ...orison,
                        sutra: sutra || initialSutra,
                        containsKeyword,
                        startLabel
                    };
                })
            );
            setOrisons(orisons.filter((orison) => orison.containsKeyword));
        };

        fetchOrisons();
    }, [getOrisonsApi.data, sutra, keyWordValue]);

    const select = useSelection<OrisonDetail>(orisons);

    return (
        <>
            {/* <CustomTable
                loading={getOrisonsApi.loading}
                select={user?.role == "admin" ? select : undefined}
                rows={orisons}
                configs={orisonTableConfigs}
                onClickRow={handleClickRow}
                hidePagination
            /> */}
            {orisons.map((orison) => (
              <CustomSearch
                    name={orison.name}
                    author={orison.sutra.author.author}
                    translator={orison.sutra.translator.full_name}
                    highlight={keyWordValue as string}
                    onClick={() => handleClickRow(orison.id)}
                    startLabel={orison.startLabel as string}
                />
                
            ))}
        </>
    );
}

export default BasicSearchResult;
