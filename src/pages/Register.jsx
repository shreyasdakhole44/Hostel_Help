import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { THEME } from '../theme';
import LoadingSpinner from '../components/LoadingSpinner';
import hostelHelpLogo from '../assets/hostel-help-logo.png';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: THEME.colors.gray200 };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: THEME.colors.red500 };
    if (score <= 4) return { score, label: 'Good', color: THEME.colors.yellow500 };
    return { score, label: 'Strong', color: THEME.colors.green500 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('You must accept the Terms & Conditions to register.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        name,
        roomNumber,
        email,
        phone,
        password
      });

      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Registration failed. Email might already exist.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: THEME.colors.gray50,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: THEME.fonts.family,
        padding: '32px 24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: THEME.colors.white,
          borderRadius: THEME.radius.card,
          padding: '40px',
          boxShadow: THEME.shadows.dropdown,
          border: `1.5px solid ${THEME.colors.gray200}`
        }}
      >
        {/* App Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <img
            src={hostelHelpLogo}
            alt="Hostel Help Logo"
            style={{
              height: '56px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Header */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '6px' }}>
            Create your account
          </h2>
          <p style={{ color: THEME.colors.gray500, fontSize: '14px' }}>
            Join Hostel Help today and start managing your complaints efficiently.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 2-Column Row: Full Name & Room Number */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shreyas Dakhole"
                style={{
                  height: '44px',
                  borderRadius: THEME.radius.input,
                  border: `1.5px solid ${THEME.colors.gray200}`,
                  padding: '0 14px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: THEME.transition
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME.colors.purple500;
                  e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = THEME.colors.gray200;
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            <div style={{ flex: '0.6', minWidth: '100px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Room No.</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="B-304"
                style={{
                  height: '44px',
                  borderRadius: THEME.radius.input,
                  border: `1.5px solid ${THEME.colors.gray200}`,
                  padding: '0 14px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: THEME.transition
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME.colors.purple500;
                  e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = THEME.colors.gray200;
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              style={{
                height: '44px',
                borderRadius: THEME.radius.input,
                border: `1.5px solid ${THEME.colors.gray200}`,
                padding: '0 14px',
                fontSize: '14px',
                outline: 'none',
                transition: THEME.transition
              }}
              onFocus={(e) => {
                e.target.style.borderColor = THEME.colors.purple500;
                e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = THEME.colors.gray200;
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              style={{
                height: '44px',
                borderRadius: THEME.radius.input,
                border: `1.5px solid ${THEME.colors.gray200}`,
                padding: '0 14px',
                fontSize: '14px',
                outline: 'none',
                transition: THEME.transition
              }}
              onFocus={(e) => {
                e.target.style.borderColor = THEME.colors.purple500;
                e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = THEME.colors.gray200;
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={{
                height: '44px',
                borderRadius: THEME.radius.input,
                border: `1.5px solid ${THEME.colors.gray200}`,
                padding: '0 14px',
                fontSize: '14px',
                outline: 'none',
                transition: THEME.transition
              }}
              onFocus={(e) => {
                e.target.style.borderColor = THEME.colors.purple500;
                e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = THEME.colors.gray200;
                e.target.style.boxShadow = 'none';
              }}
              required
            />

            {/* Password strength bar */}
            {password && (
              <div style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                  <span style={{ color: THEME.colors.gray500 }}>Password Strength:</span>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: THEME.colors.gray100, borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(strength.score / 5) * 100}%`,
                      backgroundColor: strength.color,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              style={{
                height: '44px',
                borderRadius: THEME.radius.input,
                border: `1.5px solid ${THEME.colors.gray200}`,
                padding: '0 14px',
                fontSize: '14px',
                outline: 'none',
                transition: THEME.transition
              }}
              onFocus={(e) => {
                e.target.style.borderColor = THEME.colors.purple500;
                e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = THEME.colors.gray200;
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Terms checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '13px', color: THEME.colors.gray600, marginTop: '4px' }}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{
                accentColor: THEME.colors.purple600,
                cursor: 'pointer',
                width: '16px',
                height: '16px',
                marginTop: '2px'
              }}
            />
            <span>
              I agree to the{' '}
              <a href="#" style={{ color: THEME.colors.purple600, textDecoration: 'none', fontWeight: '600' }} onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" style={{ color: THEME.colors.purple600, textDecoration: 'none', fontWeight: '600' }} onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: THEME.gradients.primaryBtn,
              color: THEME.colors.white,
              border: 'none',
              height: '46px',
              borderRadius: THEME.radius.button,
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: THEME.shadows.button,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: THEME.transition,
              marginTop: '10px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.filter = 'brightness(0.95)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? <LoadingSpinner size="20px" color="#FFFFFF" /> : 'Create Account'}
          </button>
        </form>

        {/* Redirect link */}
        <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '24px' }}>
          <span style={{ color: THEME.colors.gray500 }}>Already have an account? </span>
          <span
            onClick={() => navigate('/login')}
            style={{ color: THEME.colors.purple600, fontWeight: '700', cursor: 'pointer' }}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;