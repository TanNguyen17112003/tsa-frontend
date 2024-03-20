import { FaRegEdit } from "react-icons/fa";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Orison } from "src/types/orison";
import { Sutra } from "src/types/sutra";

const getAuthorSearchResultTableConfig = ({
  onClickEdit,
  getAuthor,
  getTranslator,
  getVolume,
  getCirca,
}: {
  onClickEdit: (data: Sutra) => void;
  getVolume: (id: string) => string;
  getAuthor: (id: string) => string;
  getTranslator: (id: string) => string;
  getCirca: (id: string) => string;
}): CustomTableConfig<Orison["id"], any>[] => [
  {
    key: "name",
    headerLabel: "Tên bài kinh",
    type: "string",
  },
  {
    key: "volume",
    headerLabel: "Mã quyển kinh",
    type: "string",
    renderCell: (data) => <div>{getVolume(data.volume_id)}</div>,
  },
  {
    key: "author",
    headerLabel: "Tác giả",
    type: "string",
    renderCell: (data) => <div>{getAuthor(data.volume_id)}</div>,
  },
  {
    key: "translator",
    headerLabel: "Dịch giả",
    type: "string",
    renderCell: (data) => <div>{getTranslator(data.volume_id)}</div>,
  },
  {
    key: "circa",
    headerLabel: "Niên đại",
    type: "string",
    renderCell: (data) => <div>{getCirca(data.volume_id)}</div>,
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
