"use client";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const params = useParams();
  const locale = params.locale || "zh";
  const t = useTranslations();
  const [lastVisit, setLastVisit] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasToken(!!localStorage.getItem("hru_token"));
    const last = localStorage.getItem("hru_last_visit");
    setLastVisit(last ? new Date(last) : null);
  }, []);

  const handlePunch = async () => {
    const token = localStorage.getItem("hru_token");
    if (!token) {
      setMessage(t("please_login"));
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
          {t("title")}
        </Typography>
        <Typography variant="subtitle1" color="#fff" fontWeight={400}>
          {t("start")}
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
          {t("desc1")}
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} mb={1} color="primary">
          {t("usage")}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          {t("step1")}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          {t("step2")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("step3")}
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
                  fontSize: 20,
                  fontWeight: 700,
                  boxShadow: 3,
                  mb: 1,
                  textTransform: "none",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  lineHeight: 1.2,
                  padding: 1,
                }}
                startIcon={<FavoriteIcon sx={{ fontSize: 36 }} />}
                onClick={handlePunch}
              >
                {t("health_check")}
              </Button>
              {lastVisit && mounted && (
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {t("last_check")}
                  {lastVisit.toLocaleString()}
                </Typography>
              )}
              {message && <Alert severity="info">{message}</Alert>}
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ borderRadius: 3, mt: 2, fontWeight: 600 }}
                onClick={() => router.push(`/${locale}/settings`)}
                fullWidth
              >
                {t("manage_contacts")}
              </Button>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: 3, fontWeight: 600 }}
                onClick={() => router.push(`/${locale}/login`)}
              >
                {t("login")}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ borderRadius: 3, fontWeight: 600 }}
                onClick={() => router.push(`/${locale}/settings`)}
              >
                {t("anon_experience")}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      <Typography variant="caption" color="#fff" mt={4}>
        hru · {t("安心提醒")} · {new Date().getFullYear()}
      </Typography>
      <Typography variant="caption" color="#fff" mt={1}>
        {t("author")}
      </Typography>
      <ThemedSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={t("punch_success")}
        autoHideDuration={1800}
      />
    </Box>
  );
}
