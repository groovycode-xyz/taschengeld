import Link from 'next/link';

export const Navigation: React.FC = () => {
  return (
    <nav className="flex space-x-4">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      <Link href="/task-completion" className="hover:underline">
        Task Completion
      </Link>
      <Link href="/user-management" className="hover:underline">
        User Management
      </Link>
    </nav>
  );
};
