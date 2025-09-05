import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

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
  <div className="relative z-10 flex h-full justify-center mt-[100px] px-6 md:px-12 text-white">
    <div>
      <div className="flex items-center gap-2">
        <div className="playBtnCircle w-[20px] h-[20px] bg-white rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faPlay} className="text-black w-[6px]" />
        </div>
        <p className="text-xl font-normal text-white/100 m-0">
          Learn about A2Z Gulf
        </p>
      </div>
      <h1 className="mt-4 text-[44px] text-white/100 max-w-full font-semibold pb-[50px]">
        Top B2B e commerce platform for trade A2Z
      </h1>
      <div className="searchFilds">
        <input
          type="text"
          className="flex-1 w-[90%] bg-white text-[#767676] p-4 placeholder-[#767676] placeholder:text-[16px] placeholder:font-normal outline-none border-none rounded-full"
          placeholder="in Saudi Arabia"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Click Me
        </button>
      </div>
    </div>
  </div>
</section>
    </>
  );
}
