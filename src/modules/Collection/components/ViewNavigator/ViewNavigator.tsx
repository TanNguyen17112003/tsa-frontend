import { useRouter } from "next/router";
import { useCallback, type FC } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import viewTypes from "../../constants/viewTypes";

interface ViewNavigatorProps {}

const ViewNavigator: FC<ViewNavigatorProps> = ({}) => {
  const router = useRouter();
  const currentViewType = router.query.viewType;

  const handleChange = useCallback(
    (value: string) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, viewType: value },
      });
    },
    [router]
  );

  return (
    <div>
      <div className="text-xs font-semibold mb-2">Xem theo</div>
      <CustomSelect
        onValueChange={handleChange}
        value={currentViewType ? currentViewType.toString() : "all"}
        options={viewTypes}
      />
    </div>
  );
};

export default ViewNavigator;
