'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchSchools = async () => {
      const { data } = await supabase.rpc('get_schools_list');
      if (data) setSchools(data);
    };
    fetchSchools();
  }, [supabase]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          secret_code: secretCode || null,
          school_id: selectedSchool,
        },
      },
    });
    
    setLoading(false);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Sign-up request sent. Please check your email.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '25px' }}>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="fullName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '10px' }}/>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px' }} type="email"/>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px' }}/>
          </div>
          <div style={{ marginBottom: '15px' }}>
              <label htmlFor="school" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>School</label>
              <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} required style={{ width: '100%', padding: '10px' }}>
                  <option value="" disabled>Select your school</option>
                  {schools.map((school) => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
              </select>
          </div>
          <div style={{ marginBottom: '25px' }}>
              <label htmlFor="secretCode" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role Code (Optional)</label>
              <input value={secretCode} onChange={(e) => setSecretCode(e.target.value)} style={{ width: '100%', padding: '10px' }}/>
              
              {/* --- ADDED THIS HELPER TEXT --- */}
              <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                Teacher: 0011, Headmaster: 0022
              </small>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {message && <p style={{ marginTop: '20px', textAlign: 'center' }}>{message}</p>}
        </form>
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