import { default as alias } from 'pages/articoli';
export default alias;

export async function getStaticProps({ params, locale = 'en' }) {
  console.log('getStaticProps', locale);
  return {
    props: {
      locale,
      title: 'Articles',
    },
  };
}
