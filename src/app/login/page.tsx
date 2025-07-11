"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import { Card, CardContent, Stack, Avatar } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const userId =
      session?.user && "userId" in session.user
        ? (session.user as { userId: string }).userId
        : undefined;
    if (status === "authenticated" && userId) {
      fetch("/api/gen-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("hru_token", data.token);
            router.replace("/"); // 写入后再跳转
          }
        });
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>加载中...</div>;
  }

  if (status === "authenticated") {
    return <div>已登录，正在跳转首页...</div>;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await signIn("email", { email, redirect: false });
    if (res?.ok) {
      setMessage("登录链接已发送到邮箱，请查收邮件完成登录。");
    } else {
      setMessage("登录失败，请重试。");
    }
    setLoading(false);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        background:
          "linear-gradient(135deg, #4FC3F7 0%, #38B2AC 60%, #388E3C 100%)",
        transition: "background 0.5s",
      }}
      p={2}
    >
      <Stack alignItems="center" spacing={2} mb={2}>
        <Avatar sx={{ bgcolor: "#fff", width: 64, height: 64, boxShadow: 2 }}>
          <ShieldIcon color="primary" sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography
          variant="h4"
          fontWeight={900}
          color="#fff"
          letterSpacing={2}
          align="center"
          sx={{
            mb: 1,
            textShadow: "0 2px 8px rgba(56,178,172,0.10)",
          }}
        >
          邮箱登录
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          color="rgba(255,255,255,0.92)"
          fontWeight={400}
          mb={2}
          sx={{ letterSpacing: 1 }}
        >
          请输入邮箱，系统将发送魔法登录链接到您的邮箱
        </Typography>
      </Stack>
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          boxShadow: 4,
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(2px)",
        }}
      >
        <CardContent>
          <form onSubmit={handleLogin}>
            <TextField
              label="请输入邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                borderRadius: 3,
                fontWeight: 600,
                background: "linear-gradient(90deg, #38B2AC 0%, #388E3C 100%)",
                color: "#fff",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #388E3C 0%, #38B2AC 100%)",
                },
              }}
            >
              {loading ? "发送中..." : "发送登录链接"}
            </Button>
          </form>
          {message && (
            <Typography color="success.main" mt={2} align="center">
              {message}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
