import { CustomTableConfig } from "src/components/custom-table";
import { Sutra, SutraDetail } from "src/types/sutra";

export const sutraTableConfigs: CustomTableConfig<Sutra["id"], SutraDetail>[] =
  [
    {
      key: "name",
      headerLabel: "name",
      type: "string",
    },
    {
      key: "code",
      headerLabel: "code",
      type: "string",
    },
    {
      key: "original_text",
      headerLabel: "original_text",
      type: "string",
    },

    {
      key: "circa_id",
      headerLabel: "circa_id",
      type: "string",
    },
    {
      key: "author_id",
      headerLabel: "author_id",
      type: "string",
    },
    {
      key: "user_id",
      headerLabel: "user_id",
      type: "string",
    },
  ];
