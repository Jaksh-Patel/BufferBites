import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase.js';
import '../assets/login.css';

/* ===== Animated Restaurant Cloche Dish (SVG) ===== */
const DishIllustration = ({ className = '' }) => (
  <div className={`dish ${className}`} aria-hidden="true">
    <div className="steam steam-1" />
    <div className="steam steam-2" />
    <div className="steam steam-3" />
    <svg className="dish-dome" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 74C20 74 18 40 42 26C58 17 76 18 88 30C102 44 100 74 100 74Z" fill="url(#domeGrad)" fillOpacity="0.28" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="60" cy="26" r="9" fill="rgba(255,255,255,0.25)" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2.5" />
      <circle cx="60" cy="26" r="3.5" fill="rgba(255,255,255,0.9)" />
      <path d="M34 56C34 40 42 30 54 25" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
      <defs>
        <linearGradient id="domeGrad" x1="30" y1="18" x2="90" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
    <svg className="dish-burger" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="50" rx="46" ry="8" fill="#ffffff" fillOpacity="0.28" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2.5" />
      <ellipse cx="60" cy="47" rx="34" ry="5" fill="rgba(255,255,255,0.12)" />
      <path d="M30 40C30 32 38 28 47 28H73C82 28 90 32 90 40V42H30V40Z" fill="#e8a24b" />
      <rect x="27" y="22" width="66" height="9" rx="4.5" fill="#8a4a2b" />
      <path d="M26 20C32 15 40 13 48 14L60 18L74 13C82 14 90 17 94 20H26Z" fill="#f5c542" />
      <path d="M24 18C32 12 42 10 52 13C60 9 72 11 80 14C86 17 91 20 96 22C90 25 84 26 76 25C66 28 52 27 42 24C36 22 30 20 24 18Z" fill="#6bbf59" />
      <path d="M24 16C24 8 34 3 47 3H73C86 3 96 8 96 16C92 19 86 21 78 21H42C34 21 28 19 24 16Z" fill="#f2b45c" />
      <ellipse cx="42" cy="8" rx="3" ry="1.6" fill="#ffe9c9" transform="rotate(-14 42 8)" />
      <ellipse cx="58" cy="6" rx="3" ry="1.6" fill="#ffe9c9" transform="rotate(6 58 6)" />
      <ellipse cx="72" cy="9" rx="3" ry="1.6" fill="#ffe9c9" transform="rotate(12 72 9)" />
      <ellipse cx="50" cy="13" rx="2.6" ry="1.4" fill="#ffe9c9" transform="rotate(-8 50 13)" />
      <ellipse cx="66" cy="14" rx="2.6" ry="1.4" fill="#ffe9c9" transform="rotate(10 66 14)" />
    </svg>
  </div>
);

/* ===== Data ===== */
const foodEmojis = ['🍔', '🍕', '🍟', '🥤', '🍩', '🍦', '🌮', '🥗', '🍰', '🍜', '🍣', '🥪'];
const colleges = [
  'Select your college',
  // Vidhyanagar (2)
  'BVM Engineering College, Vallabh Vidyanagar',
  'ADIT, New Vallabh Vidyanagar',
  // Anand (2)
  'Government Engineering College, Anand',
  'Sardar Patel University, Anand',
  // Vasad (1)
  'SVIT, Vasad',
  // Vadodara (3)
  'MSU Baroda, Vadodara',
  'Government Engineering College, Vadodara',
  'Parul University, Vadodara'
];
const particles = Array.from({ length: 14 }, (_, i) => ({
  emoji: foodEmojis[i % foodEmojis.length],
  left: Math.random() * 100,
  delay: Math.random() * 14,
  duration: 12 + Math.random() * 8,
  size: 16 + Math.random() * 18,
}));

const confettiColors = ['#ff6b35', '#f57c00', '#4caf50', '#2196f3', '#9c27b0', '#ffeb3b', '#e91e63', '#00bcd4'];
const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
  left: Math.random() * 100,
  delay: Math.random() * 0.8,
  duration: 2.4 + Math.random() * 2,
  color: confettiColors[i % confettiColors.length],
  size: 6 + Math.random() * 8,
  rotate: Math.random() * 360,
}));

/* ===== RFC 5322 Robust Email Validation ===== */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const validateEmailFormat = (rawEmail) => {
  if (!rawEmail || !rawEmail.trim()) {
    return { valid: false, error: 'Email address is required' };
  }
  const email = rawEmail.trim().toLowerCase();
  if (email.length > 254) {
    return { valid: false, error: 'Email address cannot exceed 254 characters' };
  }
  if (email.includes('..')) {
    return { valid: false, error: 'Email address cannot contain consecutive dots (..)' };
  }
  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, error: 'Please enter a valid email address with @ and domain' };
  }
  const [localPart, domainPart] = parts;
  if (localPart.length > 64) {
    return { valid: false, error: 'The email username part is too long (max 64 chars)' };
  }
  const domainSegments = domainPart.split('.');
  if (domainSegments.length < 2) {
    return { valid: false, error: 'Email must contain a valid domain extension (e.g. .com, .edu)' };
  }
  const tld = domainSegments[domainSegments.length - 1];
  if (tld.length < 2) {
    return { valid: false, error: 'Domain extension must have at least 2 characters (e.g. .com)' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Please enter a valid email address format (e.g. name@domain.com)' };
  }
  return { valid: true, error: null };
};

const Login = ({ onLoginSuccess, dark, onDarkToggle }) => {
  /* ---------- Core state ---------- */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isLogin, setIsLogin] = useState(true);
  const [view, setView] = useState('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', college: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [dishPhase, setDishPhase] = useState('idle');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const otpRefs = useRef([]);
  const emailRef = useRef(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successName, setSuccessName] = useState('Foodie');
  const [successCollege, setSuccessCollege] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [toasts, setToasts] = useState([]);

  /* Top Right Alert Popup state */
  const [rightAlert, setRightAlert] = useState(null);
  const rightAlertTimerRef = useRef(null);

  const [glow, setGlow] = useState({ x: 0, y: 0, active: false });
  const [typed, setTyped] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);

  const fullText = isLogin ? 'Welcome Back!' : 'Join Us!';

  /* ---------- Effects ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => { setTyped(''); setTypeIndex(0); }, [isLogin]);
  useEffect(() => {
    if (typeIndex < fullText.length) {
      const t = setTimeout(() => { setTyped(fullText.slice(0, typeIndex + 1)); setTypeIndex(typeIndex + 1); }, 48);
      return () => clearTimeout(t);
    }
  }, [typeIndex, fullText]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (view !== 'auth') return;
    const t = setTimeout(() => {
      if (!isLogin) document.getElementById('name')?.focus();
      else emailRef.current?.focus();
    }, 600);
    return () => clearTimeout(t);
  }, [isLogin, view]);

  useEffect(() => {
    if (!showSuccessPopup) return;
    const h = (e) => { if (e.key === 'Escape') { setShowSuccessPopup(false); setShowConfetti(false); if (onLoginSuccess) onLoginSuccess(successName, successCollege || formData.college, formData.email, formData.password); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [showSuccessPopup]);

  /* ---------- Helpers ---------- */
  const showRightAlert = useCallback((title, message, type = 'error') => {
    if (rightAlertTimerRef.current) clearTimeout(rightAlertTimerRef.current);
    const id = Date.now();
    setRightAlert({ id, title, message, type, exiting: false });
    rightAlertTimerRef.current = setTimeout(() => {
      setRightAlert((prev) => (prev ? { ...prev, exiting: true } : null));
      setTimeout(() => setRightAlert(null), 350);
    }, 4500);
  }, []);

  const closeRightAlert = useCallback(() => {
    if (rightAlertTimerRef.current) clearTimeout(rightAlertTimerRef.current);
    setRightAlert((prev) => (prev ? { ...prev, exiting: true } : null));
    setTimeout(() => setRightAlert(null), 350);
  }, []);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const getStrength = (pw) => {
    if (!pw) return { level: 0, label: '', color: 'transparent', width: '0%' };
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    s = Math.min(4, s);
    const map = [{ label: '', color: 'transparent' }, { label: 'Weak', color: '#ff4444' }, { label: 'Fair', color: '#ff9800' }, { label: 'Strong', color: '#4caf50' }, { label: 'Very Strong', color: '#2e7d32' }];
    return { level: s, label: map[s].label, color: map[s].color, width: `${s * 25}%` };
  };
  const strength = getStrength(formData.password);

  const validate = () => {
    const errs = {};
    if (!isLogin) {
      if (!formData.name.trim()) errs.name = 'Full name is required';
      else if (formData.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';
    }
    const emailCheck = validateEmailFormat(formData.email);
    if (!emailCheck.valid) {
      errs.email = emailCheck.error;
    }
    // College is only required on the Sign Up form
    if (!isLogin && !formData.college) errs.college = 'Please select your college';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!isLogin) {
      if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm your password';
      else if (formData.confirmPassword !== formData.password) errs.confirmPassword = 'Passwords do not match';
      if (!agreeTerms) errs.terms = 'Please accept the Terms & Conditions';
    }
    return errs;
  };

  const triggerErrorFeedback = (errs) => {
    setShake(true);
    addToast(Object.values(errs)[0] || 'Please fix the highlighted fields', 'error');
    setTimeout(() => setShake(false), 520);
  };

  const clearFieldError = (field) => {
    setErrors((prev) => { if (!prev[field]) return prev; const next = { ...prev }; delete next[field]; return next; });
  };

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) clearFieldError(name);
  };

  const handleEmailBlur = () => {
    if (formData.email && formData.email.trim()) {
      const emailCheck = validateEmailFormat(formData.email);
      if (!emailCheck.valid) {
        setErrors((prev) => ({ ...prev, email: emailCheck.error }));
        showRightAlert('Invalid Email Address', emailCheck.error, 'error');
      }
    }
  };

  const addRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = { x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size, id: Date.now() };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      triggerErrorFeedback(errs);
      if (errs.email) {
        showRightAlert('Invalid Email Address', errs.email, 'error');
      }
      return;
    }

    const cleanEmail = formData.email.trim().toLowerCase();
    setIsLoading(true);

    if (!isLogin) {
      // ===== REAL SUPABASE SIGN UP =====
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name.trim(),
              college: formData.college,
            },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          showRightAlert('Sign Up Failed', error.message || 'Unable to register account. Please try again.', 'error');
          setShake(true);
          setTimeout(() => setShake(false), 520);
          return;
        }

        // Check if user already exists
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          showRightAlert('Account Exists', 'An account with this email already exists. Please sign in instead.', 'warning');
          return;
        }

        // Auto confirmed
        if (data.session) {
          setSuccessName(formData.name || 'Foodie');
          setSuccessCollege(formData.college || '');
          setShowSuccessPopup(true);
          setShowConfetti(true);
          addToast('Account created and verified! Welcome 🎉', 'success');
          return;
        }

        // Email verification code sent
        setView('otp');
        setResendCooldown(60);
        showRightAlert(
          'Verification Code Sent',
          `A verification email has been sent to ${cleanEmail}. Check your inbox or spam for the 6-digit code.`,
          'success'
        );
        addToast(`Verification code sent to ${cleanEmail}`, 'success');
      } catch (err) {
        showRightAlert('Sign Up Error', err.message || 'Could not communicate with authentication server.', 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      // ===== REAL SUPABASE SIGN IN =====
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: formData.password,
        });

        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            showRightAlert(
              'Email Not Verified',
              'Your email is not verified yet. Please check your inbox for the verification code or click the confirmation link.',
              'warning'
            );
            setView('otp');
            setResendCooldown(0);
          } else if (error.message.toLowerCase().includes('invalid login credentials')) {
            showRightAlert('Sign In Failed', 'Invalid email or password. Please verify your credentials and try again.', 'error');
          } else {
            showRightAlert('Sign In Failed', error.message, 'error');
          }
          setShake(true);
          setTimeout(() => setShake(false), 520);
          return;
        }

        const userName = data.user?.user_metadata?.full_name || formData.name || cleanEmail.split('@')[0];
        const userCollege = data.user?.user_metadata?.college || formData.college;
        setSuccessName(userName);
        setSuccessCollege(userCollege || '');
        setShowSuccessPopup(true);
        setShowConfetti(true);
        addToast('Welcome back! You are signed in.', 'success');
      } catch (err) {
        showRightAlert('Sign In Error', err.message || 'Unable to connect to authentication service.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    if (dishPhase !== 'idle') return;
    // If on forgot/otp view, first go back to auth, then switch mode
    if (view !== 'auth') {
      handleBackToAuth();
      // handleBackToAuth sets isLogin(true); if we want Sign Up we flip it after
      setTimeout(() => {
        setIsLogin(false);
      }, 50);
      return;
    }
    setErrors({});
    setShowSuccessPopup(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '', college: '' });
    setAgreeTerms(false);
    setDishPhase('cover');
    setTimeout(() => { setIsLogin((prev) => !prev); setDishPhase('reveal'); }, 480);
    setTimeout(() => setDishPhase('idle'), 1100);
  };

  const handleBackToAuth = () => {
    setView('auth');
    setIsLogin(true);
    setErrors({});
    setShowSuccessPopup(false);
    setShowConfetti(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '', college: '' });
    setAgreeTerms(false);
    setRememberMe(false);
    setForgotEmail('');
    setForgotSent(false);
    setOtp(['', '', '', '', '', '']);
    setResendCooldown(0);
  };

  const handleOtpChange = (idx, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    setOtp((prev) => { const next = [...prev]; next[idx] = digit; return next; });
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKey = (e, idx) => { if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus(); };
  
  const handleOtpSubmit = async () => {
    const code = otp.join('').trim();
    if (code.length !== 6) {
      showRightAlert('Incomplete Code', 'Please enter all 6 digits of the verification code.', 'warning');
      setShake(true);
      setTimeout(() => setShake(false), 520);
      return;
    }

    setIsOtpLoading(true);
    const cleanEmail = formData.email.trim().toLowerCase();
    try {
      let { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: code,
        type: 'signup',
      });

      if (error) {
        // Fallback to 'email' type if project configured with magic link / email type
        const retry = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: code,
          type: 'email',
        });
        if (retry.error) {
          showRightAlert('Verification Failed', retry.error.message || 'Invalid or expired 6-digit code. Please try again or request a new code.', 'error');
          setShake(true);
          setTimeout(() => setShake(false), 520);
          return;
        }
        data = retry.data;
      }

      const userName = data?.user?.user_metadata?.full_name || formData.name || cleanEmail.split('@')[0] || 'Foodie';
      const userCollege = data?.user?.user_metadata?.college || formData.college;
      setSuccessName(userName);
      setSuccessCollege(userCollege || '');
      setShowSuccessPopup(true);
      setShowConfetti(true);
      addToast('Email verified! Welcome to BufferBites 🎉', 'success');
    } catch (err) {
      showRightAlert('Verification Error', err.message || 'An unexpected error occurred during verification.', 'error');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    const cleanEmail = formData.email.trim().toLowerCase();
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        showRightAlert('Resend Failed', error.message || 'Unable to resend verification email right now.', 'error');
      } else {
        setResendCooldown(60);
        showRightAlert('Code Resent', `A fresh verification email was sent to ${cleanEmail}.`, 'success');
        addToast('Verification code resent!', 'success');
      }
    } catch (err) {
      showRightAlert('Resend Error', err.message, 'error');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const clean = forgotEmail.trim().toLowerCase();
    const check = validateEmailFormat(clean);
    if (!check.valid) {
      showRightAlert('Invalid Email Address', check.error, 'error');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: window.location.origin,
      });

      if (error) {
        showRightAlert('Reset Failed', error.message, 'error');
      } else {
        setForgotSent(true);
        showRightAlert('Link Sent', `Password reset instructions sent to ${clean}.`, 'success');
        addToast('Reset link sent! Check your inbox.', 'success');
      }
    } catch (err) {
      showRightAlert('Reset Error', err.message, 'error');
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  };
  const handleMouseLeave = () => setGlow((prev) => ({ ...prev, active: false }));

  /* ---------- Render ---------- */
  return (
    <div className="login-page">
      {/* Floating food particles */}
      {particles.map((p, i) => (
        <span key={i} className="food-particle" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, fontSize: `${p.size}px` }}>{p.emoji}</span>
      ))}

      {/* Confetti */}
      {showConfetti && confettiPieces.map((c, i) => (
        <span key={i} className="confetti-piece" style={{ left: `${c.left}%`, animationDelay: `${c.delay}s`, animationDuration: `${c.duration}s`, background: c.color, width: `${c.size}px`, height: `${c.size}px`, transform: `rotate(${c.rotate}deg)` }} />
      ))}

      {/* ===== TOP RIGHT ALERT POPUP ===== */}
      {rightAlert && (
        <div className="top-right-alert-container" role="alert" aria-live="assertive">
          <div className={`top-right-alert alert-${rightAlert.type} ${rightAlert.exiting ? 'alert-exiting' : ''}`}>
            <div className="alert-icon-box">
              {rightAlert.type === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <div className="alert-body">
              <div className="alert-title">{rightAlert.title}</div>
              <div className="alert-message">{rightAlert.message}</div>
            </div>
            <button type="button" className="alert-close-btn" onClick={closeRightAlert} aria-label="Close notification">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="alert-progress" />
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{t.type === 'success' ? '✓' : '✕'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* ===== TOP NAVBAR ===== */}
      <nav className="top-nav">
        <div className="nav-brand">
          <svg className="nav-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            <path d="M21 15h-3" />
          </svg>
          <span className="nav-title">BufferBites</span>
        </div>
        <div className="nav-links">
          <button className="dark-toggle" onClick={onDarkToggle} aria-label="Toggle dark mode">
            {dark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* ===== MAIN CONTAINER ===== */}
      <div className="login-container">
        <div className="bg-aurora" />
        <div className="login-card">
          {/* LEFT PANEL */}
          <div className={`welcome-panel panel-enter-left ${isLogin ? '' : 'register-active'}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="welcome-content content-switch" key={isLogin ? 'welcome-login' : 'welcome-register'}>
              <DishIllustration className="dish-brand" />
              <h1 className="welcome-title">{typed}<span className="cursor-blink">|</span></h1>
              <p className="welcome-text">
                {isLogin ? 'Sign in to your account to continue your journey with BufferBites.' : 'Create an account and start exploring delicious possibilities.'}
</p>

              <div className="welcome-footer">
                <p className="toggle-text">{isLogin ? "Don't have an account?" : 'Already have an account?'}</p>
                <button type="button" className="toggle-btn" onClick={toggleMode}>{isLogin ? 'Sign Up' : 'Sign In'}</button>
              </div>
            </div>

            {/* Cursor glow */}
            {glow.active && <div className="cursor-glow" style={{ left: glow.x, top: glow.y }} />}

            <div className="floating-shapes">
              <div className="shape shape-1" /><div className="shape shape-2" /><div className="shape shape-3" /><div className="shape shape-4" />
            </div>
          </div>

          {/* Dish Transition Overlay */}
          <div className={`dish-transition ${dishPhase}`} aria-hidden="true"><DishIllustration className="dish-overlay" /></div>

          {/* RIGHT PANEL */}
          <div className="form-panel panel-enter-right">
            <div className="form-glow" aria-hidden="true" />
            <div className="form-bubbles" aria-hidden="true">
              <span className="form-bubble" /><span className="form-bubble" /><span className="form-bubble" /><span className="form-bubble" />
              <span className="form-bubble" /><span className="form-bubble" /><span className="form-bubble" /><span className="form-bubble" />
            </div>
            <div className="form-graphics" aria-hidden="true">
              <svg className="graphic graphic-1" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="rgba(255,107,53,0.08)" stroke="rgba(255,107,53,0.18)" strokeWidth="1.5" /><path d="M18 44C18 36 24 30 40 30C56 30 62 36 62 44V48H18V44Z" fill="#e8a24b" fillOpacity="0.3" /><rect x="16" y="36" width="48" height="6" rx="3" fill="#8a4a2b" fillOpacity="0.3" /><path d="M16 34C22 28 30 25 40 25C50 25 58 28 64 34H16Z" fill="#f2b45c" fillOpacity="0.25" /></svg>
              <svg className="graphic graphic-2" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="rgba(245,124,0,0.08)" stroke="rgba(245,124,0,0.18)" strokeWidth="1.5" /><path d="M20 54L38 22L56 54H20Z" fill="#f5c542" fillOpacity="0.25" /></svg>
              <svg className="graphic graphic-3" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="rgba(230,81,0,0.07)" stroke="rgba(230,81,0,0.16)" strokeWidth="1.5" /><rect x="26" y="22" width="28" height="36" rx="3" fill="rgba(255,152,0,0.12)" stroke="rgba(255,152,0,0.15)" strokeWidth="1.5" /></svg>
              <svg className="graphic graphic-4" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="rgba(255,152,0,0.07)" stroke="rgba(255,152,0,0.16)" strokeWidth="1.5" /><path d="M18 44C18 44 24 56 40 56C56 56 62 44 62 44H18Z" fill="rgba(255,107,53,0.12)" /></svg>
              <svg className="graphic graphic-5" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="rgba(255,107,53,0.06)" stroke="rgba(255,107,53,0.15)" strokeWidth="1.5" /><rect x="30" y="34" width="6" height="18" rx="2" fill="#f2b45c" fillOpacity="0.25" transform="rotate(-8 33 43)" /><rect x="38" y="32" width="6" height="20" rx="2" fill="#f2b45c" fillOpacity="0.22" transform="rotate(2 41 42)" /><rect x="46" y="35" width="6" height="16" rx="2" fill="#f2b45c" fillOpacity="0.25" transform="rotate(10 49 43)" /><rect x="24" y="50" width="32" height="6" rx="3" fill="#e65100" fillOpacity="0.15" /></svg>
              <svg className="graphic graphic-6" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="rgba(245,124,0,0.06)" stroke="rgba(245,124,0,0.15)" strokeWidth="1.5" /><path d="M16 42C16 42 24 52 40 52C56 52 64 42 64 42" stroke="#f2b45c" strokeOpacity="0.3" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
              <svg className="graphic graphic-7" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="rgba(230,81,0,0.06)" stroke="rgba(230,81,0,0.14)" strokeWidth="1.5" /><path d="M30 44C30 44 34 28 40 28C46 28 50 44 50 44H30Z" fill="#f5c542" fillOpacity="0.2" /></svg>
              <svg className="graphic graphic-8" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="rgba(255,152,0,0.06)" stroke="rgba(255,152,0,0.14)" strokeWidth="1.5" /><circle cx="40" cy="40" r="16" fill="#f2b45c" fillOpacity="0.2" /><circle cx="40" cy="40" r="6" fill="rgba(255,255,255,0.3)" /></svg>
            </div>

            <div className="form-wrapper">
              {view === 'auth' && (
                <>
                  <h2 className="form-title title-switch" key={`ft-${isLogin}`}>{isLogin ? 'Sign In' : 'Create Account'}</h2>
                  <p className="form-subtitle subtitle-switch" key={`fs-${isLogin}`}>{isLogin ? 'Enter your credentials to access your account' : 'Fill in the details to get started'}</p>

                  <form noValidate className={`auth-form ${isLogin ? 'login-form' : 'register-form'} ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
                    <div className={`input-group ${!isLogin ? 'slide-down' : 'slide-up'}`} key={isLogin ? 'ig-login' : 'ig-register'}>
                      {!isLogin && (
                        <div className="input-field">
                          <label htmlFor="name">Full Name <span style={{color:'#ff4444'}}>*</span></label>
                          <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            <input type="text" id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required={!isLogin} className={errors.name ? 'input-error' : ''} />
                            <span className="input-highlight" />
                          </div>
                          {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>
                      )}
                      <div className="input-field">
                        <label htmlFor="email">Email Address <span style={{color:'#ff4444'}}>*</span></label>
                        <div className="input-wrapper">
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                          <input type="email" id="email" name="email" ref={emailRef} placeholder="you@example.com" value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} className={errors.email ? 'input-error' : ''} autoComplete="email" />
                          <span className="input-highlight" />
                        </div>
                        {errors.email && <span className="field-error">{errors.email}</span>}
                      </div>
                      <div className="input-field" ref={dropdownRef}>
                        <label>College <span style={{color:'#ff4444'}}>*</span></label>
                        <div 
                          className={`input-wrapper custom-select ${isDropdownOpen ? 'active' : ''}`}
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          tabIndex={0}
                        >
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V6l6-4 6 4v16" /><path d="M6 10h12" /><path d="M6 18h12" /></svg>
                          <div className={`custom-select-display ${errors.college ? 'input-error' : ''} ${!formData.college ? 'placeholder' : ''}`}>
                            {formData.college || 'Select your college'}
                          </div>
                          <span className="input-highlight" />
                          <svg className={`select-arrow ${isDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        {isDropdownOpen && (
                          <ul className="custom-dropdown-menu">
                            {colleges.map((college) => {
                              const val = college === 'Select your college' ? '' : college;
                              return (
                                <li 
                                  key={college} 
                                  className={`custom-dropdown-item ${formData.college === val ? 'selected' : ''} ${val === '' ? 'placeholder-item' : ''}`}
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, college: val }));
                                    setIsDropdownOpen(false);
                                    if (errors.college) clearFieldError('college');
                                  }}
                                >
                                  {college}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        {errors.college && <span className="field-error">{errors.college}</span>}
                      </div>
                      <div className="input-field">
                        <label htmlFor="password">Password <span style={{color:'#ff4444'}}>*</span></label>
                        <div className="input-wrapper">
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className={errors.password ? 'input-error' : ''} />
                          <button type="button" className="eye-btn" onClick={() => setShowPassword((p) => !p)} tabIndex={-1} aria-label="Toggle password visibility">
                            {showPassword ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><path d="M1 1l22 22" /></svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            )}
                          </button>
                          <span className="input-highlight" />
                        </div>
                        {errors.password && <span className="field-error">{errors.password}</span>}

                        {/* Password Strength Meter */}
                        {!isLogin && formData.password && (
                          <div className="strength-meter">
                            <div className="strength-bar"><div className="strength-fill" style={{ width: strength.width, background: strength.color }} /></div>
                            <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                          </div>
                        )}
                      </div>
                      {!isLogin && (
                        <div className="input-field">
                          <label htmlFor="confirmPassword">Confirm Password <span style={{color:'#ff4444'}}>*</span></label>
                          <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="16" r="1" /></svg>
                            <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required={!isLogin} className={errors.confirmPassword ? 'input-error' : ''} />
                            <button type="button" className="eye-btn" onClick={() => setShowConfirm((p) => !p)} tabIndex={-1} aria-label="Toggle confirm password visibility">
                              {showConfirm ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><path d="M1 1l22 22" /></svg>
                              ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                              )}
                            </button>
                            <span className="input-highlight" />
                          </div>
                          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                        </div>
                      )}
                    </div>

                    {/* Checkboxes */}
                    <div className="checkbox-row">
                      {isLogin ? (
                        <label className="checkbox-label">
                          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                          <span className="checkmark" />
                          Remember me
                        </label>
                      ) : (
                        <label className={`checkbox-label ${errors.terms ? 'checkbox-error' : ''}`}>
                          <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                          <span className="checkmark" />
                          I agree to the <a href="#terms">Terms</a>
                        </label>
                      )}
                    </div>
                    {errors.terms && <span className="field-error terms-error">{errors.terms}</span>}

                    {isLogin && (
                      <div className="forgot-password fade-stagger" key="forgot">
                        <button type="button" className="forgot-link" onClick={() => { setView('forgot'); setForgotEmail(''); setForgotSent(false); }}>Forgot password?</button>
                      </div>
                    )}

                    <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading} onClick={addRipple}>
                      {ripples.map((r) => <span key={r.id} className="ripple" style={{ left: r.x, top: r.y, width: r.size, height: r.size }} />)}
                      {isLoading ? <div className="spinner"><div className="spinner-ring" /><span>Processing...</span></div> : isLogin ? <span className="btn-text">Sign In</span> : <span className="btn-text">Create Account</span>}
                    </button>
                  </form>
                </>
              )}

              {/* Forgot Password View */}
              {view === 'forgot' && (
                <div className="forgot-view">
                  <h2 className="form-title">Reset Password</h2>
                  <p className="form-subtitle">Enter your email and we'll send you a reset link.</p>
                  {!forgotSent ? (
                    <form noValidate onSubmit={handleForgot}>
                      <div className="input-field">
                        <label htmlFor="forgotEmail">Email Address</label>
                        <div className="input-wrapper">
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                          <input type="email" id="forgotEmail" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required autoComplete="email" />
                          <span className="input-highlight" />
                        </div>
                      </div>
                      <button type="submit" className="submit-btn">Send Reset Link</button>
                    </form>
                  ) : (
                    <div className="forgot-sent">
                      <div className="sent-icon">✉️</div>
                      <p>Check your inbox! A reset link has been sent.</p>
                    </div>
                  )}
                  <button type="button" className="back-link" onClick={handleBackToAuth}>← Back to Sign In</button>
                </div>
              )}

              {/* OTP View */}
              {view === 'otp' && (
                <div className="otp-view">
                  <h2 className="form-title">Verify Email</h2>
                  <p className="form-subtitle">
                    Enter the 6-digit code sent to <strong style={{ color: '#ff6b35' }}>{formData.email}</strong>
                  </p>
                  <div className={`otp-inputs ${shake ? 'shake' : ''}`}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKey(e, idx)}
                        ref={(el) => { otpRefs.current[idx] = el; }}
                        className="otp-box"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`submit-btn ${isOtpLoading ? 'loading' : ''}`}
                    disabled={isOtpLoading}
                    onClick={handleOtpSubmit}
                  >
                    {isOtpLoading ? (
                      <div className="spinner"><div className="spinner-ring" /><span>Verifying...</span></div>
                    ) : (
                      <span className="btn-text">Verify Email</span>
                    )}
                  </button>

                  <div className="otp-resend-row">
                    <span>Didn't receive the code?</span>
                    <button
                      type="button"
                      className="otp-resend-btn"
                      disabled={resendCooldown > 0}
                      onClick={handleResendOtp}
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>

                  <div className="otp-note">
                    💡 <strong>Tip:</strong> If your verification email contains a confirmation link instead of an OTP, clicking the link in your email inbox will also verify your account.
                  </div>

                  <button type="button" className="back-link" onClick={handleBackToAuth} style={{ marginTop: '16px' }}>
                    ← Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="page-footer">
        <span>© 2025 BufferBites. All rights reserved.</span>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>

      {/* ===== SUCCESS POPUP ===== */}
      {showSuccessPopup && (
        <div className="popup-overlay" onClick={() => { setShowSuccessPopup(false); setShowConfetti(false); if (onLoginSuccess) onLoginSuccess(successName, successCollege || formData.college, formData.email, formData.password); }}>
          <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="popup-checkmark">
              <svg className="checkmark-circle" viewBox="0 0 52 52">
                <circle className="checkmark-circle-bg" cx="26" cy="26" r="24" fill="none" />
                <path className="checkmark-check" d="M14 27l7 7 16-16" fill="none" />
              </svg>
            </div>
            <h2 className="popup-title">
              {`Welcome, ${successName}! 🎉`}
            </h2>
            <p className="popup-text">
              You have successfully signed in. Get ready to explore delicious meals!
            </p>
            <button
              type="button"
              className="popup-btn"
              onClick={() => {
                setShowSuccessPopup(false);
                setShowConfetti(false);
                if (onLoginSuccess) onLoginSuccess(successName, successCollege || formData.college, formData.email, formData.password);
              }}
            >
              {"Let's Eat! 🍔"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
