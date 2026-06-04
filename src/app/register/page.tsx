"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "注册失败");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#0071e3] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold text-[#1d1d1f] tracking-tight">创建账号</h1>
          <p className="text-[14px] text-[#86868b] mt-1">注册以开始使用</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-[#fef2f2] rounded-xl px-4 py-3 text-[13px] text-[#dc2626]">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-base"
                placeholder="设置用户名"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base"
                placeholder="设置密码"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center text-[14px] py-2.5 disabled:opacity-60"
            >
              {loading ? "注册中..." : "注册"}
            </button>
            <p className="text-[13px] text-center text-[#86868b]">
              已有账号？
              <Link href="/login" className="text-[#0071e3] hover:text-[#0077ed] font-medium ml-1">
                登录
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
