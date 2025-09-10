"use client";
import Image from "next/image";
import businessData from "../../data/BusinessNeeds.json";

function BusinessNeeds() {
  return (
    <>
      <section className="businessNeeds bg-[#FFF5F7] py-[10px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 pb-8">
            {/* Left Column */}
            <div className="lg:col-span-6">
              <div className="mainHeading">
                <h1 className="text-[44px] font-semibold text-[#222222]">
                  Explore millions of offerings tailored to your business needs
                </h1>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 float-right">
                {/* Products */}
                <div className="lg:col-span-6 flex items-center">
                  <div className="w-[4px] h-[60px] rounded bg-gray-300 mr-3"></div>
                  <div>
                    <h4 className="font-bold text-[36px] text-[#38CBFF]">
                      200M+
                    </h4>
                    <p>Products</p>
                  </div>
                </div>

                {/* Suppliers */}
                <div className="lg:col-span-6 flex items-center">
                  <div className="w-[4px] h-[60px] rounded bg-gray-300 mr-3"></div>
                  <div>
                    <h4 className="font-bold text-[36px] text-[#38CBFF]">
                      200K+
                    </h4>
                    <p>Suppliers</p>
                  </div>
                </div>

                {/* Product categories */}
                <div className="lg:col-span-6 flex items-center">
                  <div className="w-[4px] h-[60px] rounded bg-gray-300 mr-3"></div>
                  <div>
                    <h4 className="font-bold text-[36px] text-[#38CBFF]">
                      5,900
                    </h4>
                    <p>Product categories</p>
                  </div>
                </div>

                {/* Countries */}
                <div className="lg:col-span-6 flex items-center">
                  <div className="w-[4px] h-[60px] rounded bg-gray-300 mr-3"></div>
                  <div>
                    <h4 className="font-bold text-[36px] text-[#38CBFF]">
                      200+
                    </h4>
                    <p>Countries and regions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[36px] mb-[36px]">
            {businessData.map((items, index) => (
              <div
                className="lg:col-span-2 py-6 border border-[#38CBFF] bg-white place-items-center rounded-md"
                key={index}
              >
                <Image
                  src="/assets/icon/avetar.png"
                  width={17}
                  height={21}
                  className="w-[17px] h-[21px] text-center"
                  alt=""
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
