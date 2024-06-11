import { UsePaginationResult } from "src/hooks/use-pagination";

const getPaginationText = (pagination: UsePaginationResult): string => {
  return `
          Đang hiển thị kết quả thứ${" "} ${
    pagination.page * pagination.rowsPerPage + (pagination.count > 0 ? 1 : 0)
  } tới${" "}
          ${Math.min(
            pagination.count,
            pagination.rowsPerPage * (pagination.page + 1)
          )}${" "}
          trên ${pagination.count} kết quả
  `;
};

export default getPaginationText;
