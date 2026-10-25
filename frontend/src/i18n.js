import { useLocation } from 'react-router-dom';
import en from './content/en.js';
import id from './content/id.js';
import { localeFromPath, pathFor, routeFromPath } from './routes.js';

export const DICTS = { en, id };

export function useI18n() {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const { route } = routeFromPath(pathname);
  return {
    t: DICTS[locale],
    locale,
    route,
    to: (key) => pathFor(key, locale),
    /** The same page in the other language. */
    alternate: route ? route[locale === 'en' ? 'id' : 'en'] : pathFor('home', locale === 'en' ? 'id' : 'en')
  };
}
