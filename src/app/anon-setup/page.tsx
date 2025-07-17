"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnonSetupPage() {
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem("hru_name");
    if (savedName && !name) {
      setName(savedName);
    }
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/anon-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contactEmail }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("hru_token", data.token);
      localStorage.setItem("hru_name", name); // 注册成功后保存 name
      router.push("/settings");
    } else {
      setError(data.error || "注册失败");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">免登录设置</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border p-2 mr-2 rounded w-32"
          placeholder="我的称呼（紧急联系人收到提醒时看到的名字，如：小明、王磊、妈妈）"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 mr-2 rounded w-48"
          placeholder="紧急联系人邮箱"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "提交中..." : "提交"}
        </button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
