import React from "react";

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = ({}) => {
  return (
    <div className="flex space-x-2 justify-center items-center h-screen dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="h-6 w-6 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-6 w-6 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-6 w-6 bg-gray-300 rounded-full animate-bounce"></div>
    </div>
  );
};

export default Loading;
