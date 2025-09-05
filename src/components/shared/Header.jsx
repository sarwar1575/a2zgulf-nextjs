"use client";

import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <>
      <section className="navbar">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 p-4">
              <div className="logo">
                <Link href=""><Image src="/assets/img/weblogo.png" width={170} height={170}/></Link>
              </div>
            </div>
            <div className="lg:col-span-6 p-4">
              <div className="">
                <span>Deliver to:</span>
                <div className="countryLists">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Header;
