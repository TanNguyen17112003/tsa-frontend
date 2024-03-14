import { FaRegEdit } from "react-icons/fa";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Sutra } from "src/types/sutra";

const getCircaSearchResultTableConfig = ({
  onClickEdit,
}: {
  onClickEdit: (data: any) => void;
}): CustomTableConfig<Sutra["id"], any>[] => [
  {
    key: "name",
    headerLabel: "Bộ kinh",
    type: "string",
  },
  {
    key: "code",
    headerLabel: "Mã bộ kinh",
    type: "string",
  },
  {
    key: "original_text",
    headerLabel: "Bộ kinh",
    type: "string",
  },
  {
    key: "sutra_number",
    headerLabel: "Số lượng bài kinh",
    type: "number",
  },
  {
    key: "author.name",
    headerLabel: "Tác giả",
    type: "string",
  },
  {
    key: "translator.name",
    headerLabel: "Dịch giả",
    type: "string",
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
