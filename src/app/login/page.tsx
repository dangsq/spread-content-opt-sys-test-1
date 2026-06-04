"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      router.push("/");
    } catch {
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
          <h1 className="text-[24px] font-bold text-[#1d1d1f] tracking-tight">欢迎回来</h1>
          <p className="text-[14px] text-[#86868b] mt-1">登录以继续使用</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-base"
                placeholder="输入用户名"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base"
                placeholder="输入密码"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center text-[14px] py-2.5 disabled:opacity-60"
            >
              {loading ? "登录中..." : "登录"}
            </button>
            <p className="text-[13px] text-center text-[#86868b]">
              没有账号？
              <Link href="/register" className="text-[#0071e3] hover:text-[#0077ed] font-medium ml-1">
                注册
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
