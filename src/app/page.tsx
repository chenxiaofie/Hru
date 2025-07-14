"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Avatar,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShieldIcon from "@mui/icons-material/Shield";
import ThemedSnackbar from "../components/ThemedSnackbar";

export default function HomePage() {
  const router = useRouter();
  const [lastVisit, setLastVisit] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem("hru_token"));
    const last = localStorage.getItem("hru_last_visit");
    setLastVisit(last ? new Date(last) : null);
  }, []);

  const handlePunch = async () => {
    const token = localStorage.getItem("hru_token");
    if (!token) {
      setMessage("请先注册或登录");
      return;
    }
    await fetch("/api/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
    const now = new Date();
    localStorage.setItem("hru_last_visit", now.toISOString());
    setLastVisit(now);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(135deg, #4FC3F7 0%, #81C784 100%)",
        transition: "background 0.5s",
      }}
      p={2}
    >
      <Stack alignItems="center" spacing={2} mb={2}>
        <Avatar sx={{ bgcolor: "#fff", width: 72, height: 72, boxShadow: 2 }}>
          <ShieldIcon color="primary" sx={{ fontSize: 48 }} />
        </Avatar>
        <Typography
          variant="h4"
          fontWeight={700}
          color="#fff"
          letterSpacing={2}
        >
          HRU 安心提醒
        </Typography>
        <Typography variant="subtitle1" color="#fff" fontWeight={400}>
          每日一按，亲友安心无忧💖
        </Typography>
      </Stack>
      <Box
        maxWidth={480}
        width="100%"
        bgcolor="rgba(255,255,255,0.92)"
        borderRadius={4}
        boxShadow={2}
        p={3}
        mb={4}
        sx={{ textAlign: "left" }}
      >
        <Typography variant="body1" fontWeight={600} mb={1} color="primary">
          HRU
          是一款守护独居、异地亲友安全的在线报平安工具。只需每日一按，亲友安心无忧。
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} mb={1} color="primary">
          使用方法
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          1. 每日点击“打卡”按钮，表示你一切安好。
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          2. 设置紧急联系人邮箱。
        </Typography>
        <Typography variant="body2" color="text.secondary">
          3. 若连续3天未打卡，系统会自动邮件提醒你的紧急联系人。
        </Typography>
      </Box>
      <Card
        sx={{
          mb: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          boxShadow: 4,
          bgcolor: "rgba(255,255,255,0.95)",
        }}
      >
        <CardContent>
          {hasToken ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  fontSize: 24,
                  fontWeight: 700,
                  boxShadow: 3,
                  mb: 1,
                  textTransform: "none",
                }}
                startIcon={<FavoriteIcon sx={{ fontSize: 36 }} />}
                onClick={handlePunch}
              >
                打卡
              </Button>
              {lastVisit && (
                <Typography variant="body2" color="text.secondary" mb={1}>
                  上次打卡：{lastVisit.toLocaleString()}
                </Typography>
              )}
              {message && <Alert severity="info">{message}</Alert>}
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ borderRadius: 3, mt: 2, fontWeight: 600 }}
                onClick={() => router.push("/settings")}
                fullWidth
              >
                设置/管理紧急联系人
              </Button>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: 3, fontWeight: 600 }}
                onClick={() => router.push("/login")}
              >
                登录使用（推荐）
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ borderRadius: 3, fontWeight: 600 }}
                onClick={() => router.push("/settings")}
              >
                免登录使用
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      <Typography variant="caption" color="#fff" mt={4}>
        hru · 安心提醒 · {new Date().getFullYear()}
      </Typography>
      <Typography variant="caption" color="#fff" mt={1}>
        作者：Feifei Chen &lt;feifeichen1999@gmail.com&gt;
      </Typography>
      <ThemedSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={"打卡成功！亲友安心无忧💖"}
        autoHideDuration={1800}
      />
    </Box>
  );
}
