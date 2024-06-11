import { RectangleGroupIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import { BookshelfFillIcon } from "src/components/icons/BookshelfFillIcon";
import { IoPersonCircleOutline, IoFlag } from "react-icons/io5";
import { paths } from "src/paths";
import { FilesEarmarkFillIcon } from "src/components/icons/FilesEarmarkFillIcon";
import { BsDoorOpen } from "react-icons/bs";

export const getDashboardAdminConfigs = () => {
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
          title: "Quản lý tài khoản",
          path: paths.dashboard.accounts,
          icon: <IoPersonCircleOutline className="h-6 w-6" />,
        },
        {
          title: "Quản lý danh mục",
          path: paths.dashboard.categories,
          icon: <FilesEarmarkFillIcon className="h-6 w-6" />,
        },
        {
          title: "Quản lý khiếu nại",
          path: paths.dashboard.reports,
          icon: <IoFlag className="h-6 w-6" />,
        },
        {
          title: "Đăng xuất",
          path: paths.dashboard.logout,
          icon: <BsDoorOpen className="h-6 w-6" />,
        },
      ],
    },
  ];
};
