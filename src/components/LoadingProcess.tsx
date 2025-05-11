import React from 'react';

interface LoadingProps {}

const LoadingProcess: React.FC<LoadingProps> = ({}) => {
  return (
    <div className='z-50 fixed top-0 left-0 flex space-x-2 justify-center items-center h-screen w-screen dark:invert bg-black opacity-80'>
      <span className='sr-only'>Loading...</span>
      <div className='h-6 w-6 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='h-6 w-6 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='h-6 w-6 bg-gray-300 rounded-full animate-bounce'></div>
    </div>
  );
};

export default LoadingProcess;
