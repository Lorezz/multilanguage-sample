import { default as alias } from 'pages/prodotti';
export default alias;

export async function getStaticProps({ params, locale }) {
  console.log('getStaticProps', locale);
  return {
    props: {
      locale: locale || 'en',
      title: 'Products',
    },
  };
}
