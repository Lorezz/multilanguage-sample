import Layout from 'components/Layout';

export default function Index(props) {
  return (
    <Layout {...props}>
      <h1>{`${props.locale} - ${props.title}`}</h1>
    </Layout>
  );
}

export async function getStaticProps({ params, locale = 'it' }) {
  console.log('getStaticProps', locale);
  return {
    props: {
      locale,
      title: 'Prodotti',
    },
  };
}
