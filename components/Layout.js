import Head from 'next/head';
import Link from 'next/link';
import config from 'translations.json';

export default function Layout({ locale, title, children }) {
  const { languages, defaultLocale, translations } = config;
  // const menuRoutes = [
  //   { it: 'articoli', en: 'articles' },
  //   { it: 'prodotti', en: 'products' },
  //   { it: 'contatti', en: 'contacts' },
  // ];

  const menuRoutes = Object.keys(translations).reduce((all, key) => {
    let obj = { [defaultLocale]: key, ...translations[key] };
    return [...all, obj];
  }, []);
  return (
    <div>
      <Head>
        <title>{locale + ' - ' + title}</title>
        <meta name="description" content={`${locale} - ${title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <ul>
          <li key={locale}>{locale.toUpperCase()}</li>
          {languages
            .filter((l) => l !== locale)
            .map((l) => (
              <li key={l}>
                <Link href={l === defaultLocale ? '/' : '/' + l}>
                  <a>{l.toUpperCase()}</a>
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <ul>
          {menuRoutes.map((r) => {
            const path =
              locale === defaultLocale
                ? `/${r[locale]}`
                : `/${locale}/${r[locale]}`;
            return (
              <li key={path}>
                <Link href={path}>
                  <a>{r[locale]}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>{children}</div>
    </div>
  );
}
