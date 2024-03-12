import Pagination from "src/components/ui/Pagination";
import { SIDE_NAV_WIDTH } from "src/config";

const getPaginationText = (pagination: any): string => {
  return `
          Đang hiển thị kết quả thứ${" "} ${
    pagination.page * pagination.rowsPerPage + 1
  } tới${" "}
          ${Math.min(
            pagination.count,
            pagination.rowsPerPage * (pagination.page + 1)
          )}${" "}
          trên ${pagination.count} kết quả
  `;
};

export default getPaginationText;
