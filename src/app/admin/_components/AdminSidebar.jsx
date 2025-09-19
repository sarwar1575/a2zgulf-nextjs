"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Home, Users, Package, Settings, Database, CreditCard, MessageSquare,
  FileText, ClipboardList, ChevronRight, ChevronDown, Layers, Tag
} from "lucide-react";

/* ---- MENU (matches screenshot sections) ---- */
const MENU = [
  { type: "item", label: "Dashboard", href: "/admin", icon: Home },
  { type: "item", label: "Supplier", href: "/admin/suppliers", icon: Users },

  {
    type: "group", label: "Master", icon: Layers, children: [
      { label: "Category", href: "/admin/master/category" },
      { label: "Sub Category", href: "/admin/master/sub-category" },
      { label: "Role", href: "/admin/master/role" }
    ]
  },

  { type: "item", label: "Meta", href: "/admin/meta", icon: Tag },
  { type: "item", label: "ERP", href: "/admin/erp", icon: Database },
  { type: "item", label: "Products", href: "/admin/products", icon: Package },

  {
    type: "group", label: "CMS", icon: FileText, children: [
      { label: "Articles", href: "/admin/cms/articles" },
      { label: "Banners", href: "/admin/cms/banners" },
      { label: "FAQs", href: "/admin/cms/faqs" },
      { label: "Content Management", href: "/admin/cms/content" }
    ]
  },

  { type: "item", label: "Users", href: "/admin/users", icon: Users },
  { type: "item", label: "Contacts", href: "/admin/contacts", icon: ClipboardList },
  { type: "item", label: "Manage Billing", href: "/admin/billing", icon: CreditCard },
  { type: "item", label: "Manage Leads", href: "/admin/leads", icon: Users },
  { type: "item", label: "Chat", href: "/admin/chat", icon: MessageSquare },
  { type: "item", label: "Manage Subscription", href: "/admin/subscriptions", icon: ClipboardList },

  {
    type: "group", label: "Log", icon: FileText, children: [
      { label: "Mail Log", href: "/admin/log/mail" },
      { label: "Front-end Error Log", href: "/admin/log/fe-errors" },
      { label: "Request Log", href: "/admin/log/requests" },
      { label: "Site Pages", href: "/admin/log/site-pages" },
      { label: "Untracked URL", href: "/admin/log/untracked" },
      { label: "Broken Tut URL", href: "/admin/log/broken-tut" }
    ]
  },

  { type: "item", label: "Settings", href: "/admin/settings", icon: Settings }
];

function Leaf({ href, label, Icon, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition
        ${active ? "text-[#1570EF] font-semibold" : "text-[#5D6679] hover:text-[#1570EF]"}
      `}
    >
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );
}

function Group({ node, pathname }) {
  const preOpen = node.children?.some(c => pathname.startsWith(c.href));
  const [open, setOpen] = useState(preOpen);
  const Caret = open ? ChevronDown : ChevronRight;

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center justify-between w-full rounded-lg px-3 py-2 text-[13px] transition
          ${open ? "text-[#1570EF] font-semibold" : "text-[#5D6679] hover:text-[#1570EF]"}
        `}
      >
        <span className="flex items-center gap-3">
          <node.icon size={18} strokeWidth={2} />
          {node.label}
        </span>
        <Caret size={16} />
      </button>

      {open && (
        <div className="ml-8 mt-1 space-y-1">
          {node.children.map((c, i) => (
            <Leaf
              key={i}
              href={c.href}
              label={c.label}
              Icon={() => <span className="w-1.5 h-1.5 rounded-full bg-[#1570EF] inline-block" />}
              active={pathname === c.href}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block">
      {/* left gutter so sidebar not glued to window edge */}
      <div className="pl-2">
        {/* Outer width same as old (230px) so main content shift na ho */}
        <div className="relative w-[230px]">
          {/* Inner card visually wider (260px) & shifted left by 30px */}
          <div
            className="
              sticky top-[72px]
              h-[calc(100vh-88px)]
              w-[260px] -translate-x-[30px] will-change-transform
              rounded-2xl border border-[#F1DADF] bg-[#FFF5F7]
              shadow-[0_2px_6px_rgba(0,0,0,0.04)] p-3
              overflow-y-auto
            "
          >
            <nav className="space-y-1">
              {MENU.map((n, idx) =>
                n.type === "item" ? (
                  <Leaf
                    key={idx}
                    href={n.href}
                    label={n.label}
                    Icon={n.icon}
                    active={pathname === n.href}
                  />
                ) : (
                  <Group key={idx} node={n} pathname={pathname} />
                )
              )}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
