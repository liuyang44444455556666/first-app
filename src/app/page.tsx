import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading/Loading';
import { Friend } from './api/friends/lib';
import { CodeBlock } from '@/components/md/pre';

async function getFriends(): Promise<Friend[]> {
  // console.log('process.env', process.env)
  // const headers = new Headers(await nextHeaders())
  const res = await fetch(`${process.env.__NEXT_PRIVATE_ORIGIN}/api/friends?state=all`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch friends')
  const data = await res.json()
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of friends: ' + JSON.stringify(data))
  }
  return data
}

const Footer: React.FC = () => {
  return (
    <footer style={{ display: 'flex', justifyContent: 'center', padding: '1rem', backgroundColor: '#f8f9fa' }}>
      <p>© Sonny</p>
    </footer>
  );
}

const IndexPage = async () => {
  const friends = await getFriends()
  return (
    <Suspense fallback={<Loading />}>
      <h1>IndexPage</h1>
      <p>This is the IndexPage page.</p>
      <CodeBlock value={JSON.stringify(friends, null, 2)} language='json' 
          options={{ lineNumbers: 'on',
            wrapLines:true,
          }} 
      />

      <Footer />
    </Suspense>
  );
}

export default IndexPage;