import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BiUpload } from "react-icons/bi";
import { FaFileCircleCheck } from "react-icons/fa6";
import { Button } from "../shadcn/ui/button";

// interface File {
//   name: string;
//   size: number;
//   type: string;
// }

interface FileDropzoneProps {
  fileCount: number;
  onUpload: (files: File[]) => void;
  onClear?: () => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  fileCount,
  onUpload,
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input element

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    }, // specify accepted file types
    onDrop: onUpload,
    noClick: true, // prevent button click triggering dialog
  });

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Trigger file selection using the ref
    }
  };

  return (
    <div
      className={clsx(
        "w-full p-8 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer ease-in duration-200 hover:bg-primary/5",
        isDragActive && "bg-primary/5"
      )}
      {...getRootProps()}
      onClick={handleClick}
    >
      <input {...getInputProps()} ref={inputRef} />
      {fileCount ? (
        <div className="flex gap-2 items-center w-full py-4">
          <FaFileCircleCheck className="w-8 h-8 fill-blue-600" />
          <div className="flex-1 text-lg font-semibold">
            Đã tải lên {fileCount} File
          </div>
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClick();
              }}
            >
              Tải lại
            </Button>
            {onClear && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear();
                }}
              >
                Xoá
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-4 items-centers">
            <div>
              <div className="rounded-full p-5 bg-gray-200">
                <BiUpload className="w-7 h-7 fill-gray-500" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium mb-1">
                Tải lên file văn bản gốc
              </p>
              <p className="text-gray-600">File Ảnh (PDF,PNG hoặc JPG)</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FileDropzone;
