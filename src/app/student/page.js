import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignOutButton from '../components/SignOutButton';

export default async function StudentPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .single();

  const { data: progressData } = await supabase
    .from('progress')
    .select('*, classrooms(name)');

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Student Dashboard</h1>
          <p style={{ color: '#555', margin: '5px 0 0 0' }}>Welcome, {profile?.full_name || 'Student'}</p>
        </div>
        <SignOutButton />
      </header>
      
      <main>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Your Progress Report</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          {progressData && progressData.length > 0 ? progressData.map((p, index) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: index === progressData.length - 1 ? 'none' : '1px solid #eee' }}>
              <span style={{ fontWeight: 'bold' }}>{p.classrooms?.name || 'N/A'}</span>
              <span>Score: {p.score}</span>
            </div>
          )) : (
            <p style={{ padding: '15px', textAlign: 'center' }}>You have no progress records yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}