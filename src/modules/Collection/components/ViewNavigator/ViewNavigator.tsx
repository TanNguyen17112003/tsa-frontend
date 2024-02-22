import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "src/components/shadcn/ui/select";
import { useCallback, type FC } from "react";
import { useRouter } from "next/router";
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
      <Select
        onValueChange={handleChange}
        value={currentViewType ? currentViewType.toString() : ""}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Tìm kiếm cơ bản" className="py-4" />
        </SelectTrigger>
        <SelectContent>
          {viewTypes.map((viewType) => (
            <SelectItem
              key={viewType.value}
              value={viewType.value}
              className="text-primary"
              color={viewType.value == currentViewType ? "primary" : "default"}
            >
              {viewType.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ViewNavigator;
