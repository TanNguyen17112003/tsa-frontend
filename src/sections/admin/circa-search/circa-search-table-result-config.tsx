import { FaRegEdit } from "react-icons/fa";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { SutraDetail } from "src/types/sutra";

const getCircaSearchResultTableConfig = ({
  onClickEdit,
  getAuthor,
  getTranslator,
}: {
  onClickEdit: (data: SutraDetail) => void;
  getAuthor: (id: string) => string;
  getTranslator: (id: string) => string;
}): CustomTableConfig<SutraDetail["id"], SutraDetail>[] => [
  {
    key: "name",
    headerLabel: "Tên bộ kinh",
    type: "string",
  },
  {
    key: "code",
    headerLabel: "Mã bộ kinh",
    type: "string",
  },
  {
    key: "original_text",
    headerLabel: "Văn bản gốc",
    type: "string",
    renderCell: (data) => (
      <div>
        {data.original_text ? (
          <div className="border border-green-300 w-fit px-2 py-0.5 rounded-lg text-green-700 bg-green-50">
            Đã có
          </div>
        ) : (
          <div className="border border-rose-200 w-fit px-1 py-0.5 rounded-lg text-rose-700 bg-rose-50">
            Chưa có
          </div>
        )}
      </div>
    ),
  },
  {
    key: "num_orisons",
    headerLabel: "Số lượng bài kinh",
    type: "number",
  },
  {
    key: "author.author",
    headerLabel: "Tác giả",
    type: "string",
    renderCell: (data) => <div>{getAuthor(data.author_id)}</div>,
  },
  {
    key: "translator.full_name",
    headerLabel: "Dịch giả",
    type: "string",
    renderCell: (data) => <div>{getTranslator(data.user_id)}</div>,
  },
  {
    key: "circa",
    headerLabel: "Niên đại",
    type: "string",
    renderCell: (data) => (
      <div>
        {data.circa.start_year} TCN - {data.circa.end_year} TCN
      </div>
    ),
  },
  {
    key: "edit",
    headerLabel: "Chỉnh sửa",
    type: "string",
    renderCell: (data) => (
      <div>
        <Button className="text-cyan-600" variant="link">
          <FaRegEdit
            onClick={() => onClickEdit(data)}
            style={{
              fontSize: "1.1rem",
            }}
          />
        </Button>
      </div>
    ),
  },
];

export default getCircaSearchResultTableConfig;
