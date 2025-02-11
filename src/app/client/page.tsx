"use client" // 客户端 page 需要使用 "use client" 指令, 而服务端组件是默认的
import { useState } from 'react';
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading/Loading';
import { Friend } from '../api/friends/lib';
import { CodeBlock } from '@/components/md/pre';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

async function fetchFriends(): Promise<Friend[]> {
  const res = await fetch(`/api/friends?state=all`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch friends');
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of friends: ' + JSON.stringify(data));
  }
  return data;
}


const ClientIndexPage = () => {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchFriends = async () => {
    setLoading(true);
    toast.info('Fetching friends...');
    try {
      const data = await fetchFriends();
      setFriends(data);
      toast.success('Fetched friends');
    } catch (error) {
      toast.error('Failed to fetch friends');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <h1>ClientIndexPage</h1>
        <p>This is the ClientIndexPage page.</p>
        <Button onClick={handleFetchFriends}>获取好友数据</Button>
        {loading && <Loading />}
        {friends && (
          <CodeBlock value={JSON.stringify(friends, null, 2)} language='json' 
            options={{ lineNumbers: 'on', wrapLines: true }} 
          />
        )}
      </Suspense>
    </>
  );
};

export default ClientIndexPage;