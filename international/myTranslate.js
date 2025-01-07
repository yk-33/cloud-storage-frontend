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

  const templateTranslate = useCallback(
    (key, params) => {
      let template = RESOURCES[currentLocale][key];
      Object.keys(params).forEach((param) => {
        template = template.replace(`{${param}}`, params[param]);
      });
      return template
    },
    [currentLocale]
  )
  return { t: translate, tp: templateTranslate, lang:  currentLocale};
};