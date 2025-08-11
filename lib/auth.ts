// lib/auth.ts
import { supabase } from "./supabase"

export async function handleGoogleSignIn() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google sign in error:', error)
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error('Unexpected error during Google sign in:', error)
    return { data: null, error: error.message }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
    return { error: null }
  } catch (error: any) {
    console.error('Unexpected error during sign out:', error)
    return { error: error.message }
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get user error:', error)
      throw error
    }

    return { data: user, error: null }
  } catch (error: any) {
    console.error('Unexpected error getting current user:', error)
    return { data: null, error: error.message }
  }
}