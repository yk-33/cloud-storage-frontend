import en from "./locales/en/common.json";
import ja from "./locales/ja/common.json";

export const RESOURCES = { ja, en };
export const SUPPORTED_LOCALES = Object.keys(RESOURCES);
export const DEFAULT_LOCALE = "ja";

export const isSupportLocale = (locale) =>
  locale !== undefined && Object.keys(RESOURCES).includes(locale);