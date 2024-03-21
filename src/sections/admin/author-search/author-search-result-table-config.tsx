import { FaRegEdit } from "react-icons/fa";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { SutraDetail } from "src/types/sutra";

const getAuthorSearchResultTableConfig = ({
  onClickEdit,
  getAuthor,
  getTranslator,
  getVolume,
}: {
  onClickEdit: (data: SutraDetail) => void;
  getAuthor: (id: string) => string;
  getTranslator: (id: string) => string;
  getVolume: (id: string) => string;
}): CustomTableConfig<SutraDetail["id"], SutraDetail>[] => [
  {
    key: "name",
    headerLabel: "Tên bộ kinh",
    type: "string",
  },
  {
    key: "code",
    headerLabel: "Mã quyển kinh",
    type: "string",
    renderCell: (data) => <div>{getVolume(data.id)}</div>,
  },
  {
    key: "author",
    headerLabel: "Tác giả",
    type: "string",
    renderCell: (data) => <div>{getAuthor(data.author_id)}</div>,
  },
  {
    key: "translator",
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
        {data.circa.start_year + " TCN - " + data.circa.end_year + " TCN"}
      </div>
    ),
  },
  {
    key: "created_at",
    headerLabel: "Ngày tạo",
    type: "date",
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

export default getAuthorSearchResultTableConfig;
