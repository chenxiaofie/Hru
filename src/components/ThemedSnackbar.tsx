import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import React from "react";

const GradientBar = styled("div")(() => ({
  background:
    "linear-gradient(120deg,rgb(19, 78, 106) 0%, #38B2AC 60%, #388E3C 100%)",
  color: "#fff",
  borderRadius: 24,
  fontWeight: 700,
  fontSize: 18,
  minHeight: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 24px rgba(56, 249, 215, 0.10)",
  maxWidth: 400,
  width: "90vw",
  margin: "0 auto",
  padding: "0 24px",
  position: "relative",
}));

interface ThemedSnackbarProps {
  open: boolean;
  onClose: (_event?: React.SyntheticEvent | Event, reason?: string) => void;
  message: string;
  autoHideDuration?: number;
}

export default function ThemedSnackbar({
  open,
  onClose,
  message,
  autoHideDuration = 1800,
}: ThemedSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        top: { xs: 16, sm: 32 },
      }}
    >
      <GradientBar>
        <span style={{ flex: 1, textAlign: "center" }}>{message}</span>
        <IconButton
          size="small"
          aria-label="close"
          onClick={onClose}
          sx={{ color: "#fff", ml: 1 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </GradientBar>
    </Snackbar>
  );
}
