import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEME } from '../theme';
import StatusBadge from '../components/StatusBadge';
import hostelHelpLogo from '../assets/hostel-help-logo.png';
import { 
  FileText, 
  BarChart2, 
  UserCheck, 
  Bell, 
  ClipboardList, 
  Star, 
  GraduationCap, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featureList = [
    { icon: FileText, title: 'Submit Complaints', desc: 'Log complaints instantly, choose categories, and get immediate tracking numbers.' },
    { icon: BarChart2, title: 'Real-time Tracking', desc: 'Watch your complaint go from Pending to In Progress to Resolved in real-time.' },
    { icon: UserCheck, title: 'Smart Assignment', desc: 'Auto-route complaints directly to the warden assigned to that specific category.' },
    { icon: Bell, title: 'Email Alerts', desc: 'Receive instant notifications when wardens accept or resolve your complaints.' },
    { icon: ClipboardList, title: 'Admin Control', desc: 'Full-featured back-office admin dashboard for categories, wardens, and metrics.' },
    { icon: Star, title: 'Feedback System', desc: 'Students can review and rate resolutions to ensure quality standards.' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: THEME.colors.white, fontFamily: THEME.fonts.family }}>
      
      {/* Sticky Navbar */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '72px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${THEME.colors.gray100}`,
          boxShadow: scrolled ? '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          zIndex: 1000,
          transition: THEME.transition
        }}
      >
        {/* Left: Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={hostelHelpLogo}
            alt="Hostel Help Logo"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Center: Links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Features', 'How it Works', 'Stats', 'About'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, '-')}`}
              style={{
                textDecoration: 'none',
                color: THEME.colors.gray700,
                fontSize: '15px',
                fontWeight: '500',
                transition: THEME.transition
              }}
              onMouseEnter={(e) => {
                e.target.style.color = THEME.colors.purple600;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = THEME.colors.gray700;
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: `1.5px solid ${THEME.colors.purple600}`,
              borderRadius: THEME.radius.button,
              padding: '8px 18px',
              color: THEME.colors.purple600,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: THEME.transition
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = THEME.colors.purple50;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: THEME.gradients.primaryBtn,
              border: 'none',
              borderRadius: THEME.radius.button,
              padding: '10px 20px',
              color: THEME.colors.white,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: THEME.shadows.button,
              transition: THEME.transition
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(0.95)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: '100px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '64px',
          flexWrap: 'wrap'
        }}
      >
        {/* Hero Left */}
        <div style={{ flex: '1.2', minWidth: '320px' }}>
          {/* Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: THEME.colors.purple100,
              color: THEME.colors.purple700,
              padding: '6px 16px',
              borderRadius: THEME.radius.badge,
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '24px'
            }}
          >
            <GraduationCap size={16} />
            Built for Modern Hostels
          </span>

          <h1
            style={{
              fontSize: THEME.fonts.sizes.h1,
              fontWeight: '800',
              color: THEME.colors.gray900,
              lineHeight: '1.2',
              marginBottom: '20px',
              maxWidth: '560px'
            }}
          >
            Smart Complaint Management for Modern Hostels
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: THEME.colors.gray700,
              lineHeight: '1.6',
              marginBottom: '32px',
              maxWidth: '480px'
            }}
          >
            Streamline resolution times, assign wardens instantly, and keep students informed every step of the way with a premium SaaS interface.
          </p>

          {/* Hero Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: THEME.gradients.primaryBtn,
                border: 'none',
                borderRadius: THEME.radius.button,
                padding: '14px 28px',
                color: THEME.colors.white,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: THEME.shadows.button,
                transition: THEME.transition,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0.95)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Start for Free</span>
              <ArrowRight size={18} />
            </button>
            <button
              style={{
                background: THEME.colors.white,
                border: `1.5px solid ${THEME.colors.gray200}`,
                borderRadius: THEME.radius.button,
                padding: '14px 28px',
                color: THEME.colors.gray700,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: THEME.transition
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = THEME.colors.gray50;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = THEME.colors.white;
              }}
            >
              Watch Demo
            </button>
          </div>

          {/* Trust Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatars */}
            <div style={{ display: 'flex', marginRight: '8px' }}>
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: `2px solid ${THEME.colors.white}`,
                    backgroundColor: THEME.colors.purple500,
                    marginLeft: idx > 1 ? '-8px' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: THEME.colors.white,
                    fontSize: '10px',
                    fontWeight: '700'
                  }}
                >
                  {['A', 'R', 'S', 'N', 'K'][idx - 1]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', color: THEME.colors.yellow500, fontSize: '14px', lineHeight: 1 }}>
                ★★★★★
              </div>
              <span style={{ fontSize: '13px', color: THEME.colors.gray500, fontWeight: '500' }}>
                Trusted by 500+ students & staff
              </span>
            </div>
          </div>
        </div>

        {/* Hero Right: Mockup Card */}
        <div
          style={{
            flex: '0.8',
            minWidth: '320px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: THEME.colors.white,
              borderRadius: THEME.radius.card,
              boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
              transform: 'rotate(-2deg)',
              overflow: 'hidden',
              border: `1px solid ${THEME.colors.gray100}`,
              transition: THEME.transition
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(-2deg) scale(1)';
            }}
          >
            {/* Gradient accent bar */}
            <div style={{ height: '6px', background: THEME.gradients.hero }} />

            {/* Dashboard Mockup Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '600' }}>OVERVIEW</span>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: THEME.colors.gray900 }}>Complaints Center</div>
                </div>
                <span style={{ color: THEME.colors.purple600, display: 'flex', alignItems: 'center' }}>
                  <Zap size={20} />
                </span>
              </div>

              {/* Mini Stat Cards */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {[
                  { value: '28', label: 'Total', color: THEME.colors.blue500 },
                  { value: '3', label: 'Pending', color: THEME.colors.yellow500 },
                  { value: '25', label: 'Resolved', color: THEME.colors.green500 }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      backgroundColor: THEME.colors.gray50,
                      borderRadius: THEME.radius.small,
                      padding: '12px',
                      textAlign: 'center',
                      border: `1px solid ${THEME.colors.gray100}`
                    }}
                  >
                    <div style={{ fontSize: '18px', fontWeight: '800', color: THEME.colors.gray900 }}>{stat.value}</div>
                    <div style={{ fontSize: '10px', color: THEME.colors.gray500, fontWeight: '500' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Small Complaints List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { title: 'Ceiling Fan Not Working', cat: 'Electrical', status: 'PENDING' },
                  { title: 'Water Leakage Room 302', cat: 'Plumbing', status: 'IN_PROGRESS' },
                  { title: 'Wi-Fi Speed Dropping', cat: 'Internet', status: 'RESOLVED' }
                ].map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: THEME.colors.white,
                      border: `1px solid ${THEME.colors.gray100}`,
                      borderRadius: '10px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: THEME.colors.gray900 }}>{comp.title}</div>
                      <div style={{ fontSize: '10px', color: THEME.colors.gray500 }}>{comp.cat}</div>
                    </div>
                    <StatusBadge status={comp.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          backgroundColor: THEME.colors.gray50,
          padding: '100px 40px',
          borderTop: `1px solid ${THEME.colors.gray100}`,
          borderBottom: `1px solid ${THEME.colors.gray100}`
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: THEME.colors.purple100,
              color: THEME.colors.purple600,
              fontSize: '11px',
              fontWeight: '700',
              padding: '4px 12px',
              borderRadius: THEME.radius.badge,
              letterSpacing: '0.8px',
              marginBottom: '16px'
            }}
          >
            FEATURES
          </span>
          <h2
            style={{
              fontSize: THEME.fonts.sizes.h2,
              fontWeight: '800',
              color: THEME.colors.gray900,
              marginBottom: '48px'
            }}
          >
            Everything you need to manage complaints
          </h2>

          {/* 3-Column Feature Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              textAlign: 'left'
            }}
          >
            {featureList.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: THEME.colors.white,
                  borderRadius: THEME.radius.card,
                  padding: '24px',
                  boxShadow: THEME.shadows.card,
                  transition: THEME.transition,
                  cursor: 'default',
                  border: `1px solid ${THEME.colors.gray100}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = THEME.shadows.card;
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: THEME.colors.purple50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: THEME.colors.purple600
                  }}
                >
                  <feat.icon size={22} />
                </div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: THEME.colors.gray900,
                    marginBottom: '8px'
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: THEME.colors.gray500,
                    lineHeight: '1.6'
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ padding: '100px 40px', backgroundColor: THEME.colors.white }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: THEME.fonts.sizes.h2,
              fontWeight: '800',
              color: THEME.colors.gray900,
              marginBottom: '64px'
            }}
          >
            How it works
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px',
              flexWrap: 'wrap'
            }}
          >
            {[
              { num: '1', title: 'Submit Details', desc: 'Students report electrical, plumbing, or internet problems via a forms dashboard.' },
              { num: '2', title: 'Admin Assigns', desc: 'System auto-routes to wardens, or admin manually manages assignments.' },
              { num: '3', title: 'Warden Resolves', desc: 'Wardens start working, post remark logs, and mark status as resolved.' }
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{ flex: 1, minWidth: '240px', maxWidth: '300px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: THEME.colors.purple600,
                      color: THEME.colors.white,
                      fontSize: '24px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: THEME.colors.gray900, marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: THEME.colors.gray500, lineHeight: '1.6' }}>
                    {step.desc}
                  </p>
                </div>
                {idx < 2 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: THEME.colors.purple200,
                      // Hide connectors on mobile screens
                      ...(window.innerWidth < 768 && {
                        display: 'none'
                      })
                    }}
                  >
                    <ArrowRight size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section
        id="stats"
        style={{
          background: THEME.gradients.hero,
          color: THEME.colors.white,
          padding: '64px 40px',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}
        >
          {[
            { value: '500+', label: 'Students' },
            { value: '98%', label: 'Resolution Rate' },
            { value: '< 24hrs', label: 'Avg Response Time' }
          ].map((stat, idx) => (
            <div key={idx} style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: THEME.colors.purple100 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 40px', textAlign: 'center', backgroundColor: THEME.colors.white }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: THEME.colors.gray900,
              marginBottom: '16px'
            }}
          >
            Ready to transform hostel management?
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: THEME.colors.gray500,
              marginBottom: '32px',
              lineHeight: 1.6
            }}
          >
            Join hundreds of hostels using Hostel Help to resolve issues in hours instead of days.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: THEME.gradients.primaryBtn,
                border: 'none',
                borderRadius: THEME.radius.button,
                padding: '14px 28px',
                color: THEME.colors.white,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: THEME.shadows.button,
                transition: THEME.transition
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0.95)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Start for Free
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: THEME.colors.white,
                border: `1.5px solid ${THEME.colors.purple600}`,
                borderRadius: THEME.radius.button,
                padding: '14px 28px',
                color: THEME.colors.purple600,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: THEME.transition
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = THEME.colors.purple50;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = THEME.colors.white;
              }}
            >
              Sign In Instead
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: THEME.colors.gray900,
          color: THEME.colors.white,
          padding: '64px 40px 32px'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '48px',
            flexWrap: 'wrap',
            marginBottom: '48px'
          }}
        >
          {/* Logo column */}
          <div style={{ flex: '1.5', minWidth: '240px' }}>
            <div 
              style={{ marginBottom: '16px', cursor: 'pointer' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src={hostelHelpLogo}
                alt="Hostel Help Logo"
                style={{
                  height: '44px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
            <p style={{ color: THEME.colors.gray500, fontSize: '14px', lineHeight: 1.6, maxWidth: '280px' }}>
              Premium complaint management SaaS platform built specifically for Indian hostel ecosystems.
            </p>
          </div>

          {/* Links columns */}
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'API Docs', 'Status'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Blog'] },
            { title: 'Security', links: ['GDPR', 'Data Safety', 'Certificates', 'Uptime'] }
          ].map((col, idx) => (
            <div key={idx} style={{ flex: 1, minWidth: '120px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '20px', color: THEME.colors.gray100 }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        textDecoration: 'none',
                        color: THEME.colors.gray500,
                        fontSize: '13px',
                        transition: THEME.transition
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = THEME.colors.purple500;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = THEME.colors.gray500;
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#1F2937', marginBottom: '32px' }} />

        {/* Copyright Bar */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            color: THEME.colors.gray500,
            fontSize: '13px'
          }}
        >
          <span>© {new Date().getFullYear()} Hostel Help. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: THEME.colors.gray500, textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: THEME.colors.gray500, textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
