import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const store = await cookies();
  const headerStore = await headers();
  
  let locale = "en";

  const cookieLocale = store.get("locale")?.value;
  
  if (cookieLocale && ["en", "pt"].includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const acceptLanguage = headerStore.get("accept-language");
    if (acceptLanguage) {
      if (acceptLanguage.includes("pt")) {
        locale = "pt";
      }
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
