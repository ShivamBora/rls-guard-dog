// app/page.js

import { redirect } from 'next/navigation';

export default function HomePage() {
  // This function will automatically redirect anyone visiting the homepage
  // to the /login page.
  redirect('/login');
}