import Link from "next/link";
import { Button } from "../ui/button";

export const Header: React.FC = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8f9fa' }}>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild>
          <Link href="/client">客户端渲染组件示例</Link>
        </Button>
        <Button asChild>
          <Link href="/math">api示例</Link>
        </Button>
      </nav>
    </header>
  );
};