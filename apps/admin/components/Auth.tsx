"use client";
import React, { useState } from "react";
import { Shield, Sparkles, Users, Calendar, BookOpen, XCircle } from "lucide-react";
import Image from "next/image";
import { supabase } from '@/utils/supabase/client';

// ACM Logo Component
const ACMLogo = () => (
  <Image
    width={100}
    height={50}
    alt="ACM logo"
    src="/logo_without_bg.png"
  />
);

interface AuthProps {
  onAuthSuccess?: () => void;
  onAuthError?: (error: string) => void;
  initialError?: string | null;
}

// Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Feature Item Component
const FeatureItem = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-3 text-[#8b8b8b]">
    <div className="w-8 h-8 bg-[#1c2333] rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-[#FF6B35]" />
    </div>
    <span className="text-sm">{text}</span>
  </div>
);

// Auth Component
const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onAuthError, initialError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  // Update error when initialError changes
  React.useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  const clearError = () => setError(null);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Store the current path for redirect after auth
      localStorage.setItem('authRedirectUrl', window.location.pathname);

      // Initiate Google OAuth sign-in
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        },
      });

      if (error) {
        throw error;
      }

      // Success callback
      onAuthSuccess?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google. Please try again.';
      setError(errorMessage);
      onAuthError?.(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Background Gradient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B35]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1c2333]/50 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle size={18} className="text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-red-400 font-medium text-sm mb-1">Authentication Failed</h4>
                <p className="text-red-300/70 text-xs">{error}</p>
              </div>
              <button 
                onClick={clearError}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                <XCircle size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Main Auth Card */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-8 sm:p-10 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl border border-[#222222]">
                <ACMLogo />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              ACM MJCET Admin
            </h1>
            <p className="text-[#6b6b6b] text-sm sm:text-base">
              Welcome back! Sign in to manage your chapter.
            </p>
          </div>

          {/* Admin Access Badge */}
          <div className="bg-[#1c2333]/50 border border-[#2a3a4a]/50 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm mb-1">
                  Admin Access Only
                </h3>
                <p className="text-[#6b6b6b] text-xs leading-relaxed">
                  This portal is exclusively for ACM MJCET administrators.
                  Only <span className="text-[#FF6B35] font-medium">@mjcollege.ac.in</span> emails are allowed.
                </p>
              </div>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-800 font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#1f1f1f]" />
            <span className="text-[#4a4a4a] text-xs uppercase tracking-wider">
              Admin Features
            </span>
            <div className="flex-1 h-px bg-[#1f1f1f]" />
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <FeatureItem icon={Users} text="Manage chapter members & roles" />
            <FeatureItem icon={Calendar} text="Create and schedule events" />
            <FeatureItem icon={BookOpen} text="Publish blogs & announcements" />
            <FeatureItem icon={Sparkles} text="Customize portfolio sections" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[#4a4a4a] text-xs">
            By signing in, you agree to ACM MJCET's{" "}
            <a href="/terms" className="text-[#6b6b6b] hover:text-white transition-colors underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#6b6b6b] hover:text-white transition-colors underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Help Link */}
        <div className="mt-4 text-center">
          <p className="text-[#4a4a4a] text-xs">
            Need access?{" "}
            <a
              href="mailto:acm@mjcet.ac.in"
              className="text-[#FF6B35] hover:text-[#ff8555] transition-colors font-medium"
            >
              Contact ACM MJCET
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
