'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) router.push('/login');
    else setError('Registrasi gagal. Email mungkin sudah terdaftar.');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Daftar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="text" placeholder="Nama lengkap" value={name} onChange={e => setName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password (min. 6 karakter)" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Daftar</Button>
      </form>
      <p className="mt-4 text-center">Sudah punya akun? <Link href="/login" className="text-emerald-600">Masuk</Link></p>
    </div>
  );
}