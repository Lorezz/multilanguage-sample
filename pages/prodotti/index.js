import Layout from '../../components/Layout';

export default function Index(props) {
  return (
    <Layout {...props}>
      <h1>{`${props.locale} - ${props.title}`}</h1>
    </Layout>
  );
}

export async function getStaticProps({ params, locale }) {
  console.log('getStaticProps', locale);
  return {
    props: {
      locale: locale || 'it',
      title: 'Prodotti',
    },
  };
}
