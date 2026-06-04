"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/personas", label: "画像分析" },
  { href: "/optimize", label: "内容优化" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)]">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0071e3] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-[#1d1d1f]">Spread Harness</span>
          </Link>
          {user && (
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? "bg-[#0071e3]/10 text-[#0071e3]"
                        : "text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f7] text-[13px] font-medium text-[#1d1d1f]">
                <div className="w-5 h-5 rounded-full bg-[#0071e3] flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span>{user.username}</span>
              </div>
              <button onClick={logout} className="btn-ghost text-[13px]">
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-[13px]">
                登录
              </Link>
              <Link href="/register" className="btn-primary text-[13px]">
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
