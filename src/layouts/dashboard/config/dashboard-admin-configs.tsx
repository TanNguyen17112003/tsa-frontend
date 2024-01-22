import { PiScalesBold } from "react-icons/pi";
import { paths } from "src/paths";
import { RectangleGroupIcon } from "@heroicons/react/24/solid";

export const getDashboardAdminConfigs = () => {
  return [
    {
      items: [
        {
          title: "Trang chủ",
          path: paths.admin.index,
          icon: <RectangleGroupIcon className="h-6 w-6" />,
        },
        {
          title: "Cân đá",
          path: paths.admin.index,
          icon: <PiScalesBold size="20px" />,
        },
        {
          title: "Cân đá",
          path: paths.admin.index,
          icon: <PiScalesBold size="20px" />,
        },
      ],
    },
  ];
};
