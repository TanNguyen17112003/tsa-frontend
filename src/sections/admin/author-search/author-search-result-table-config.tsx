import { FaRegEdit } from "react-icons/fa";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { SutraDetail } from "src/types/sutra";

const getAuthorSearchResultTableConfig = ({
  onClickEdit,
}: {
  onClickEdit: (data: SutraDetail) => void;
}): CustomTableConfig<SutraDetail["id"], SutraDetail>[] => [
  {
    key: "name",
    headerLabel: "Tên bộ kinh",
    type: "string",
  },
  {
    key: "volumes.name",
    headerLabel: "Mã quyển kinh",
    type: "string",
  },
  {
    key: "author.author",
    headerLabel: "Tác giả",
    type: "string",
  },
  {
    key: "translator.full_name",
    headerLabel: "Dịch giả",
    type: "string",
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
