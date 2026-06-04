"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { personaApi } from "@/lib/api";

interface Persona {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  platforms?: string[];
  user_id?: string;
}

const STATUS_ICONS: Record<string, { icon: string; bg: string; text: string; pulse?: string }> = {
  completed: { icon: "✓", bg: "bg-[#f0fdf4]", text: "text-[#16a34a]" },
  analyzing: { icon: "◌", bg: "bg-[#fefce8]", text: "text-[#ca8a04]", pulse: "animate-pulse" },
  pending: { icon: "○", bg: "bg-[#f5f5f7]", text: "text-[#86868b]" },
  failed: { icon: "✕", bg: "bg-[#fef2f2]", text: "text-[#dc2626]" },
};

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    personaApi.list().then((res) => {
      setPersonas(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await personaApi.delete(id);
    load();
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">用户画像</h1>
        <p className="text-[14px] text-[#86868b] mt-0.5">管理画像分析任务</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 模板画像在前 */}
          {personas
            .filter((p) => p.user_id === "__template__")
            .concat(personas.filter((p) => p.user_id !== "__template__"))
            .map((p, i) => {
              const isTemplate = p.user_id === "__template__";
              return (
                <div
                  key={p.id}
                  className="card p-5 flex flex-col justify-between min-h-[180px] animate-fade-up group"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        href={`/personas/detail?id=${p.id}`}
                        className="text-[15px] font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors leading-snug truncate"
                      >
                        {p.title}
                      </Link>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        isTemplate
                          ? "bg-[#f0f7ff] text-[#0071e3]"
                          : `${STATUS_ICONS[p.status]?.bg || "bg-[#f5f5f7]"} ${STATUS_ICONS[p.status]?.text || "text-[#86868b]"}`
                      } text-[10px] font-medium`}>
                        {isTemplate ? (
                          "模板"
                        ) : (
                          <>
                            <span className={`w-1.5 h-1.5 rounded-full bg-current ${STATUS_ICONS[p.status]?.pulse || ""}`} />
                            {p.status === "completed" ? "已完成" : p.status === "analyzing" ? "分析中" : p.status === "failed" ? "失败" : "待处理"}
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-[12px] text-[#86868b] leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2">
                      {p.platforms?.slice(0, 3).map((pl) => (
                        <span key={pl} className="text-[10px] px-2 py-0.5 rounded bg-[#f5f5f7] text-[#86868b]">
                          {pl}
                        </span>
                      ))}
                      {(p.platforms?.length || 0) > 3 && (
                        <span className="text-[10px] text-[#aeaeb2]">+{p.platforms!.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/personas/detail?id=${p.id}`}
                        className="btn-ghost p-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </Link>
                      {!isTemplate && (
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn-ghost p-1.5 hover:text-[#dc2626]"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          {/* + 新建卡片放在最后 */}
          <Link
            href="/personas/new"
            className="card border-2 border-dashed border-[rgba(0,0,0,0.08)] hover:border-[#0071e3] hover:bg-[#f0f7ff] flex flex-col items-center justify-center min-h-[180px] transition-all animate-fade-up group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#0071e3]/10 transition-colors mb-3">
              <svg className="w-5 h-5 text-[#86868b] group-hover:text-[#0071e3] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-[#86868b] group-hover:text-[#0071e3] transition-colors">新建画像分析</p>
          </Link>
        </div>
      )}
    </div>
  );
}
