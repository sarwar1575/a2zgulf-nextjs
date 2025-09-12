"use client";
import data from "../../data/source.json";

export default function Source() {
  return (
    <>
      {/* SECTION 1: light-blue + images */}
      <section className="bg-[#E3F8FF] py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-dm font-semibold text-[44px] leading-[52px] text-[#222222] mb-8">
            {data.headline}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {data.images.map((src, i) => (
              <div key={i} className="w-[464px] h-[490px] rounded-lg border border-[#38CBFF] overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: full blue band */}
      <section className="bg-[#0A1735] py-12 text-white">
        <div className="container mx-auto px-4">
          {/* Half-cols heading */}
          <div className="grid lg:grid-cols-2 gap-8">
            <h3 className="font-dm font-semibold text-[44px] leading-[52px]">
              Trade with confidence from<br />production quality to purchase<br />protection
            </h3>
            <div />
          </div>

          {/* Two feature cards with requested style */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 place-items-start mt-36 mb-24">
            {data.features.map((f, i) => (
              <div
                key={i}
                className="
                  w-full md:w-[704px] h-[396px]
                  rounded-[20px] p-[50px] flex flex-col gap-[18px]
                  bg-[#38CBFF33] backdrop-blur-[50px]
                  shadow-[12px_12px_2px_0_rgba(213,213,213,0.5),inset_4px_4px_4px_0_rgba(255,255,255,0.3)]
                  border border-white/10
                "
              >
                <p className="text-sm text-[20px] opacity-90">{f.heading}</p>
                <img src={f.image} alt="" className="w-[400px] h-[70px] max-w-[704px] rotate-0 opacity-100"/>
                <p className="w-[604px] h-[66px] rotate-0 opacity-100 text-white 
          font-regular text-[16px] leading-[22px] 
         tracking-[0] align-middle">{f.desc}</p>
                <div className="mt-auto flex gap-4">
                  <button  class="w-[164px] h-[48px] max-w-[320px] rounded-full border 
         border-gray-400 px-[21px] py-[1px] opacity-100">Watch video</button>
                  <button>Learn more</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
