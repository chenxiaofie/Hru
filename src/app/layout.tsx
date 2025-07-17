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

export const metadata: Metadata = {
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

// 在 <head> 里插入结构化数据和 favicon
// 在组件内 <head> 标签中加入如下内容：
// <link rel="icon" href="/favicon.ico" />
// <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
// <meta name="theme-color" content="#4FC3F7" />
// <script type="application/ld+json">...</script>

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        {/* 其他 head 内容 */}
        {/* Google Analytics */}
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
