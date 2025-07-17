"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import PublicIcon from "@mui/icons-material/Public";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const locale = params?.locale || "zh";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeLocale = (newLocale: string) => {
    setAnchorEl(null);
    if (newLocale === locale) return;
    // 替换 URL 中的 locale 部分
    const segments = pathname.split("/");
    if (segments[1] === "zh" || segments[1] === "en") {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/"));
  };

  return (
    <SessionProvider>
      <div style={{ position: "fixed", top: 16, right: 24, zIndex: 1000 }}>
        <IconButton
          aria-label="language"
          onClick={handleClick}
          size="large"
          sx={{ color: "#38B2AC", background: "#fff", boxShadow: 2 }}
        >
          <PublicIcon fontSize="large" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            selected={locale === "zh"}
            onClick={() => handleChangeLocale("zh")}
          >
            中文
          </MenuItem>
          <MenuItem
            selected={locale === "en"}
            onClick={() => handleChangeLocale("en")}
          >
            English
          </MenuItem>
        </Menu>
      </div>
      {children}
    </SessionProvider>
  );
}
