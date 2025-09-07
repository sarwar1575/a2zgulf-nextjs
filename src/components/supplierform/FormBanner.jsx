
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
function FormBanner() {
  return (
    <>
       <section className="relative w-full h-[500px] overflow-hidden">
        <Image
          src="/assets/img/formabnner.png"
          alt="Home Banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* <div className="absolute inset-0 bg-black/70"></div> */}
     
      </section>
    </>
  )
}

export default FormBanner;
