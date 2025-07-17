import { getRequestConfig } from "next-intl/server";

const fallbackLocale = "zh";
const supportedLocales = ["zh", "en"];

export default getRequestConfig(async ({ locale }) => {
  const safeLocale: string = supportedLocales.includes(locale as string)
    ? (locale as string)
    : fallbackLocale;
  return {
    messages: (await import(`@/messages/${safeLocale}.json`)).default,
    locale: safeLocale,
  };
});
