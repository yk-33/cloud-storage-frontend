import { createContext, useContext, useCallback } from "react";

import { RESOURCES, DEFAULT_LOCALE,  isSupportLocale } from "./config";

export const LocaleContext = createContext(DEFAULT_LOCALE);

export const useTranslation = () => {
  const currentLocale = useContext(LocaleContext);
  if (!isSupportLocale(currentLocale)) {
    throw new Error(`Unsupported locale: ${currentLocale}`);
  }

  const translate = useCallback(
    (key) => {
      return RESOURCES[currentLocale][key];
    },
    [currentLocale]
  );
  return { t: translate, lang:  currentLocale};
};