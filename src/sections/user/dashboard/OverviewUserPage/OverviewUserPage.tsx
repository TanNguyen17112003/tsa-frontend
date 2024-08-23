import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { FaLongArrowAltRight, FaMapMarkerAlt } from 'react-icons/fa';
import { HiMiniArrowSmallRight } from 'react-icons/hi2';
import { PiPhoneCallFill } from 'react-icons/pi';
import { SiGmail } from 'react-icons/si';
import { Button } from 'src/components/shadcn/ui/button';
import FormInput from 'src/components/ui/FormInput';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { paths } from 'src/paths';
import OverviewStats from './OverviewStats';

const OverviewUserPage = () => {
  const router = useRouter();

  const { showSnackbarError } = useAppSnackbar();

  const handleSeeAll = useCallback(() => {
    router.push({
      pathname: paths.dashboard.collections
    });
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchInput: HTMLInputElement = document.getElementById('search') as HTMLInputElement;
    const wordLength = searchInput.value.replace(/\s+/g, ' ').split(' ').length;
    if (wordLength > 15) {
      showSnackbarError('Không thể tìm kiếm quá 15 từ!');
      return;
    }
    const searchValue = searchInput?.value;
    router.replace({
      pathname: paths.dashboard.collections,
      query: { ...router.query, textSearch: searchValue, searchType: 'basic' }
    });
  };

  return (
    <div
      className='flex bg-cover bg-center w-full min-h-screen'
      style={{
        backgroundImage: 'url("/background.png")'
      }}
    >
      <div className='flex-1 w-full px-[10%]'>
        <div className='text-2xl font-semibold leading-relaxed py-8'>Trang chủ</div>

        <div className='relative w-full h-[357px]'>
          <div
            className='flex bg-cover bg-center rounded-xl'
            style={{
              backgroundImage: 'url("/ui/banner chu dai chanh tang.png")',
              width: '100%',
              height: '100%'
            }}
          >
            <div
              className='absolute z-0 bg-cover bg-center rounded-xl'
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(170, 79, 2, 1), transparent)',
                width: '30%',
                height: '100%'
              }}
            ></div>
            <div className='z-10 px-[42px] py-[82px] space-y-8'>
              <div className='text-4xl font-semibold text-white'>
                HỆ THỐNG <br /> ĐẠI TẠNG KINH <br /> VIỆT NAM
              </div>
              <Button
                className='flex bg-cyan-500 hover:bg-cyan-800 space-x-2'
                onClick={handleSeeAll}
              >
                <div className='text-sm font-semibold'>Khám phá</div>
                <FaLongArrowAltRight style={{ fontSize: '1rem', marginTop: '2px' }} />
              </Button>
            </div>
          </div>
        </div>
        <form className='flex bg-white h-15 my-5' onSubmit={handleSubmit}>
          <div className='flex gap-4 flex-1'>
            <div className='flex items-center border border-gray-300 rounded-md w-full divide-x'>
              <div className='flex w-full items-center'>
                <FormInput
                  type='text'
                  placeholder='Nhập từ khóa tìm kiếm...'
                  className='border-none'
                  id='search'
                />
              </div>
            </div>
            <Button type='submit'> Tìm kiếm</Button>
          </div>
        </form>
        <div className='overflow-hidden'>
          <OverviewStats />
        </div>
        <div className='my-8 flex overflow-hidden space-x-5'>
          <div className='w-full max-w-[80%] border rounded-3xl bg-white'>
            <div className='flex p-5 '>
              <div className='text-lg font-semibold w-full'>Danh sách bộ kinh</div>
              <Button variant='ghost' className='gap-2 text-primary' onClick={handleSeeAll}>
                Xem tất cả <HiMiniArrowSmallRight className='h-6 w-6' />
              </Button>
            </div>
          </div>
        </div>
        <div className='flex border bg-white p-4 justify-center  overflow-hidden w-full rounded-3xl'>
          <div>
            <div className='flex w-full pt-4 space-x-20'>
              <div className=' my-4'>
                <div className='border p-4 rounded-3xl mb-4'>
                  <img src='/logos/logo.png' alt='logo' width='20%' />
                  <div className='text-sm font-medium text-nowrap'>Viện nghiên cứu Châu Á</div>
                </div>
                <div>
                  <Button
                    variant={'ghost'}
                    className='pl-4 text-primary text-md'
                    onClick={() => {
                      router.push(paths.dashboard.index);
                    }}
                  >
                    Trang chủ
                  </Button>
                  <Button
                    variant={'ghost'}
                    className='pl-4 text-primary text-md'
                    onClick={() => {
                      router.push(paths.dashboard.collections);
                    }}
                  >
                    Kho dữ liệu
                  </Button>
                  <Button
                    variant={'ghost'}
                    className='pl-4 text-primary text-md'
                    onClick={() => {
                      router.push(paths.dashboard['add-report']);
                    }}
                  >
                    Khiếu nại
                  </Button>
                </div>
              </div>
              <div className='w-full my-5 pt-5'>
                <div className='text-xl font-semibold'>Thông tin liên hệ:</div>
                <div className='space-y-5'>
                  <div className='flex w-96 mt-6 items-center space-x-3'>
                    <FaMapMarkerAlt className='size-7 text-primary' />
                    <div>Địa chỉ: 52/1a tổ 1 khu phố 2, P.An Bình, TP. Biên Hoà, Tỉnh Đồng Nai</div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <SiGmail className='size-6 text-primary' />
                    <div>Email: huynguyen21122002@gmail.com</div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <PiPhoneCallFill className='size-7 text-primary' />
                    <div>SĐT: 09731259400</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex text-xs font-normal text-secondary w-full justify-center'>
              © All rights reserved. Contact: viennghiencuuchaua@gmail.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewUserPage;
