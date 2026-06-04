"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { optimizeApi, personaApi } from "@/lib/api";

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

export default function OptimizeDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<OptimizationDetail | null>(null);
  const [personaTitle, setPersonaTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = () => {
    optimizeApi.get(id as string).then((res) => {
      setData(res.data);
      personaApi.get(res.data.persona_id).then((p) => {
        setPersonaTitle(p.data.title);
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleGenerateImage = async () => {
    setGenerating(true);
    try {
      await optimizeApi.generateImage(id as string);
      await load();
    } finally {
      setGenerating(false);
    }
  };

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
        <Link href="/optimize" className="text-[#0071e3] font-medium mt-2 inline-block hover:text-[#0077ed]">
          返回
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <Link
        href="/optimize"
        className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors"
      >
        ← 返回
      </Link>

      <div className="card overflow-hidden mt-4">
        <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-bold text-[#1d1d1f]">优化结果</h1>
              {personaTitle && (
                <p className="text-[13px] text-[#86868b] mt-0.5">
                  目标画像：<span className="text-[#0071e3] font-medium">{personaTitle}</span>
                </p>
              )}
            </div>
            {data.status === "completed" ? (
              <span className="badge bg-[#f0fdf4] text-[#16a34a]">
                <span className="badge-dot bg-[#16a34a]" />
                已完成
              </span>
            ) : (
              <span className="badge bg-[#fefce8] text-[#ca8a04]">
                <div className="badge-dot bg-[#ca8a04] animate-pulse" />
                处理中
              </span>
            )}
          </div>
        </div>

        {(data.image_urls?.length > 0 || data.generated_image) && (
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.04)]">
            <p className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider mb-3">配图</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {data.image_urls?.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`配图 ${i + 1}`}
                  className="h-36 w-auto rounded-xl object-cover border border-[rgba(0,0,0,0.06)] shrink-0"
                />
              ))}
              {data.generated_image && (
                <div className="relative shrink-0">
                  <img
                    src={data.generated_image}
                    alt="AI生成图片"
                    className="h-36 w-auto rounded-xl object-cover border border-[rgba(0,0,0,0.06)]"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#0071e3]/90 text-white text-[9px] font-medium">
                    AI
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 border-r border-[rgba(0,0,0,0.04)]">
            <p className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider mb-3">原始内容</p>
            <div className="text-[14px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">
              {data.original_content}
            </div>
          </div>
          <div className="p-6 bg-[#fafafa]">
            <p className="text-[11px] text-[#16a34a] font-medium uppercase tracking-wider mb-3">优化后内容</p>
            <div className="text-[14px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">
              {data.optimized_content || (
                <span className="inline-flex items-center gap-2 text-[#86868b]">
                  <div className="w-4 h-4 border-2 border-[#86868b] border-t-transparent rounded-full animate-spin" />
                  处理中...
                </span>
              )}
            </div>
          </div>
        </div>

        {data.status === "completed" && (
          <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.04)] bg-[#fafafa] flex items-center justify-end gap-2">
            <button
              onClick={handleGenerateImage}
              disabled={generating}
              className="btn-primary text-[13px] inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                  {data.generated_image ? "重新生成封面图" : "生成封面图"}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
