"use client";

import Image from "next/image";
import data from "@/data/discover.json"; // adjust path if your alias differs

export default function Discover() {
  return (
    <section className="Discover py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Heading */} 
        <h2 className="text-[44px]  md:text-[40px] lg:text-[52px] font-semibold text-[#222222] mb-8 lg:mb-10">
          {data.headline}
        </h2>

        {/* === Row 1: Top categories (3 cards) === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-10 lg:mb-14">
          {data.topCategories.map((cat, i) => (
            <div
              key={i}
              className="
                lg:col-span-4 rounded-[16px]
                bg-[#FFEFF2] p-4 lg:p-5
                shadow-[0_4px_20px_#FFEEF126]
              "
            >
              <h3 className="text-[20px] lg:text-xl font-semibold text-[#222] mb-4">
                {cat.title}
              </h3>

              <div className="flex gap-3 overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-3 lg:gap-4">
                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="min-w-[140px] lg:min-w-0 flex flex-col items-center"
                  >
                    {/* ⬇️ Image ka border sirf yahan */}
                    <div className="relative w-[136px] h-[120px] rounded-[5px] border border-[#38CBFF] bg-white">
                      <Image
                        src={item.img}
                        alt={item.tag || "Product"}
                        fill
                        className="object-contain object-center p-2"
                        sizes="136px"
                      />
                    </div>

                    {/* ⬇️ Text image-box ke bahar, center */}
                    <div className="mt-2 w-[76px] h-[29px] text-center text-[10px]">
                      <div className="font-bold text-[#000000]">
                        {item.price}
                      </div>
                      <div className="text-[#000000]">{item.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* === Row 2: Two big panels === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Customizable products (left) */}
          <div className="lg:col-span-6 rounded-[16px] bg-[#FFEFF2] p-5 lg:p-7 shadow-[0_4px_20px_#FFEEF126]">
            <h3 className="text-[25px] lg:text-[28px] font-bold text-[#292626] mb-2">
              {data.customizable.title}
            </h3>
            <p className="text-[14px] lg:text-[16px] font-normal text-[#000000] mb-5 lg:mb-6">
              {data.customizable.subtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {data.customizable.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="w-[317px] h-[174px] border border-[#38CBFF] bg-white p-4"
                >
                  <div className="text-[16px] text-center font-semibold text-[#222]">
                    {card.title}
                  </div>
                  <div className="flex items-center gap-3 mt-4 overflow-x-auto">
                    {card.images.map((src, k) => (
                      <div key={k} className="relative w-20 h-16 shrink-0">
                        <Image
                          src={src}
                          alt={card.title}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ready-to-ship (right) */}
          <div className="lg:col-span-6 rounded-[16px] bg-[#FFEFF2] p-5 lg:p-7 shadow-[0_4px_20px_#FFEEF126]">
            <h3 className="text-[22px] lg:text-[28px] font-semibold text-[#292626] mb-2">
              {data.readyToShip.title}
            </h3>
            <p className="text-[14px] lg:text-[16px] text-[#000000] mb-5 lg:mb-6">
              {data.readyToShip.subtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {data.readyToShip.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="w-[317px] h-[174px] border border-[#38CBFF] bg-white p-4 flex flex-col gap-3"
                >
                  <div className="text-[16px] text-center font-semibold text-[#222]">
                    {card.title}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    {card.images.map((src, k) => (
                      <div key={k} className="relative w-20 h-16">
                        <Image
                          src={src}
                          alt={card.title}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
