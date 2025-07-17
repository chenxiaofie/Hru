"use client";
import dynamic from "next/dynamic";
const SettingsPageClient = dynamic(() => import("./SettingsPageClient"), {
  ssr: false,
});

export default function Page() {
  return <SettingsPageClient />;
}
