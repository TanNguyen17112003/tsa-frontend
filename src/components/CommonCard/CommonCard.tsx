import Link from 'next/link';
import { HiMiniArrowSmallRight } from 'react-icons/hi2';
import { ReactNode } from 'react';

const CommonCard = ({
  title,
  link,
  linkLabel,
  children
}: {
  title: string;
  link?: string;
  linkLabel?: string;
  children: ReactNode;
}) => {
  return (
    <div className='p-5 border border-gray-300 rounded-3xl bg-white w-full max-w-[30%] flex flex-col items-center '>
      {children}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold  text-nowrap'>{title}</h2>
        {link && (
          <Link
            href={link}
            className='flex text-orange-500 text-nowrap  hover:bg-orange-200 p-3 rounded-lg overflow-hidden'
          >
            {linkLabel} <HiMiniArrowSmallRight style={{ fontSize: '1.4em' }} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default CommonCard;
