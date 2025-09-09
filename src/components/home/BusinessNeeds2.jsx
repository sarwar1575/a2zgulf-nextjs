"use client";

import Image from "next/image";
import businessData from "../../data/BusinessNeeds2";

function BusinessNeeds2() {
  return (
    <>
      <section className="businessNeeds2 bg-[#FFFFFFF4] py-[50px]">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-9">
      {businessData.map((items, index) => (
        <div
          key={index}
          className="
            lg:col-span-3
            w-full lg:w-[336px]
            h-[349px] min-h-[338px]
            rounded-[16px] border border-[#FFC5D0]
            p-[40px]
            bg-white
            flex flex-col gap-[19.5px]
          "
        >
          {/* Icon inside circular badge */}
          <div className="w-[60px] h-[60px] rounded-[30px] p-[10px] bg-[#F3C0C859] flex items-center justify-center">
            <Image
              src="/assets/icon/avetar.png"
              alt={items.title || 'Icon'}
              width={17}
              height={21}
              className="w-[17px] h-[21px]"
            />
          </div>

          <h3 className="text-[24px] font-semibold text-[#222222]">
            {items.title}
          </h3>

          <p className="text-[16px] font-normal text-[#222222]">
            {items.Description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

    </>
  );
}

export default BusinessNeeds2;
