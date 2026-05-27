import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Submit Complaints',
      desc: 'Students can easily report lodging, electrical, plumbing, or internet issues in seconds.',
      icon: '📝',
    },
    {
      title: 'Track Status',
      desc: 'Real-time status updates from Pending, Assigned, In Progress, to Resolved or Rejected.',
      icon: '⏳',
    },
    {
      title: 'Warden Assignment',
      desc: 'Admin assigns appropriate wardens to specific complaint categories instantly.',
      icon: '👷',
    },
    {
      title: 'Admin Dashboard',
      desc: 'A powerful backend panel for managing users, categories, and resolving backlogs.',
      icon: '📊',
    },
    {
      title: 'Real-time Updates',
      desc: 'Get instant feedback on actions taken by wardens regarding your issues.',
      icon: '🔔',
    },
    {
      title: 'Secure Access',
      desc: 'Protected role-based authorization using Spring Security 6 & JWT auth.',
      icon: '🛡️',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Submit Issue',
      desc: 'Create an account and submit a detailed complaint with its category.',
      icon: '✍️',
    },
    {
      number: '02',
      title: 'Admin Review',
      desc: 'Admin logs in, inspects new complaints, and assigns them to the appropriate warden.',
      icon: '🔍',
    },
    {
      number: '03',
      title: 'Warden Action',
      desc: 'The warden accepts the task, resolves the issue, and leaves a response remark.',
      icon: '🛠️',
    },
  ];

  return (
    <div style={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero} id="home">
        <div style={styles.heroContent}>
          <span style={styles.badge}>🏠 Modern Hostel Living</span>
          <h1 style={styles.heroTitle}>
            Smart Hostel <br />
            <span style={styles.gradientText}>Complaint Management</span>
          </h1>
          <p style={styles.heroSub}>
            Hostel Help is the unified workspace for students, wardens, and administrators. 
            Submit reports, assign tasks, and track maintenance resolutions in real-time.
          </p>
          <div style={styles.heroBtns}>
            <button onClick={() => navigate('/login')} style={styles.primaryBtn}>
              Get Started
            </button>
            <a href="#features" style={styles.secondaryBtn}>
              Learn More
            </a>
          </div>
        </div>
        <div style={styles.heroGraphic}>
          <div style={styles.illustrationContainer}>
            <svg viewBox="0 0 500 400" width="100%" height="100%" style={styles.svg}>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              {/* Background Shapes */}
              <circle cx="400" cy="100" r="80" fill="url(#grad2)" opacity="0.15" />
              <rect x="50" y="250" width="120" height="120" rx="20" fill="url(#grad1)" opacity="0.1" transform="rotate(15 110 310)" />
              {/* Central Dashboard Frame */}
              <rect x="100" y="80" width="300" height="220" rx="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="4" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.05))" />
              {/* Header Bar */}
              <rect x="100" y="80" width="300" height="40" rx="16" fill="#f8fafc" />
              <circle cx="130" cy="100" r="6" fill="#ef4444" />
              <circle cx="150" cy="100" r="6" fill="#eab308" />
              <circle cx="170" cy="100" r="6" fill="#22c55e" />
              {/* Content mockups inside SVG */}
              <rect x="120" y="140" width="160" height="18" rx="4" fill="#e2e8f0" />
              <rect x="120" y="170" width="260" height="10" rx="2" fill="#f1f5f9" />
              <rect x="120" y="190" width="220" height="10" rx="2" fill="#f1f5f9" />
              {/* Action Buttons Mockup */}
              <rect x="120" y="230" width="70" height="24" rx="6" fill="url(#grad1)" />
              <rect x="200" y="230" width="70" height="24" rx="6" fill="url(#grad2)" />
              {/* Status Badge Mockup */}
              <rect x="300" y="137" width="70" height="22" rx="11" fill="#d1fae5" />
              <text x="335" y="152" fill="#065f46" fontSize="10" fontWeight="bold" textAnchor="middle">RESOLVED</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={styles.stats}>
        <div style={styles.statsInner}>
          <div style={styles.statItem}>
            <p style={styles.statNumber}>500+</p>
            <p style={styles.statLabel}>Active Students</p>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <p style={styles.statNumber}>50+</p>
            <p style={styles.statLabel}>Assigned Wardens</p>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <p style={styles.statNumber}>99%</p>
            <p style={styles.statLabel}>Resolution Rate</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features} id="features">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Key Application Features</h2>
          <p style={styles.sectionSubtitle}>Everything you need to run clean, responsive and timely hostel maintenance</p>
        </div>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works Section */}
      <section style={styles.howItWorks} id="how-it-works">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Simple 3-step lifecycle of complaints from submission to resolution</p>
        </div>
        <div style={styles.stepsContainer}>
          {steps.map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepHeader}>
                <span style={styles.stepNumber}>{s.number}</span>
                <span style={styles.stepIcon}>{s.icon}</span>
              </div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section Mock */}
      <section style={styles.contact} id="contact">
        <div style={styles.contactCard}>
          <h2 style={styles.contactTitle}>Need Assistance or Custom Setup?</h2>
          <p style={styles.contactText}>
            Our administration support is here to help you deploy Hostel Help for your campus. Get in touch today.
          </p>
          <button onClick={() => navigate('/register')} style={styles.contactBtn}>
            Join as a Student
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>🏠 Hostel Help</span>
            <p style={styles.footerDesc}>
              A comprehensive system for resolving accommodation, electrical, internet, and plumbing issues in modern campus hostels.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerLinkTitle}>Quick Links</h4>
            <a href="#home" style={styles.footerLink}>Home</a>
            <a href="#features" style={styles.footerLink}>Features</a>
            <a href="#how-it-works" style={styles.footerLink}>How it works</a>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerLinkTitle}>Authentication</h4>
            <span onClick={() => navigate('/login')} style={styles.footerLinkClick}>Login</span>
            <span onClick={() => navigate('/register')} style={styles.footerLinkClick}>Register</span>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>&copy; {new Date().getFullYear()} Hostel Help. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    scrollBehavior: 'smooth',
  },
  hero: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 24px',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '48px',
    alignItems: 'center',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  heroTitle: {
    fontSize: '44px',
    fontWeight: '800',
    lineHeight: '1.15',
    color: '#1e293b',
    marginBottom: '20px',
  },
  gradientText: {
    color: '#4f46e5',
  },
  heroSub: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#64748b',
    marginBottom: '32px',
    maxWidth: '520px',
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
  },
  primaryBtn: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
    transition: 'all 0.2s',
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    color: '#4f46e5',
    border: '1.5px solid #e2e8f0',
    padding: '14px 28px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '15px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  heroGraphic: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
  },
  svg: {
    borderRadius: '16px',
  },
  stats: {
    backgroundColor: '#e0f2fe',
    padding: '40px 24px',
  },
  statsInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#0369a1',
    margin: 0,
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0ea5e9',
    margin: '4px 0 0 0',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: '#bae6fd',
  },
  features: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '90px 24px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '12px',
  },
  sectionSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    fontSize: '32px',
    display: 'inline-block',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  featureDesc: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#64748b',
    margin: 0,
  },
  howItWorks: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    padding: '90px 24px',
  },
  stepsContainer: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
  },
  stepCard: {
    position: 'relative',
    textAlign: 'center',
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  stepNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#e2e8f0',
  },
  stepIcon: {
    fontSize: '36px',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px',
  },
  stepDesc: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#64748b',
    maxWidth: '280px',
    margin: '0 auto',
  },
  contact: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '95px 24px',
  },
  contactCard: {
    backgroundColor: '#4f46e5',
    borderRadius: '24px',
    padding: '60px 40px',
    textAlign: 'center',
    color: '#ffffff',
    boxShadow: '0 10px 30px rgba(79, 70, 229, 0.15)',
  },
  contactTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#ffffff',
  },
  contactText: {
    fontSize: '16px',
    color: '#c7d2fe',
    maxWidth: '600px',
    margin: '0 auto 32px auto',
    lineHeight: '1.6',
  },
  contactBtn: {
    backgroundColor: '#ffffff',
    color: '#4f46e5',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '64px 24px 32px 24px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '48px',
    marginBottom: '48px',
  },
  footerBrand: {},
  footerLogo: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#4f46e5',
    display: 'block',
    marginBottom: '16px',
  },
  footerDesc: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    maxWidth: '360px',
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerLinkTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  footerLinkClick: {
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  footerBottom: {
    borderTop: '1px solid #f1f5f9',
    maxWidth: '1200px',
    margin: '0 auto',
    paddingTop: '24px',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: 0,
  },
};

export default Landing;
