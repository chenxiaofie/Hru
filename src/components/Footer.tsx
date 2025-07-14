"use client";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 2,
        mt: "auto",
        bgcolor: "transparent",
      }}
    >
      <Typography variant="caption" color="#4FC3F7" fontWeight={600}>
        HRU · 安心提醒 · {new Date().getFullYear()}
      </Typography>
      <br />
      <Typography variant="caption" color="#4FC3F7">
        作者：Feifei Chen &lt;feifeichen1999@gmail.com&gt;
      </Typography>
    </Box>
  );
}
