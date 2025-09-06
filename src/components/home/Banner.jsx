import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <>
      <section className="relative w-full h-[500px] overflow-hidden">
        <Image
          src="/assets/img/newbannerhome.png"
          alt="Home Banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 flex h-full justify-center mt-[80px] px-6 md:px-12 text-white">
          <div>
            <div className="flex items-center gap-2">
              <div className="playBtnCircle w-[20px] h-[20px] bg-white rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faPlay} className="text-black w-[6px]" />
              </div>
              <p className="text-xl font-normal text-white/100 m-0">
                Learn about A2Z Gulf
              </p>
            </div>
            <h1 className="mt-4 text-[44px] text-white/100 max-w-full font-semibold pb-[40px]">
              Top B2B e commerce platform for trade A2Z
            </h1>
            <div className="w-[90%]">
              <div className="relative mb-[40px]">
                <input
                  type="text"
                  className="w-full bg-white text-[#767676] p-4 pr-30 pl-7 placeholder-[#767676] placeholder:text-[16px] placeholder:font-normal outline-none border-none rounded-full"
                  placeholder="a2z in Saudi Arabia"
                />
                <div className="absolute top-1/2 right-1 -translate-y-1/2 flex items-center gap-2">
                  <Link href="">
                    <Image
                      src="/assets/icon/watch.png"
                      width={24}
                      height={24}
                      className="w-[24px] h-[24px]"
                    />
                  </Link>

                  <button className="px-6 py-3 bg-[#38CBFF] text-[#222222] rounded-full text-[16px] font-semibold flex items-center gap-2 cursor-pointer">
                    <Image
                      src="/assets/icon/Searchicon.png"
                      width={20}
                      height={20}
                      alt="Search Icon"
                      className="w-[20px] h-[20px]"
                    />
                    <span className="font-semibold">Search</span>
                  </button>
                </div>
              </div>
                 <div className="title__seacrh flex items-center gap-6">
                <div className="brandNames">
                  <p className="text-[16px] font-medium text-[#FFFFFF]">Frequently searched:</p>
                </div>
                <div className="brandTi__shared flex items-center gap-6">
                  <div>
                    <span className="border border-[#FFFFFF] py-2 px-6 rounded-full text-[14px] font-medium">essentials hoodie</span>
                  </div>
                  <div>
                    <span className="border border-[#FFFFFF] py-2 px-6 rounded-full text-[14px] font-medium">lululemon sets women</span>
                  </div>
                  <div>
                    <span className="border border-[#FFFFFF] py-2 px-6 rounded-full text-[14px] font-medium">iphones 15 pro max</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
