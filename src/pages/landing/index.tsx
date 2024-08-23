import Image from 'next/image';
import logo from '../../../public/ui/logo.png';
import landingLogo1 from '../../../public/ui/landing-logo-1.png';
import food from '../../../public/ui/food.png';
import technology from '../../../public/ui/technology.png';
import medicine from '../../../public/ui/medicine.png';
import { Input } from '@/components/shadcn/ui/input';
import { Button } from '@/components/shadcn/ui/button';
import CommonCard from '@/components/CommonCard';
import AuthButton from './authButton';
const LandingPage = () => {
  return (
    <div className='bg-background h-screen w-screen text-black'>
      <nav className='text-white p-6 flex items-center pb-0 '>
        <div className='flex items-center gap-x-2 basis-1/3'>
          <Image src={logo} alt='logo' width={100} />
          <span className='text-4xl font-bold text-primary'>TSA</span>
        </div>
        <div className='flex gap-x-10 items-center text-black basis-2/4 '>
          <span className='text-2xl font-semibold'>FAQ</span>
          <span className='text-2xl font-semibold'>Liên hệ</span>
          <span className='text-2xl font-semibold'>Về chúng tôi</span>
          <Input
            className='border-black max-w-[200px] rounded-xl h-[48px] px-4'
            placeholder='Tìm kiếm đơn hàng'
          />
        </div>
        <div className='text-lg font-semibold text-black ml-8 '>
          <AuthButton />
        </div>
      </nav>
      <main className='flex items-center p-8 gap-x-4'>
        <div className='basis-1/2 flex flex-col gap-y-4'>
          <div className='flex flex-col gap-y-2 text-5xl font-semibold uppercases'>
            <span className='text-[#63AC5E]'>GIAO HÀNG</span>
            <span>NHANH CHÓNG</span>
            <span>ĐẾN TẬN NƠI CỦA BẠN</span>
          </div>
          <div className='font-light text-xl '>
            Dịch vụ chuyển phát chúng tôi đa dạng các mặt hàng từ đò ăn, món hàng công nghệ, đồ gia
            dụng hay các đồ mỹ phẩm
          </div>
          <Button className='h-12' variant={'secondary'}>
            Đặt hàng ngay
          </Button>
          <div className='flex items-center gap-x-6 px-4 select-none'>
            <CommonCard title='Đồ ăn'>
              <Image src={food} alt='food' width={60} quality={100} />
            </CommonCard>
            <CommonCard title='Công nghệ'>
              <Image src={technology} alt='technology' width={60} quality={100} />
            </CommonCard>
            <CommonCard title='Dược phẩm'>
              <Image src={medicine} alt='medicine' width={60} quality={100} />
            </CommonCard>
          </div>
        </div>
        <div className='basis-1/2'>
          <Image
            src={landingLogo1}
            alt='landing-logo-1'
            className='w-full h-full'
            quality={100}
            priority
          />
        </div>
      </main>
    </div>
  );
};
export default LandingPage;
