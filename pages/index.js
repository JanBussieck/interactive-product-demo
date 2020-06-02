import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import DnDContainer from '../components/DnDContainer'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { getSortedPostsData } from '../lib/posts'
import utilStyles from '../styles/utils.module.css'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>Features im Fokus</title>
      </Head>
      <DndProvider backend={HTML5Backend}>
        <DnDContainer />
      </DndProvider>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
