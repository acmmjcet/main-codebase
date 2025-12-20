/* eslint-disable no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';

export default function AuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [message, setMessage] = useState('Processing login...')

    useEffect(() => {
    const handleAuth = async () => {
      const storedRedirectUrl = localStorage.getItem('authRedirectUrl');

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Ensure session.user.id is a string
          const userId = String(session.user.id);
          // Check if user already has a profile in backend
          let profileData = null;
          const profileRes = await fetch(API_ENDPOINTS.getProfileByUUID(userId), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (profileRes.ok) {
            const profileJson:any = await profileRes.json();
            if (profileJson.success && profileJson.data) {
              profileData = profileJson.data;
            }
          }

          if (!profileData) {
            setMessage('Setting up your account...');
            // Create profile in backend
            const createRes = await fetch(API_ENDPOINTS.createProfile, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uuid: userId,
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                email: session.user.email || '',
                phone: session.user.user_metadata?.phone || '',
                avatar_url: session.user.user_metadata?.avatar_url || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }),
            });
            if (!createRes.ok) {
              const err:any = await createRes.json();
              console.error('Error creating profile:', err.message || 'Unknown error');
            }
          } else {
            setMessage('Updating your account...');
            // Update profile in backend (PATCH)
            const updateRes = await fetch(API_ENDPOINTS.updateProfileByUUID(userId), {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                updated_at: new Date().toISOString(),
                avatar_url: session.user.user_metadata?.avatar_url || profileData.avatar_url,
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || profileData.full_name,
              }),
            });
            if (!updateRes.ok) {
              const err:any = await updateRes.json();
              console.error('Error updating profile:', err.message || 'Unknown error');
            }
          }

          // Check if there's a stored redirect URL
          let redirectTo =  storedRedirectUrl || '/';
          if (typeof window !== 'undefined') {
            const storedRedirectUrl = localStorage.getItem('authRedirectUrl');
            if (storedRedirectUrl) {
              redirectTo = storedRedirectUrl;
              localStorage.removeItem('authRedirectUrl');
            }
          }
          setMessage(`Redirecting to ${redirectTo}...`);
          router.push(redirectTo);
        } 
        else {
          // If not authenticated, redirect to home
          setMessage('Authentication failed. Redirecting to home...');
          router.push('/');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        // On error, redirect to home
        router.push('/');
      } finally {
        setIsProcessing(false);
      }
    };
    handleAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-gray-600 border-t-transparent"></div>
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}