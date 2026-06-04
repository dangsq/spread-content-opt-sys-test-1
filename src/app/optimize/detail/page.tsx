"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { optimizeApi, personaApi } from "@/lib/api";

export default function OptimizeDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" /></div>}>
      <OptimizeDetailInner />
    </Suspense>
  );
}

interface OptimizationDetail {
  id: string;
  persona_id: string;
  original_content: string;
  optimized_content: string | null;
  image_urls: string[];
  generated_image: string | null;
  status: string;
  created_at: string;
}

function OptimizeDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState<OptimizationDetail | null>(null);
  const [personaTitle, setPersonaTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    optimizeApi.get(id).then((res) => {
      setData(res.data);
      personaApi.get(res.data.persona_id).then((p) => setPersonaTitle(p.data.title));
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-[#86868b]">记录不存在</p>
        <Link href="/optimize" className="text-[#0071e3] font-medium mt-2 inline-block hover:text-[#0077ed]">返回</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <Link href="/optimize" className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">← 返回</Link>

      <div className="card overflow-hidden mt-4">
        <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-bold text-[#1d1d1f]">优化结果</h1>
              {personaTitle && <p className="text-[13px] text-[#86868b] mt-0.5">目标画像：<span className="text-[#0071e3] font-medium">{personaTitle}</span></p>}
            </div>
            <span className={`badge ${data.status === "completed" ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-[#fefce8] text-[#ca8a04]"}`}>
              <span className={`badge-dot ${data.status === "completed" ? "bg-[#16a34a]" : "bg-[#ca8a04] animate-pulse"}`} />
              {data.status === "completed" ? "已完成" : "处理中"}
            </span>
          </div>
        </div>

        {(data.image_urls?.length > 0 || data.generated_image) && (
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.04)]">
            <p className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider mb-3">配图</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {data.image_urls?.map((url, i) => (
                <img key={i} src={url} alt={`配图 ${i + 1}`} className="h-32 w-auto rounded-xl object-cover border border-[rgba(0,0,0,0.06)] shrink-0" />
              ))}
              {data.generated_image && (
                <div className="relative shrink-0">
                  <img src={data.generated_image} alt="AI生成图片" className="h-32 w-auto rounded-xl object-cover border border-[rgba(0,0,0,0.06)]" />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#0071e3]/90 text-white text-[9px] font-medium">AI</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 border-r border-[rgba(0,0,0,0.04)]">
            <p className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider mb-3">原始内容</p>
            <div className="text-[14px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">{data.original_content}</div>
          </div>
          <div className="p-6 bg-[#fafafa]">
            <p className="text-[11px] text-[#16a34a] font-medium uppercase tracking-wider mb-3">优化后内容</p>
            <div className="text-[14px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">
              {data.optimized_content || (
                <span className="inline-flex items-center gap-2 text-[#86868b]">
                  <div className="w-4 h-4 border-2 border-[#86868b] border-t-transparent rounded-full animate-spin" />处理中...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
