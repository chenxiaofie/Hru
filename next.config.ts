import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = withNextIntl({
  // 你的其它 Next.js 配置
});

export default nextConfig;
