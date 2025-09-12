"use client";
import data from "../../data/ordering.json";

export default function Ordering() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
        {/* LEFT: Title + Steps */}
        <div>
          <h2 className="font-dm font-semibold text-[44px] leading-[52px] text-[#111] mb-8">
            {data.title}
          </h2>

          <div className="relative mt-24">
            <ul className="space-y-7">
              {data.steps.map((s, i) => {
                const isPrimary = s.type === "primary";
                const isLast = i === data.steps.length - 1;

                return (
                 <li key={i} className="flex items-start gap-4 relative">
  {/* Icon + line container */}
  <div className="flex flex-col items-center relative">
    {/* Icon */}
    <div
      className={[
        "shrink-0 rounded-full grid place-items-center z-12",
        isPrimary
          ? "w-[63.98px] h-[63.98px] max-w-[106.61px] bg-[#FDD2C6]"
          : "w-[48px] h-[48px] max-w-[60px] bg-[#EFEFEF]"
      ].join(" ")}
    >
      <img
        src={s.icon}
        alt=""
        className={isPrimary ? "w-6 h-6" : "w-5 h-5"}
      />
    </div>

    {/* Vertical line to next icon */}
    {!isLast && (
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-full bg-[#F3C0C8]" />
    )}
  </div>

  {/* Texts */}
  <div className="pt-1">
    <h4
      className={
        isPrimary
          ? "text-[22px] font-semibold text-[#222]"
          : "text-[20px] font-medium text-[#222]"
      }
    >
      {s.title}
    </h4>
    {s.desc && (
      <p className="mt-2 text-sm text-[#5B5B5B] max-w-[480px]">
        {s.desc}
      </p>
    )}
  </div>
</li>

                );
              })}
            </ul>
          </div>
        </div>

        {/* RIGHT: 690 x 530 panel image */}
        <div className="w-[690px] h-[530px] overflow-hidden bg-[#0B0E10] mt-44 mx-auto lg:ml-auto">
          <img
            src={data.panelImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
