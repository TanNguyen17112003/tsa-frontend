import { RectangleGroupIcon } from "@heroicons/react/24/solid";
import { IoFlag } from "react-icons/io5";
import { BookshelfFillIcon } from "src/components/icons/BookshelfFillIcon";
import { paths } from "src/paths";

export const getDashboardUserConfigs = () => {
  return [
    {
      items: [
        {
          title: "Trang chủ",
          path: paths.dashboard.index,
          icon: <RectangleGroupIcon className="h-6 w-6" />,
        },
        {
          title: "Kho dữ liệu",
          path: paths.dashboard.collections,
          icon: <BookshelfFillIcon className="h-6 w-6" />,
        },
        {
          title: "Khiếu nại",
          path: paths.dashboard["add-report"],
          icon: <IoFlag className="h-6 w-6" />,
        },
        // {
        //   title: "Đăng xuất",
        //   path: paths.dashboard.logout,
        //   icon: <BsDoorOpen className="h-6 w-6" />,
        // },
      ],
    },
  ];
};
