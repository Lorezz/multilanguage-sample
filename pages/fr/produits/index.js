
    import { default as alias } from 'pages/prodotti/index.js';
    export default alias;

    export async function getStaticProps({ params, locale = 'fr' }) {
      console.log('getStaticProps', locale);
      return {
        props: {
          locale,
          title: 'produits-index',
        },
      };
    }
