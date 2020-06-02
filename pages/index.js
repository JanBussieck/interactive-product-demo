import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Container from '../components/DnDContainer'
import utilStyles from '../styles/utils.module.css'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>Features im Fokus</title>
      </Head>
      <Container />
    </Layout>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}
