/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle, Flame, User, Mail, Phone, MapPin, Calendar, Users, Key, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
];

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal, login, loginAsAdmin, loginWithGoogle, register, detectedRefCode } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createdMemberId, setCreatedMemberId] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(true);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');

  // Registration form state
  const [regForm, setRegForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    country: 'United States',
    dob: '',
    gender: 'Male',
    ministry: '',
    referralId: '',
    profilePhoto: AVATAR_OPTIONS[0],
  });

  const [sponsorStatus, setSponsorStatus] = useState<{ checked: boolean; valid: boolean; sponsorName?: string }>({
    checked: false,
    valid: false,
  });

  useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMessage('');
    setSuccessMessage('');
    setCreatedMemberId('');
  }, [authModalTab, authModalOpen]);

  // Pre-fill detected referral code
  useEffect(() => {
    if (detectedRefCode) {
      setRegForm(prev => ({ ...prev, referralId: detectedRefCode }));
      verifySponsor(detectedRefCode);
    }
  }, [detectedRefCode]);

  const verifySponsor = async (code: string) => {
    if (!code || code.trim().length < 3) {
      setSponsorStatus({ checked: false, valid: false });
      return;
    }
    try {
      console.log('[AuthModal] Verifying referral sponsor code:', code.trim());
      const res = await api.checkReferralCode(code.trim());
      if (res.valid) {
        console.log('[AuthModal] Sponsor valid:', res.sponsorName);
        setSponsorStatus({ checked: true, valid: true, sponsorName: res.sponsorName });
      } else {
        console.log('[AuthModal] Sponsor invalid or inactive');
        setSponsorStatus({ checked: true, valid: false });
      }
    } catch (err: any) {
      console.warn('[AuthModal] Sponsor verification error:', err?.message);
      setSponsorStatus({ checked: true, valid: false });
    }
  };

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    console.log('[AuthModal] Submitting login for identifier:', loginIdentifier);
    try {
      const result = await login(loginIdentifier, loginPassword);
      setIsLoading(false);
      if (!result.success) {
        console.error('[AuthModal] Login rejected:', result.error);
        setErrorMessage(result.error || 'Login failed. Please check your credentials.');
      } else {
        console.log('[AuthModal] Login succeeded.');
      }
    } catch (err: any) {
      console.error('[AuthModal] Unexpected error in handleLoginSubmit:', err);
      setIsLoading(false);
      setErrorMessage(err?.message || 'Login failed due to network or server communication.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);
    console.log('[AuthModal] Initiating Firebase Google Sign-In...');
    try {
      const result = await loginWithGoogle();
      setIsLoading(false);
      if (!result.success) {
        console.error('[AuthModal] Google Sign-In error:', result.error);
        setErrorMessage(result.error || 'Google Sign-In failed.');
      } else {
        console.log('[AuthModal] Google Sign-In completed.');
      }
    } catch (err: any) {
      console.error('[AuthModal] Google Sign-In exception:', err);
      setIsLoading(false);
      setErrorMessage(err?.message || 'Google Sign-In encountered an error.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regForm.password !== regForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (regForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    console.log('[AuthModal] Submitting registration for:', regForm.fullName, regForm.email);
    try {
      const result = await register(regForm);
      setIsLoading(false);

      if (result.success) {
        console.log('[AuthModal] Registration successful, memberId:', result.memberId);
        setCreatedMemberId(result.memberId || '');
        setSuccessMessage(`Welcome to the family! Your unique Member ID is ${result.memberId}.`);
      } else {
        console.error('[AuthModal] Registration error:', result.error);
        setErrorMessage(result.error || 'Registration failed. Please check your inputs.');
      }
    } catch (err: any) {
      console.error('[AuthModal] Registration exception:', err);
      setIsLoading(false);
      setErrorMessage(err?.message || 'Registration failed due to a server communication error.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    console.log('[AuthModal] Requesting password recovery for:', forgotEmail);
    try {
      const res = await api.forgotPassword(forgotEmail);
      console.log('[AuthModal] Password reset response:', res.message);
      setSuccessMessage(res.message);
    } catch (err: any) {
      console.error('[AuthModal] Password reset error:', err);
      setErrorMessage(err.message || 'Unable to process reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAshish = async () => {
    setErrorMessage('');
    setIsLoading(true);
    console.log('[AuthModal] Fast-tracking Ashish Admin login');
    try {
      const res = await loginAsAdmin();
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Admin login failed.');
      }
    } catch (err: any) {
      console.error('[AuthModal] Demo admin login exception:', err);
      setIsLoading(false);
      setErrorMessage(err?.message || 'Admin login failed.');
    }
  };

  const fillDemoAdmin = async () => {
    setLoginIdentifier('admin@firegrace.org');
    setLoginPassword('Admin@123456');
    setErrorMessage('');
    setIsLoading(true);
    try {
      const res = await login('admin@firegrace.org', 'Admin@123456');
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Login failed.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Login failed.');
    }
  };

  const fillDemoMember = async () => {
    setLoginIdentifier('grace.johnson@example.com');
    setLoginPassword('Member@123');
    setErrorMessage('');
    setIsLoading(true);
    try {
      const res = await login('grace.johnson@example.com', 'Member@123');
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Login failed.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Login failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-amber-500/25 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 p-6 border-b border-white/10 shrink-0">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold font-cinzel text-amber-300">FIRE GRACE FELLOWSHIP</h2>
              <p className="text-xs text-slate-400">
                {activeTab === 'login'
                  ? 'Access your Member & Leader Portal'
                  : activeTab === 'register'
                  ? 'Register as an Official Member'
                  : 'Recover your account credentials'}
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex mt-4 p-1 bg-slate-950/60 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                activeTab === 'login' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Member / Admin Login
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                activeTab === 'register' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              New Registration
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="font-medium">{errorMessage}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-rose-500/20 text-[11px]">
                <span className="text-slate-400">Need instant access?</span>
                <button
                  type="button"
                  onClick={fillDemoAshish}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline"
                >
                  Use Direct Admin Login ⚡
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{successMessage}</p>
                {createdMemberId && (
                  <p className="mt-1 text-slate-300">
                    Your unique Member ID is <strong className="text-amber-300 font-mono">{createdMemberId}</strong>. You can now use your email, mobile, or Member ID to sign in.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ---------------- LOGIN TAB ---------------- */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Instant 1-Click Admin Access Top Banner Button */}
              <button
                type="button"
                onClick={fillDemoAshish}
                disabled={isLoading}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-500/35 to-amber-500/25 hover:from-amber-500/35 hover:to-yellow-500/45 border-2 border-amber-400 text-amber-300 font-bold text-xs flex items-center justify-between shadow-lg shadow-amber-500/20 transition group"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
                    👑
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">Direct Admin Access / एडमिन लॉगिन</div>
                    <div className="text-[11px] text-amber-300 font-normal">Ashish Badawat (Senior Church Admin)</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg tracking-wider group-hover:scale-105 transition">
                  1-CLICK LOGIN ⚡
                </span>
              </button>

              {/* Google Sign In with Firebase */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2.5 transition shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google (Firebase Auth)</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-500">or sign in with password</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email / Mobile / Member ID</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. FGF10001 or name@example.com"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberLogin}
                    onChange={e => setRememberLogin(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                  Remember login
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-amber-400 hover:text-amber-300 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Quick demo fills */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                  <span>⚡ Instant 1-Click Login:</span>
                  <span className="text-[10px] text-amber-400/90 font-semibold">Click to login directly</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={fillDemoAshish}
                    className="py-2 px-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded-lg text-[11px] text-amber-300 font-medium transition text-center leading-tight"
                  >
                    👑 <strong>Ashish</strong>
                    <span className="block text-[9px] text-amber-400/70 font-normal">Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="py-2 px-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-[11px] text-amber-300 font-medium transition text-center leading-tight"
                  >
                    👑 <strong>Admin</strong>
                    <span className="block text-[9px] text-amber-400/70 font-normal">General</span>
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoMember}
                    className="py-2 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] text-slate-300 font-medium transition text-center leading-tight"
                  >
                    👤 <strong>Grace</strong>
                    <span className="block text-[9px] text-slate-400 font-normal">Member</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>👑 <strong>Admin Password:</strong></span>
                    <span className="font-mono text-amber-300">Admin@123456</span>
                  </div>
                  <div className="flex justify-between">
                    <span>👤 <strong>Member Password:</strong></span>
                    <span className="font-mono text-slate-300">Member@123</span>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ---------------- REGISTRATION TAB ---------------- */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Profile Avatar Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Choose Profile Photo</label>
                <div className="flex items-center gap-3">
                  {AVATAR_OPTIONS.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRegForm({ ...regForm, profilePhoto: img })}
                      className={`w-11 h-11 rounded-full overflow-hidden border-2 transition ${
                        regForm.profilePhoto === img ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/30' : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.fullName}
                    onChange={e => setRegForm({ ...regForm, fullName: e.target.value })}
                    placeholder="e.g. Johnathan Smith"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={regForm.mobile}
                    onChange={e => setRegForm({ ...regForm, mobile: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regForm.password}
                    onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regForm.confirmPassword}
                    onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={regForm.city}
                    onChange={e => setRegForm({ ...regForm, city: e.target.value })}
                    placeholder="City"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={regForm.state}
                    onChange={e => setRegForm({ ...regForm, state: e.target.value })}
                    placeholder="State"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={regForm.country}
                    onChange={e => setRegForm({ ...regForm, country: e.target.value })}
                    placeholder="Country"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* DOB, Gender & Ministry */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={regForm.dob}
                    onChange={e => setRegForm({ ...regForm, dob: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={regForm.gender}
                    onChange={e => setRegForm({ ...regForm, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Church/Ministry</label>
                  <input
                    type="text"
                    value={regForm.ministry}
                    onChange={e => setRegForm({ ...regForm, ministry: e.target.value })}
                    placeholder="e.g. Worship, Youth"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Referral ID Field */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Referral ID / Sponsor Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={regForm.referralId}
                    onChange={e => {
                      const code = e.target.value.toUpperCase();
                      setRegForm({ ...regForm, referralId: code });
                      verifySponsor(code);
                    }}
                    placeholder="e.g. FGF10001"
                    className="flex-1 bg-slate-950 border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-200 uppercase font-mono tracking-wider focus:outline-none"
                  />
                </div>
                {sponsorStatus.checked && (
                  <p className={`mt-1.5 text-[11px] ${sponsorStatus.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sponsorStatus.valid
                      ? `✓ Verified Sponsor: ${sponsorStatus.sponsorName}`
                      : '✗ No member found with this code. You will be registered directly.'}
                  </p>
                )}
                {detectedRefCode && (
                  <p className="mt-1 text-[11px] text-amber-400/80">
                    ★ Detected from your invitation link ({detectedRefCode})
                  </p>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                By registering, a unique <strong>Member ID</strong> (e.g. FGF1000X) and personal referral link will be generated automatically.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Complete Member Registration'}
              </button>
            </form>
          )}

          {/* ---------------- FORGOT PASSWORD TAB ---------------- */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter your registered email address or mobile number to receive a secure recovery code:
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="e.g. pastor@example.com or +1 (555)..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50"
              >
                {isLoading ? 'Sending Request...' : 'Send Recovery Code'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full text-xs text-slate-400 hover:text-white py-1"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
