import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { THEME } from '../theme';
import LoadingSpinner from '../components/LoadingSpinner';
import hostelHelpLogo from '../assets/hostel-help-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      
      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (data.role === 'WARDEN') {
        navigate('/warden/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Invalid email or password. Please try again.';
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
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
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
            marginBottom: '32px',
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
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '8px' }}>
            Welcome back 👋
          </h2>
          <p style={{ color: THEME.colors.gray500, fontSize: '14px' }}>
            Enter your credentials to access your dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '14px', color: THEME.colors.gray500 }}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: THEME.radius.input,
                  border: `1.5px solid ${THEME.colors.gray200}`,
                  padding: '0 14px 0 40px',
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

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '14px', color: THEME.colors.gray500 }}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: THEME.radius.input,
                  border: `1.5px solid ${THEME.colors.gray200}`,
                  padding: '0 40px 0 40px',
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  color: THEME.colors.gray500,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: THEME.colors.gray600 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  accentColor: THEME.colors.purple600,
                  cursor: 'pointer',
                  width: '15px',
                  height: '15px'
                }}
              />
              Remember me
            </label>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); toast.info("Password recovery details sent to email."); }}
              style={{ color: THEME.colors.purple600, textDecoration: 'none', fontWeight: '600' }}
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
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
              marginTop: '8px'
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
            {loading ? <LoadingSpinner size="20px" color="#FFFFFF" /> : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: THEME.colors.gray200 }} />
          <span style={{ fontSize: '13px', color: THEME.colors.gray500 }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: THEME.colors.gray200 }} />
        </div>

        {/* Redirect link */}
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: THEME.colors.gray500 }}>New student? </span>
          <span
            onClick={() => navigate('/register')}
            style={{ color: THEME.colors.purple600, fontWeight: '700', cursor: 'pointer' }}
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;