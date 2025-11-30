'use client'
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function ToggleUserButton({ userId, isActive }: { userId: number; isActive: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  async function handleToggle() {
    start(async () => {
      await fetch(`/api/admin/users/${userId}/toggle`, { method: 'POST' });
      router.refresh();
    });
  }

  return (
    <button onClick={handleToggle} disabled={pending} className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {isActive ? 'Enabled' : 'Disabled'}
    </button>
  )
}
