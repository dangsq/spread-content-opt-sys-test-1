"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { personaApi } from "@/lib/api";

const PLATFORM_OPTIONS = [
  { value: "微博", emoji: "📱" },
  { value: "小红书", emoji: "📕" },
  { value: "抖音", emoji: "🎵" },
  { value: "知乎", emoji: "❓" },
  { value: "B站", emoji: "📺" },
  { value: "微信公众号", emoji: "💬" },
];

export default function NewPersonaPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform) return;
    setLoading(true);
    try {
      const res = await personaApi.create({ title, description, platform });
      router.push(`/personas/detail?id=${res.data.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-up">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">新建分析任务</h1>
        <p className="text-[14px] text-[#86868b] mt-0.5">描述目标人群，选择目标平台，系统将自动采集分析</p>
      </div>
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">任务名称</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-base"
              placeholder="例如：一线城市职场女性"
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">目标人群描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-base resize-none h-28"
              placeholder="描述目标人群特征，如年龄、职业、兴趣、消费习惯..."
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-2">
              目标平台 <span className="text-[#dc2626]">*必选</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORM_OPTIONS.map(({ value, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPlatform(value)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all border ${
                    platform === value
                      ? "bg-[#0071e3] text-white border-[#0071e3] shadow-sm"
                      : "bg-[#f5f5f7] text-[#86868b] border-transparent hover:bg-[#eeeeef]"
                  }`}
                >
                  <span>{emoji}</span>
                  {value}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !platform}
            className="btn-primary w-full text-center text-[14px] py-2.5 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                分析中...
              </span>
            ) : "开始分析"}
          </button>
        </form>
      </div>
    </div>
  );
}
