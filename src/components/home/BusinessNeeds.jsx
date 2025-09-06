"use client";
import Image from "next/image";
import businessData from "../../data/BusinessNeeds.json";

function BusinessNeeds() {
  console.log("data:", businessData);
  return (
    <>
      <section className="businessNeeds">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            {businessData.map((items, index) => (
              <div
                className="lg:col-span-2 p-10 border border-[#000]"
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
