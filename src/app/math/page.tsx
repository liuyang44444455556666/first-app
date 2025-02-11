"use client"
import { Suspense, useState } from 'react';
import { Loading } from '@/components/ui/loading/Loading';
import { CodeBlock } from '@/components/md/pre';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';




const MathPage = () => {
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0);
  const [demoData, setDemoData] = useState(null);

  async function getAddition(a: number, b: number) {
    const response = await fetch(`/api/math?a=${a}&b=${b}`);
    const data = await response.json();
    if (response.ok) {
      console.log(`GET: a + b = ${data.msg}`);
      setDemoData(data);
    } else {
      console.error(`GET Error: ${data.error}`);
      setDemoData(data);
    }
  }

  async function postSubtraction(a: number, b: number) {
    const response = await fetch('/api/math', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ a, b }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(`POST: ${data[0]} - ${data[2]} = ${data[4]}`);
      setDemoData(data);
    } else {
      console.error(`POST Error: ${data.error}`);
      setDemoData(data);
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <h1>MathPage</h1>
      <p>This is the MathPage page.</p>
      <div className='flex gap-2 mb-2'>
        <label>
          a: 
          <Input type="number" value={a} onChange={(e) => setA(parseFloat(e.target.value))} />
        </label>
        <label>
          b: 
          <Input type="number" value={b} onChange={(e) => setB(parseFloat(e.target.value))} />
        </label>
      </div>
      <div className='flex gap-2 mb-1'>
        <Button onClick={() => getAddition(a, b)}>Add</Button>
        <Button onClick={() => postSubtraction(a, b)}>Subtract</Button>
      </div>
      <h2>Return: {""}</h2>
      {demoData && (
        <CodeBlock value={JSON.stringify(demoData, null, 2)} language='json' 
          options={{ lineNumbers: 'on', wrapLines: true }} 
        />
      )}
    </Suspense>
  );
}

export default MathPage;