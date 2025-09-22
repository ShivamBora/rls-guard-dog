import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function TeacherPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Current user
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', session.user.id)
    .single();

  // Progress (joins rely on DB relationships)
  const { data: progressData } = await supabase
    .from('progress')
    .select('*, profiles(full_name), classrooms(name)');

  const roleTitle = profile?.role === 'head_teacher' ? 'Headmaster' : 'Teacher';

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '24px' }}>{roleTitle} Dashboard</h1>
        <p style={{ color: '#555' }}>Welcome, {profile?.full_name || 'User'}</p>
      </header>
      
      <main>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Student Progress</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Student Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Classroom</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {progressData && progressData.length > 0 ? progressData.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{p.profiles?.full_name || 'N/A'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{p.classrooms?.name || 'N/A'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{p.score}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>No progress records to display.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}