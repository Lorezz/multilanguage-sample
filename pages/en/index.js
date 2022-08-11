import { default as alias } from 'pages/index';
export default alias;

export async function getStaticProps({ params, locale = 'en' }) {
  console.log('getStaticProps', locale);
  return {
    props: {
      locale,
      title: 'Home',
    },
  };
}
