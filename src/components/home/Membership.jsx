"use client";
import data from "../../data/membership.json";

export default function Membership() {
  return (
    <>
    <section className="bg-[#FFF4F6] py-16">
      <div className="container mx-auto px-4">
        {/* Top heading + subtext */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-dm font-semibold text-[36px] md:text-[42px] leading-tight text-[#1A1A1A]">
            {data.title}
          </h2>
          <p className="mt-4 text-[#5E5E5E] max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Testimonials */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {data.testimonials.map((t, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-[#A7E1FF] bg-white p-6 md:p-8"
            >
              {/* faint quote marks (bg accents) */}
              <svg className="absolute left-6 top-8 w-10 h-10 text-[#000]/5" viewBox="0 0 24 24"><path fill="currentColor" d="M10 7H6l-2 4v6h6V7zm10 0h-4l-2 4v6h6V7z"/></svg>
              <svg className="absolute right-6 bottom-8 w-10 h-10 rotate-180 text-[#000]/5" viewBox="0 0 24 24"><path fill="currentColor" d="M10 7H6l-2 4v6h6V7zm10 0h-4l-2 4v6h6V7z"/></svg>

              {/* avatar + name/role */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow"
                />
                <div className="mt-2 text-center">
                  <div className="font-semibold text-[#222]">{t.name}</div>
                  <div className="text-xs text-[#7B7B7B]">{t.role}</div>
                </div>
              </div>

              {/* quote */}
              <p className="text-[15px] leading-6 text-[#222]">
                “{t.quote}”
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        
      </div>
    </section>
          <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-dm font-semibold text-[28px] md:text-[32px] text-[#1F1F1F]">{data.ctaTitle}</h3>
          <p className="mt-2 text-[#6B6B6B]">{data.ctaSubtitle}</p>
          <a href={data.ctaButton.href} className="inline-block mt-5 rounded-full px-8 py-3 bg-[#2BB0FF] text-white font-medium hover:opacity-90 transition">
            {data.ctaButton.label}
          </a>
        </div>
      </section>

    </>
  );
}
