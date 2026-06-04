"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const steps = [
  {
    num: "01",
    title: "创建画像分析",
    desc: "描述你的目标人群，选择平台，系统自动生成结构化用户画像",
    href: "/personas",
    color: "from-[#0071e3] to-[#40a9ff]",
  },
  {
    num: "02",
    title: "内容传播优化",
    desc: "基于画像分析结果，输入原始内容，AI 自动优化适配目标人群",
    href: "/optimize",
    color: "from-[#40a9ff] to-[#0071e3]",
  },
];

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#40a9ff] flex items-center justify-center shadow-lg shadow-[#0071e3]/20 mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-[44px] font-bold text-[#1d1d1f] tracking-tight mb-3">PropagateMachine</h1>
        <p className="text-[18px] text-[#86868b] max-w-md leading-relaxed mb-2">
          传播机器 — 面向传播的内容生成系统
        </p>
        <p className="text-[14px] text-[#aeaeb2] max-w-sm leading-relaxed mb-10">
          先分析目标人群画像，再针对性地优化传播内容 — 让每一篇内容都击中目标受众
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="bg-[#0071e3] text-white text-[14px] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0077ed] shadow-sm transition-all"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="bg-[#1d1d1f] text-white text-[14px] font-semibold px-6 py-2.5 rounded-xl hover:bg-black transition-all"
          >
            注册
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      {/* ── Welcome ── */}
      <div className="mb-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#40a9ff] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0071e3]/20">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-[30px] font-bold text-[#1d1d1f] tracking-tight">欢迎使用 PropagateMachine</h1>
        <p className="text-[15px] text-[#86868b] mt-2 max-w-md mx-auto leading-relaxed">
          两步搞定内容传播优化：先分析目标人群，再优化传播内容
        </p>
      </div>

      {/* ── Workflow ── */}
      <div className="relative">
        <div className="absolute left-[23px] top-16 bottom-16 w-0.5 bg-gradient-to-b from-[#0071e3] to-[#40a9ff] hidden sm:block" />
        <div className="space-y-8">
          {steps.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-start gap-6 card p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-[15px] font-bold shrink-0 shadow-md`}>
                {s.num}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                  {s.title}
                </h2>
                <p className="text-[14px] text-[#86868b] mt-1 leading-relaxed">{s.desc}</p>
                <div className="flex items-center gap-1 mt-2.5 text-[13px] font-medium text-[#0071e3] opacity-0 group-hover:opacity-100 transition-opacity">
                  开始
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="mt-12 text-center">
        <p className="text-[13px] text-[#aeaeb2]">
          已创建画像后可直接在优化页选择使用 · 支持文本 / 图片内容优化
        </p>
      </div>
    </div>
  );
}
