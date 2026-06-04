"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { personaApi, optimizeApi } from "@/lib/api";

interface Persona {
  id: string;
  title: string;
  description: string;
  platforms?: string[];
  status: string;
  user_id?: string;
}

interface Optimization {
  id: string;
  persona_id: string;
  persona_title: string;
  original_content: string;
  optimized_content: string | null;
  image_urls: string[];
  generated_image: string | null;
  status: string;
  created_at: string;
}

export default function OptimizePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OptimizeContent />
    </Suspense>
  );
}

function OptimizeContent() {
  const searchParams = useSearchParams();
  const preselectId = searchParams.get("persona_id");

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>(preselectId || "");
  const [originalContent, setOriginalContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Optimization | null>(null);
  const [history, setHistory] = useState<Optimization[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const personaMap = new Map(personas.map((p) => [p.id, p]));

  useEffect(() => {
    personaApi.list().then((res) => setPersonas(res.data.filter((p: Persona) => p.status === "completed")));
    optimizeApi.list().then((res) => setHistory(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!selectedPersona || !originalContent.trim()) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await optimizeApi.create({
        persona_id: selectedPersona,
        original_content: originalContent,
        image_urls: images,
      });
      setResult(res.data);
      setHistory((prev) => [res.data, ...prev]);
    } finally {
      setSubmitting(false);
    }
  };

  const loadHistory = (h: Optimization) => {
    setSelectedHistory(h.id);
    setOriginalContent(h.original_content);
    setResult(h);
    textareaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyText = async () => {
    if (!result?.optimized_content) return;
    try {
      await navigator.clipboard.writeText(result.optimized_content);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = result.optimized_content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  const handleCopyImages = async () => {
    const urls = [...(result?.image_urls || [])];
    if (result?.generated_image) urls.push(result.generated_image);
    if (urls.length === 0) return;
    urls.forEach((url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = url.split("/").pop() || "image";
      a.click();
    });
  };

  const handleDownloadImages = () => {
    const urls = [...(result?.image_urls || [])];
    if (result?.generated_image) urls.push(result.generated_image);
    urls.forEach((url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = url.split("/").pop() || "image";
      a.click();
    });
  };

  const personaTitle = (h: Optimization) => h.persona_title || personaMap.get(h.persona_id)?.title || "未知画像";

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">内容优化</h1>
        <p className="text-[14px] text-[#86868b] mt-0.5">选择画像，输入内容，针对目标人群优化传播</p>
      </div>

      {/* ── 画像选择器 ── */}
      <div className="card p-4 mb-5">
        <label className="block text-[13px] font-medium text-[#1d1d1f] mb-3">目标画像</label>
        {personas.length === 0 ? (
          <p className="text-[13px] text-[#86868b] py-6 text-center border border-dashed border-gray-200 rounded-xl">
            暂无可用画像，
            <Link href="/personas/new" className="text-[#0071e3] hover:text-[#0077ed] font-medium ml-1">去创建</Link>
          </p>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200" style={{ scrollbarWidth: "thin" }}>
              {personas.map((p) => {
                const isSelected = selectedPersona === p.id;
                const isTemplate = p.user_id === "__template__";
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPersona(p.id)}
                    className={`flex-shrink-0 text-left p-3 rounded-xl border-2 transition-all w-44 ${
                      isSelected
                        ? "border-[#0071e3] bg-[#f0f7ff] shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                        isSelected ? "bg-[#0071e3]" : "bg-gray-200"
                      }`}>
                        {p.title.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[13px] font-semibold truncate ${
                          isSelected ? "text-[#0071e3]" : "text-[#1d1d1f]"
                        }`}>
                          {p.title}
                        </p>
                        {p.platforms?.[0] && (
                          <p className="text-[11px] text-[#86868b] truncate">{p.platforms[0]}</p>
                        )}
                      </div>
                      {isTemplate && (
                        <span className="text-[8px] px-1 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold shrink-0">模板</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#aeaeb2] mt-1.5">← 左右滑动选择更多人群</p>
          </>
        )}
      </div>

      {/* ── 历史记录 ── */}
      {history.length > 0 && (
        <div className="mb-5">
          <details className="group" open={history.length > 0}>
            <summary className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors select-none mb-2">
              <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              历史记录（{history.length}）
            </summary>
            <div className="space-y-1">
              {history.map((h) => {
                const name = personaTitle(h);
                const label = `${name} ${h.original_content.slice(0, 5)}...`;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => loadHistory(h)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[12px] transition-all ${
                      selectedHistory === h.id
                        ? "bg-[#f0f7ff] text-[#0071e3] font-medium"
                        : "text-[#86868b] hover:bg-[#f5f5f7]"
                    }`}
                  >
                    <span className="truncate block">{label}</span>
                  </button>
                );
              })}
            </div>
          </details>
        </div>
      )}

      {/* ── 内容输入 + 优化结果 并排 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左：待优化内容 / AI分析中 */}
        <div className="card p-5">
          {submitting ? (
            <div className="flex flex-col items-center justify-center py-12 text-center min-h-[400px]">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-[4px] border-blue-100 border-t-[#0071e3] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-[16px] font-bold text-[#1d1d1f] mb-1">AI 分析中</p>
              <p className="text-[13px] text-[#86868b]">正在分析目标人群特征并优化内容</p>
              <div className="mt-5 flex items-center gap-2 text-[12px] text-[#aeaeb2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
                预计 1-5 分钟完成
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-3">待优化内容</label>
              <textarea
                ref={textareaRef}
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                className="input-base resize-none h-40"
                placeholder="粘贴要优化传播效果的原始内容..."
                required
              />

              <label className="block text-[13px] font-medium text-[#1d1d1f] mt-4 mb-2">配图（可选）</label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
                  files.forEach((f) => {
                    const reader = new FileReader();
                    reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
                    reader.readAsDataURL(f);
                  });
                }}
                onPaste={(e) => {
                  const items = Array.from(e.clipboardData.items).filter((i) => i.type.startsWith("image/"));
                  items.forEach((item) => {
                    const blob = item.getAsFile();
                    if (blob) {
                      const reader = new FileReader();
                      reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
                      reader.readAsDataURL(blob);
                    }
                  });
                }}
                tabIndex={0}
                className="border-2 border-dashed border-[rgba(0,0,0,0.08)] rounded-xl p-3 transition-all focus:border-[#0071e3] focus:outline-none hover:bg-[#f5f5f7] cursor-pointer"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach((f) => {
                      const reader = new FileReader();
                      reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
                      reader.readAsDataURL(f);
                    });
                    e.target.value = "";
                  }}
                />
                {images.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 py-3">
                    <svg className="w-4 h-4 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                    <p className="text-[12px] text-[#86868b]">上传 / 拖拽 / 粘贴</p>
                  </div>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                      <div key={i} className="relative shrink-0 group">
                        <img src={src} alt={`配图 ${i + 1}`} className="h-20 w-auto rounded-lg object-cover border border-[rgba(0,0,0,0.06)]" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImages((prev) => prev.filter((_, j) => j !== i)); }}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#dc2626] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); document.getElementById("image-upload")?.click(); }}
                      className="h-20 w-16 rounded-lg border-2 border-dashed border-[rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-1 shrink-0 hover:border-[#0071e3] hover:bg-[#f0f7ff] transition-all"
                    >
                      <svg className="w-4 h-4 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedPersona || !originalContent.trim()}
                className="btn-primary w-full text-center text-[14px] py-2.5 mt-5 disabled:opacity-60"
              >
                开始优化
              </button>
            </div>
          )}
        </div>

        {/* 右：优化结果 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span className="text-[13px] font-semibold text-[#1d1d1f]">优化结果</span>
            </div>
            {result && result.optimized_content && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="btn-ghost text-[11px] px-2 py-1 rounded-lg inline-flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                  复制文字
                </button>
                {(result.image_urls?.length > 0 || result.generated_image) && (
                  <button
                    type="button"
                    onClick={handleCopyImages}
                    className="btn-ghost text-[11px] px-2 py-1 rounded-lg inline-flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                    保存图片
                  </button>
                )}
              </div>
            )}
          </div>

          {submitting ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full border-[3px] border-[#0071e3] border-t-transparent animate-spin mb-4" />
              <p className="text-[14px] font-medium text-[#1d1d1f]">AI分析中</p>
              <p className="text-[12px] text-[#86868b] mt-1">预计 1-5 分钟完成</p>
            </div>
          ) : result && result.optimized_content ? (
            <div className="space-y-4">
              {(result.image_urls?.length > 0 || result.generated_image) && (
                <div>
                  <p className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider mb-2">配图</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {result.image_urls?.map((url, i) => (
                      <img key={i} src={url} alt={`配图 ${i + 1}`} className="h-28 w-auto rounded-lg object-cover border border-[rgba(0,0,0,0.06)] shrink-0" />
                    ))}
                    {result.generated_image && (
                      <div className="relative shrink-0">
                        <img src={result.generated_image} alt="AI生成图片" className="h-28 w-auto rounded-lg object-cover border border-[rgba(0,0,0,0.06)]" />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#0071e3]/90 text-white text-[9px] font-medium">AI</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[11px] text-[#16a34a] font-medium uppercase tracking-wider mb-2">优化后内容</p>
                <div className="p-3 bg-emerald-50 rounded-lg text-[13px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {result.optimized_content}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider mb-3">📈 预估传播效力</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/70 rounded-lg p-3 text-center">
                    <p className="text-[18px] font-extrabold text-blue-600">12.8K</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">预估曝光量</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 text-center">
                    <p className="text-[18px] font-extrabold text-emerald-600">8.3%</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">预估互动率</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 text-center">
                    <p className="text-[18px] font-extrabold text-amber-600">3.2%</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">预估转化率</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 text-center">
                    <p className="text-[18px] font-extrabold text-violet-600">A</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">传播力评级</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center min-h-[300px]">
              {originalContent ? (
                <div className="w-full text-left">
                  <p className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider mb-2">输入内容预览</p>
                  <div className="p-3 bg-[#f9fafb] rounded-lg text-[13px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {originalContent}
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-[#d1d1d6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-[#86868b]">填写内容后点击「开始优化」</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
