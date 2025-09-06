"use client";
import Image from "next/image";
import businessData from "../../data/BusinessNeeds.json";

function BusinessNeeds() {
  console.log("data:", businessData);
  return (
    <>
      <section className="businessNeeds bg-[#FFF5F7]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mb-[30px]">
            {/* Left Column */}
            <div className="lg:col-span-8">
              <div className="mainHeading">
                <h1 className="text-[44px] font-semibold text-[#222222]">
                  Explore millions of offerings tailored to your business needs
                </h1>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                <div className="lg:col-span-6">
                  <h className="font-extrabold text-[36px] text-[#38CBFF]">200M+</h>
                  <p>Products</p>
                </div>
                <div className="lg:col-span-6">
                  <h className="font-extrabold text-[36px] text-[#38CBFF]">200K+</h>
                  <p>Suppliers</p>
                </div>
                <div className="lg:col-span-6">
                  <h className="font-extrabold text-[36px] text-[#38CBFF]">5,900</h>
                  <p>product categories</p>
                </div>
                <div className="lg:col-span-6">
                  <h className="font-extrabold text-[36px] text-[#38CBFF]">200+</h>
                  <p>countries and regions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[36px] mb-[36px]">
            {businessData.map((items, index) => (
              <div
                className="lg:col-span-2 p-10 border border-[#38CBFF] place-items-center"
                key={index}
              >
                <Image
                  src="/assets/icon/avetar.png"
                  width={17}
                  height={21}
                  className="w-[17px] h-[21px] text-center"
                />
                <p>{items.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default BusinessNeeds;
