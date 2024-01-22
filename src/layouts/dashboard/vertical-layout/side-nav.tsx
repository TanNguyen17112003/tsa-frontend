import { FC } from "react";
import Link from "next/link";
import { useAuth } from "src/hooks/use-auth"; // Import your auth hook
import { usePathname } from "src/hooks/use-pathname";
import { paths } from "src/paths";
import { Section } from "../config/config";
import SimpleBar from "simplebar-react";
import { SideNavSection } from "./side-nav-section";
import { NavColor } from "src/types/settings";
import { SIDE_NAV_WIDTH } from "src/config";

interface SideNavProps {
  color?: NavColor;
  sections?: Section[];
}

export const SideNav: FC<SideNavProps> = (props) => {
  const { user } = useAuth();
  const { sections = [] } = props;
  const pathname = usePathname();

  return (
    <div
      className="fixed inset-0 z-50 h-screen bg-white rounded-[0px_24px_24px_0px] overflow-hidden border-r [border-right-style:solid] border-[color:var(--background-other-divider)] shadow-[6px_0px_18.4px_#0000000d]"
      style={{ width: SIDE_NAV_WIDTH }}
    >
      <div
        className="flex flex-col flex-shrink-0 w-full bg-gray-900 overflow-y-auto h-full"
        style={{
          backgroundColor: "var(--nav-bg)",
          color: "var(--nav-color)",
        }}
      >
        <SimpleBar className="flex-1">
          <div className="flex flex-col items-center pt-[32px] pb-[24px] px-[16px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-center gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-[4px] p-[16px] relative self-stretch w-full flex-[0_0_auto] bg-tailwindcss-colors-slate-50 rounded-[16px]">
                <img
                  className="relative w-[24px] h-[24px]"
                  alt="Header images"
                  src="https://c.animaapp.com/oTA7Mv2p/img/header-images-2-1@2x.png"
                />
                <p className="text-sm font-semibold">Viện nghiên cứu Châu Á</p>
              </div>
              <h1 className="text-xl font-semibold">
                Đại Chánh Tân Tu Đại Tạng Kinh
              </h1>
            </div>
          </div>

          <div className="h-full flex flex-col flex-1">
            <nav className="flex-grow space-y-2 px-2">
              {sections.map((section, index) => (
                <SideNavSection
                  items={section.items}
                  key={index}
                  pathname={pathname}
                  subheader={section.subheader}
                />
              ))}
            </nav>
          </div>
        </SimpleBar>
        <div className="sticky w-full bottom-0 p-2 cursor-pointer flex">
          <Link
            href={paths.admin.profile}
            className="sticky w-full bottom-0 p-2 cursor-pointer flex gap-[12px]"
          >
            <div className="relative w-[36px] h-[36px] bg-[url(https://c.animaapp.com/oTA7Mv2p/img/ellipse-1-1@2x.png)] bg-cover bg-[50%_50%]" />
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <div className="relative mt-[-1.00px] font-text-sm-semibold font-[number:var(--text-sm-semibold-font-weight)] text-[color:var(--text-text-primary)] text-[length:var(--text-sm-semibold-font-size)] tracking-[var(--text-sm-semibold-letter-spacing)] leading-[var(--text-sm-semibold-line-height)] [font-style:var(--text-sm-semibold-font-style)]">
                Quản trị viên
              </div>
              <div className="relative [font-family:'Inter',Helvetica] font-normal text-[color:var(--text-text-tetiary)] text-[12px] tracking-[0] leading-[16px]">
                Nguyễn Văn Long
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
