import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithEmail(email: string, password: string) {
  console.log('Attempting to sign in with email:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  console.log('Sign in response:', { data, error });
  
  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }
  
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  console.log('Attempting to sign up with email:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  console.log('Sign up response:', { data, error });
  
  if (error) {
    console.error('Sign up error:', error);
    throw error;
  }
  
  return data;
}

export async function signOut() {
  console.log('Attempting to sign out');
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
  
  console.log('Sign out successful');
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('Get session response:', { session, error });
    
    if (error) {
      console.error('Get session error:', error);
      throw error;
    }
    
    return session;
  } catch (error) {
    console.error('Error in getSession:', error);
    throw error;
  }
}

