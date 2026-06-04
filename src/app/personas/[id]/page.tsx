export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { personaApi } from "@/lib/api";

interface PersonaDetail {
  id: string;
  title: string;
  description: string;
  platforms: string[];
  status: string;
  result: {
    raw_data: {
      platforms_scraped: string[];
      total_posts: number;
      sample_keywords: string[];
      demographic_hints: {
        age_range: string;
        gender_distribution: { male: number; female: number };
        city_tier: string;
        income_level: string;
      };
    };
    analysis: {
      basic_profile: Record<string, string>;
      interest_tags: string[];
      content_preferences: Record<string, any>;
      pain_points: string[];
      communication_strategy: Record<string, string>;
    };
  } | null;
  created_at: string;
}

/* ── Color palette ── */
const palette = {
  bg: "bg-gray-50",
  card: "bg-white rounded-2xl border border-gray-100 shadow-sm",
  cardHover: "hover:shadow-md hover:border-gray-200 transition-all duration-300",
  accent: "text-blue-600",
  accentBg: "bg-blue-50",
};

const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
];

const icons: Record<string, string> = {
  "年龄范围": "👤", "性别": "⚧", "城市分布": "📍", "收入水平": "💰",
  "教育背景": "🎓", "职业类型": "💼", "家庭状况": "🏠", "消费特征": "🛒", "生活方式": "🌴",
};

export default function PersonaDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<PersonaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    personaApi.get(id as string).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">画像不存在</p>
        <Link href="/personas" className="text-blue-500 font-medium mt-2 inline-block hover:text-blue-600">返回列表</Link>
      </div>
    );
  }

  const a = data.result?.analysis;
  const r = data.result?.raw_data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ── Back ── */}
        <Link href="/personas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          返回画像库
        </Link>

        {/* ══════════ HERO HEADER ══════════ */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          {/* 装饰背景 */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.05] rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/3" />
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          </div>

          <div className="relative px-8 py-10">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-4xl font-bold text-white shrink-0">
                {data.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-3xl font-bold text-white tracking-tight">{data.title}</h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    已完成
                  </span>
                </div>
                <p className="text-blue-100/80 text-sm mt-2 max-w-2xl">{data.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  {data.platforms.map((p) => (
                    <span key={p} className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── KPI Cards ── */}
            {r && (
              <div className="grid grid-cols-3 gap-4 mt-8">
                <KpiCard icon="📊" value={String(r.total_posts)} label="采集文章" color="bg-blue-500" />
                <KpiCard icon="🌐" value={String(r.platforms_scraped?.length || 0)} label="数据源" color="bg-violet-500" />
                <KpiCard icon="🔑" value={String(r.sample_keywords?.length || 0)} label="关键词" color="bg-emerald-500" />
              </div>
            )}
          </div>
        </div>

        {/* ══════════ CONTENT GRID ══════════ */}
        {a && (
          <div className="space-y-6">
            {/* ── 基础画像 ── */}
            <Section title="基础画像" icon="👤">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(a.basic_profile).map(([k, v], i) => (
                  <div key={k} className={`${palette.card} ${palette.cardHover} p-5 group cursor-default`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg" style={{ background: gradients[i % gradients.length] }}>
                        {icons[k] || "📌"}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{k}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{String(v)}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 兴趣标签 + 人群分布 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 兴趣标签 */}
              <div className="lg:col-span-2">
                <Section title="兴趣标签" icon="🏷️">
                  <div className="flex flex-wrap gap-3">
                    {a.interest_tags.map((tag, i) => (
                      <span key={i} className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg cursor-default hover:scale-105 transition-transform" style={{ background: gradients[i % gradients.length] }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {r?.sample_keywords && r.sample_keywords.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">爬取高频词</p>
                      <div className="flex flex-wrap gap-2">
                        {r.sample_keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Section>
              </div>

              {/* 人群特征 */}
              <div className="lg:col-span-1">
                <Section title="人群特征" icon="📊">
                  <div className="space-y-5">
                    {/* 性别环形图 */}
                    {r?.demographic_hints?.gender_distribution && (
                      <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 shrink-0">
                          <svg width="100%" height="100%" viewBox="0 0 36 36" className="-rotate-90">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="3"
                              strokeDasharray={`${Math.round(r.demographic_hints.gender_distribution.male * 100)} ${Math.round(r.demographic_hints.gender_distribution.female * 100)}`}
                              strokeLinecap="round" />
                            <circle cx="18" cy="18" r="10" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                            <circle cx="18" cy="18" r="10" fill="none" stroke="#ec4899" strokeWidth="3"
                              strokeDasharray={`${Math.round(r.demographic_hints.gender_distribution.female * 100)} ${Math.round(r.demographic_hints.gender_distribution.male * 100)}`}
                              strokeLinecap="round"
                              strokeDashoffset={-Math.round(r.demographic_hints.gender_distribution.male * 100)} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-800">{Math.round(r.demographic_hints.gender_distribution.female * 100)}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-xs text-gray-600">男性</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-pink-500" />
                            <span className="text-xs text-gray-600">女性</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 人群属性 */}
                    <div className="space-y-3">
                      <BarItem label="年龄" value={r?.demographic_hints.age_range || "25-35"} pct={85} gradient="from-blue-500 to-cyan-400" />
                      <BarItem label="城市" value={r?.demographic_hints.city_tier || "一二线"} pct={72} gradient="from-violet-500 to-purple-400" />
                      <BarItem label="收入" value={r?.demographic_hints.income_level || "中高"} pct={68} gradient="from-emerald-500 to-teal-400" />
                    </div>
                  </div>
                </Section>
              </div>
            </div>

            {/* ── 内容偏好 ── */}
            <Section title="内容偏好" icon="📋">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(a.content_preferences).map(([k, v], i) => (
                  <div key={k} className="relative overflow-hidden rounded-xl bg-gray-50 p-5 border border-gray-100 hover:bg-white hover:border-gray-200 transition-all">
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: gradients[i % gradients.length] }} />
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{k}</p>
                    <p className="text-sm font-bold text-gray-900 mt-2 leading-snug">
                      {Array.isArray(v) ? (v as string[]).join(" · ") : String(v)}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 痛点 + 策略 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="痛点分析" icon="⚠️">
                <div className="space-y-3">
                  {a.pain_points.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-white border border-rose-100/50 hover:from-rose-100 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed pt-1">{item}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="传播策略" icon="💡">
                <div className="space-y-3">
                  {Object.entries(a.communication_strategy).map(([k, v], i) => {
                    const colors = [
                      { from: "from-blue-500", to: "to-cyan-400", dot: "bg-blue-500" },
                      { from: "from-violet-500", to: "to-purple-400", dot: "bg-violet-500" },
                      { from: "from-emerald-500", to: "to-teal-400", dot: "bg-emerald-500" },
                      { from: "from-amber-500", to: "to-orange-400", dot: "bg-amber-500" },
                    ];
                    const c = colors[i % colors.length];
                    return (
                      <div key={k} className="p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{k}</p>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed pl-5">{String(v)}</p>
                      </div>
                    );
                  })}
                </div>
              </Section>
            </div>

            {/* ── CTA ── */}
            <div className="flex justify-center pt-6 pb-4">
              <Link
                href={`/optimize?persona_id=${data.id}`}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-12 py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                </svg>
                <span className="relative z-10 text-base">基于此画像进行内容优化</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Components ─── */

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className={`${palette.card} overflow-hidden`}>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function KpiCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-2xl font-bold text-white leading-none">{value}</p>
          <p className="text-xs text-blue-100/70 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}

function BarItem({ label, value, pct, gradient }: { label: string; value: string; pct: number; gradient: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xs font-bold text-gray-800">{value}</p>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
