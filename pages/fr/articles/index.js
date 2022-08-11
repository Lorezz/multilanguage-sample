
    import { default as alias } from 'pages/articoli/index.js';
    export default alias;

    export async function getStaticProps({ params, locale = 'fr' }) {
      console.log('getStaticProps', locale);
      return {
        props: {
          locale,
          title: 'articles-index',
        },
      };
    }
