import { FC, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from 'src/hooks/use-auth'; // Import your auth hook
import { usePathname } from 'src/hooks/use-pathname';
import { Section } from '../config/config';
import SimpleBar from 'simplebar-react';
import { SideNavSection } from './side-nav-section';
import { NavColor } from 'src/types/settings';
import { SIDE_NAV_WIDTH } from 'src/config';
import { Button } from 'src/components/shadcn/ui/button';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';

interface SideNavProps {
  color?: NavColor;
  sections?: Section[];
}

export const SideNav: FC<SideNavProps> = (props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { sections = [] } = props;
  const pathname = usePathname();

  const handleLogin = useCallback(() => {
    router.push(paths.auth.login);
  }, [router]);

  return (
    <div
      className='fixed inset-0 z-50 h-screen bg-white rounded-[0px_24px_24px_0px] overflow-hidden border-r border-solid border-background-other-divider shadow-lg'
      style={{ width: SIDE_NAV_WIDTH }}
    >
      <div
        className='flex flex-col flex-shrink-0 w-full bg-gray-900 overflow-y-auto h-full'
        style={{
          backgroundColor: 'var(--nav-bg)',
          color: 'var(--nav-color)'
        }}
      >
        <SimpleBar className='flex-1'>
          <div className='flex flex-col items-center pt-[32px] pb-[24px] px-[16px] relative self-stretch w-full flex-[0_0_auto]'>
            <div className='flex flex-col items-center gap-[16px] relative self-stretch w-full flex-[0_0_auto]'>
              <div className='flex flex-col items-start gap-[4px] p-[16px] relative self-stretch w-full flex-[0_0_auto] bg-tailwindcss-colors-slate-50 rounded-[16px]'>
                <img
                  className='relative w-[100%] h-[100%] pb-6'
                  alt='Logo'
                  src='/ui/logo_new.png'
                />
                {/* <p className="text-sm font-semibold">Viện nghiên cứu Châu Á</p> */}
              </div>
              <img
                className='relative w-[100%] h-[100%]'
                alt='Logo'
                src='/ui/chu dai chanh tang tv.png'
              />
              <img
                className='relative w-[100%] h-[100%]'
                alt='Logo'
                src='/ui/chu dai chanh tang ta.png'
              />
            </div>
          </div>

          <div className='h-full flex flex-col flex-1'>
            <nav className='flex-grow space-y-2 px-2'>
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
        {user?.role ? (
          <div className='sticky w-full bottom-0 p-2 cursor-pointer flex bg-white z-10 items-center'>
            <Link href={'#'} className='sticky w-full bottom-0 p-2 cursor-pointer flex gap-[12px]'>
              <img
                className='flex w-[12%] h-full items-center pt-0.5'
                alt='Logo'
                src='/logos/logo.png'
              />
              <div className='inline-flex flex-col items-start relative flex-[0_0_auto]'>
                {user.role == 'admin' ? (
                  <div className='text-sm font-semibold'>Quản trị viên</div>
                ) : (
                  <div className='text-sm font-semibold'>Dịch giả</div>
                )}
                <div className='text-xs text-text-secondary'>{user.full_name}</div>
              </div>
            </Link>
          </div>
        ) : (
          <div className='mb-5'>
            <div className='m-4 p-5 space-y-5 border rounded-3xl'>
              <img
                className='flex w-full h-full items-center rounded-3xl'
                alt='Logo'
                src='/ui/background-siu.png'
              />
              <div className='space-y-3'>
                <div className='flex justify-center text-sm font-semibold'>Dịch giả</div>
                <div className='text-xs font-normal text-secondary'>
                  <div className='flex justify-center'>Đăng nhập tới trang quản trị</div>
                  <div className='flex justify-center'>dành cho dịch giả</div>
                </div>
              </div>

              <Button variant='secondary' className='w-full' onClick={handleLogin}>
                Đăng nhập
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
