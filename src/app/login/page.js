'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.role === 'student') {
        router.push('/student');
      } else {
        router.push('/teacher');
      }
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '25px' }}>Login</h1>
        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" style={{ width: '100%', padding: '10px' }}/>
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" style={{ width: '100%', padding: '10px' }}/>
          </div>
          {errorMsg && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{errorMsg}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        {/* --- THIS LINE IS THE FIX --- */}
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'blue' }}>Sign Up</Link>
        </p>
      </div>
      
      <div style={{ 
          marginTop: '25px', 
          padding: '15px', 
          border: '1px dashed #0070f3', 
          borderRadius: '8px', 
          backgroundColor: '#f0f8ff', 
          textAlign: 'center',
          fontFamily: 'monospace',
          color: '#333'
      }}>
        by - ShivamBora <br/> best intern for sign Setu (trust me)
      </div>
    </div>
  );
}