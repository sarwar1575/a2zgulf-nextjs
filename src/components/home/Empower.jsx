"use client";
import data from "../../data/empower.json";

export default function Empower() {
  const { title, subtitle, cards, regionTitle, viewMore, countries, about } = data;
  return (
    <>
      <section className="bg-[#E3F8FF] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="font-dm font-semibold text-3xl md:text-4xl text-[#111]">{title}</h2>
            <p className="mt-2 text-sm text-[#5E5E5E]">{subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <a
  href={cards[0].href}
  className="relative rounded-xl overflow-hidden lg:col-span-2"
>
  {/* Image */}
  <img
    src={cards[0].img}
    alt=""
    className="w-[704px] h-[600px] object-cover rounded-[16px]"
  />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] to-[#000000]" />

  {/* Caption Text */}
  <div className="absolute bottom-4 left-4 text-white font-semibold">
    {cards[0].caption}
  </div>
</a>

            <div className="grid gap-5">
              {cards.slice(1).map((c, i) => (
                <a key={i} href={c.href} className="relative rounded-xl overflow-hidden">
                  <img src={c.img} className="w-full h-[170px] object-cover" />
                  <div className="absolute inset-0 p-5 text-black">
                    {c.kicker && <div className="text-[10px] uppercase opacity-60">{c.kicker}</div>}
                    <h3 className="font-semibold text-lg max-w-[260px]">{c.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-dm font-semibold">{regionTitle}</h4>
            <a href={viewMore.href} className="text-sm underline">{viewMore.label} →</a>
          </div>
          <div className="flex flex-wrap gap-8">
            {countries.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <img src={c.flag} className="w-12 h-12 rounded-full object-cover" />
                <span className="text-sm">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E3F8FF] py-8">
        <div className="container mx-auto px-4">
          <h5 className="font-dm font-semibold text-[#0F172A]">{about.title}</h5>
          <p className="mt-2 text-xs md:text-[12px] leading-5 text-[#4B5563] max-w-5xl">{about.body}</p>
        </div>
      </section>
    </>
  );
}
