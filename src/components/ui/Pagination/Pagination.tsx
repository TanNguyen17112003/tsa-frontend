import { useMemo, type FC } from "react";
import { Button } from "../../shadcn/ui/button";
import _ from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface PaginationProps {
  page: number;
  count: number;
  rowsPerPage: number;
  onChange: (event: any, page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  page,
  count,
  onChange,
  rowsPerPage,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage) || 1;

  const buttonIndexes = useMemo(() => {
    const indexes: number[] = [
      0,
      totalPages - 1,
      (page || 1) - 1,
      page,
      page < totalPages - 1 ? page + 1 : page,
    ];
    return _.sortedUniq(indexes.sort());
  }, [page, totalPages]);

  return (
    <div className="flex">
      <Button
        className="rounded-none rounded-tl-md rounded-bl-md"
        variant="outline"
        size="icon"
        disabled={page == 0}
        onClick={(e) => onChange(e, page > 0 ? page - 1 : page)}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </Button>
      {buttonIndexes.map((index) => (
        <Button
          className="rounded-none"
          variant={page == index ? undefined : "outline"}
          key={index}
          onClick={(e) => onChange(e, index)}
        >
          {index + 1}
        </Button>
      ))}
      <Button
        className="rounded-none rounded-tr-md rounded-br-md"
        variant="outline"
        size="icon"
        disabled={page == totalPages - 1}
        onClick={(e) => onChange(e, page < totalPages - 1 ? page + 1 : page)}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Pagination;
