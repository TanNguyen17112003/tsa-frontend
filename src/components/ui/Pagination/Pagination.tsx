import { useMemo, type FC } from "react";
import { Button } from "../../shadcn/ui/button";
import _ from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface PaginationProps {
  page: number;
  count: number;
  rowsPerPage: number;
  onChange: (event: any, page: number) => void;
  length?: number;
}

const Pagination: FC<PaginationProps> = ({
  page,
  count,
  onChange,
  rowsPerPage,
  length = 1,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage) || 1;

  const buttonIndexes = useMemo(() => {
    let indexes: number[] = [0, 1, page, totalPages - 1, totalPages - 2];
    for (let i = 1; i <= length; i++) {
      indexes.push(...[page - i, page + i]);
    }
    for (let i = 0; i < indexes.length; i++) {
      indexes[i] = Math.min(Math.max(0, indexes[i]), totalPages - 1);
    }
    indexes = indexes.sort((a, b) => a - b);
    indexes = _.sortedUniq(indexes);
    const results: number[] = [];
    for (let i = 0; i < indexes.length; i++) {
      results.push(indexes[i]);
      if (i < indexes.length - 1) {
        if (indexes[i + 1] == indexes[i] + 2) {
          results.push(indexes[i] + 1);
        } else if (indexes[i + 1] > indexes[i] + 2) {
          results.push(Math.random() * -1);
        }
      }
    }
    return results;
  }, [length, page, totalPages]);

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
          onClick={index >= 0 ? (e) => onChange(e, index) : undefined}
          disabled={index == -1}
        >
          {index >= 0 ? index + 1 : "..."}
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
