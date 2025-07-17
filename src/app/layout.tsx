import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zhMeta: Metadata = {
  title: "HRU - 健康守护打卡提醒应用",
  description:
    "HRU 是一款专注于健康守护的极简打卡提醒应用，支持健康打卡、紧急联系人、智能邮件提醒、免登录体验等功能。无论是独居老人、异地亲人还是关心健康的你，都能通过 HRU 获得贴心的健康守护。HRU，守护你的每一天。",
  keywords: [
    "健康打卡",
    "健康守护",
    "打卡提醒",
    "紧急联系人",
    "极简应用",
    "健康安全",
    "智能提醒",
    "免登录",
    "HRU",
  ],
  openGraph: {
    title: "HRU - 健康守护打卡提醒应用",
    description:
      "HRU 是一款专注于健康守护的极简打卡提醒应用，支持健康打卡、紧急联系人、智能邮件提醒、免登录体验等功能。HRU，守护你的每一天。",
    url: "https://www.asdlscjjweq.xyz/",
    siteName: "HRU 健康守护",
    images: [
      {
        url: "https://www.asdlscjjweq.xyz/globe.svg",
        width: 1200,
        height: 630,
        alt: "HRU 健康守护打卡提醒应用",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HRU - 健康守护打卡提醒应用",
    description:
      "HRU 是一款专注于健康守护的极简打卡提醒应用，支持健康打卡、紧急联系人、智能邮件提醒、免登录体验等功能。HRU，守护你的每一天。",
    images: ["https://www.asdlscjjweq.xyz/globe.svg"],
    site: "@hru_health",
    creator: "@feifeichen1999",
  },
  metadataBase: new URL("https://www.asdlscjjweq.xyz/"),
  alternates: {
    canonical: "https://www.asdlscjjweq.xyz/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

const enMeta: Metadata = {
  title: "HRU - Health Guardian Check-in App",
  description:
    "HRU is a minimalist health guardian check-in app, supporting daily check-ins, emergency contacts, smart email reminders, and guest mode. Whether you live alone, have distant family, or care about health, HRU provides peace of mind every day.",
  keywords: [
    "health check-in",
    "health guardian",
    "check-in reminder",
    "emergency contact",
    "minimalist app",
    "health safety",
    "smart reminder",
    "guest mode",
    "HRU",
  ],
  openGraph: {
    title: "HRU - Health Guardian Check-in App",
    description:
      "HRU is a minimalist health guardian check-in app, supporting daily check-ins, emergency contacts, smart email reminders, and guest mode. HRU, peace of mind every day.",
    url: "https://www.asdlscjjweq.xyz/",
    siteName: "HRU Health Guardian",
    images: [
      {
        url: "https://www.asdlscjjweq.xyz/globe.svg",
        width: 1200,
        height: 630,
        alt: "HRU Health Guardian Check-in App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HRU - Health Guardian Check-in App",
    description:
      "HRU is a minimalist health guardian check-in app, supporting daily check-ins, emergency contacts, smart email reminders, and guest mode. HRU, peace of mind every day.",
    images: ["https://www.asdlscjjweq.xyz/globe.svg"],
    site: "@hru_health",
    creator: "@feifeichen1999",
  },
  metadataBase: new URL("https://www.asdlscjjweq.xyz/"),
  alternates: {
    canonical: "https://www.asdlscjjweq.xyz/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return locale === "en" ? enMeta : zhMeta;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        {/* 其他 head 内容 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-78W4YDTF2B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-78W4YDTF2B');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
