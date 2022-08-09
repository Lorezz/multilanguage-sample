import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ locale, title, children }) {
  const menuRoutes = [
    { it: 'articoli', en: 'articles' },
    { it: 'prodotti', en: 'products' },
    { it: 'contatti', en: 'contacts' },
  ];
  return (
    <div>
      <Head>
        <title>{locale + ' - ' + title}</title>
        <meta name="description" content={`${locale} - ${title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <ul>
          {locale != 'it' && (
            <li>
              <Link href="/">
                <a>IT</a>
              </Link>
            </li>
          )}
          {locale != 'en' && (
            <li>
              <Link href="/en">
                <a>EN</a>
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        <ul>
          {menuRoutes.map((r) => {
            const path = locale === 'it' ? `/${r[locale]}` : `/en/${r[locale]}`;
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
