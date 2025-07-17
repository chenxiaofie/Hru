import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import ClientLayout from "../client-layout";

const locales = ["zh", "en"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) {
    notFound();
  }
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientLayout>{children}</ClientLayout>
    </NextIntlClientProvider>
  );
}
