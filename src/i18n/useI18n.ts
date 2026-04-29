import { create } from 'zustand';
import { locales } from './locales';
import type { Locale } from './locales';

interface I18nState {
  locale: string;
  t: Locale;
  setLocale: (locale: string) => void;
}

const useI18n = create<I18nState>((set) => ({
  locale: 'en',
  t: locales.en,
  setLocale: (locale: string) => {
    const newLocale = locales[locale] || locales.en;
    set({ locale, t: newLocale });
  },
}));

export default useI18n;
