"use client";

import Image from "next/image";
import businessData from "../../data/BusinessNeeds2";

function BusinessNeeds2() {
  return (
    <>
      <section className="businessNeeds2 bg-[#FFFFFFF4]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            {businessData.map((items, index) => (
              <div
                key={index}
                className="
                  lg:col-span-3 flex flex-col w-[336px] h-[349px] min-h-[338px] gap-[19.5px] rounded-[16px] border border-[1px] border-[#FFC5D0] p-10 "
              >
                <Image
                  src="/assets/icon/avetar.png"
                  alt={items.title || "Icon"}
                  width={17}
                  height={21}
                  className="w-[17px] h-[21px]"
                />
                <h3 className="text-[18px] font-semibold text-[#222] text-left">
                  {items.title}
                </h3>
                <p className="text-[14px] leading-6 text-[#444] text-left">
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
