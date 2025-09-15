"use client";
import data from "@/data/footer.json";

export default function Footer() {
  return (
    <footer className="bg-[#0F1C2B] text-[#C9D2E0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="rounded-lg border-2 border-dotted border-[#2C435C] p-6">
          {/* columns */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {data.columns.map((c, i) => (
              <div key={i}>
                <h4 className="mb-3 text-[15px] font-semibold text-white">{c.title}</h4>
                <ul className="space-y-2 text-sm">
                  {c.links.map((l, j) => (
                    <li key={j}><a href="#" className="hover:underline">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* payments + apps */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {data.payments.map((src, i) => (
                <img key={i} src={src} alt="" className="h-6 w-auto rounded bg-white/5 p-1" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <img src={data.apps.ios} alt="app store" className="h-9" />
              <img src={data.apps.android} alt="google play" className="h-9" />
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#A9B7C6]">{data.bottomText}</p>
          <div className="flex items-center gap-3">
            {data.socials.map((s, i) => (
              <a key={i} href={s.href} className="grid h-8 w-8 place-items-center rounded bg-white/5 hover:bg-white/10">
                <img src={s.icon} alt="" className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
