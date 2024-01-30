import React from "react";

const HeaderTitle = () => {
  return (
    <div className="w-[388px] h-[220px] px-4 pt-8 pb-6 gap-6">
      <div className="flex flex-col items-center relative self-center w-[356px] h-[76px] p-[16px] flex-[0_0_auto] bg-tailwindcss-colors-slate-50 rounded-[16px] justify-center">
        <img
          className="relative w-[24px] h-[24px] gap-[1px]"
          alt="Header images"
          src="https://c.animaapp.com/oTA7Mv2p/img/header-images-2-1@2x.png"
        />
        <p className="text-xs font-semibold">Viện nghiên cứu Châu Á</p>
      </div>
      <h1 className="font-semibold text-primary text-center font-inter text-3xl font-text-3xl-semibold leading-9 align-self-stretch w-[356px] h-[72px]">
        Đại Chánh Tân Tu Đại Tạng Kinh
      </h1>
    </div>
  );
};

export default HeaderTitle;
