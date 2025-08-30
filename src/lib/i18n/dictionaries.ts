import type { Dictionary } from '@/lib/types';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  ar: () => import('./ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'ar'): Promise<Dictionary> => {
    return dictionaries[locale]();
}
